import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CakesModule } from './cakes/cakes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
        jwtService: JwtService,
      ) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: configService.get<string>('STATE') === 'production',
          sortSchema: true,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          onConnect: async (connectionParams: { authorization: string }) => {
            console.log('Connection attempt with params:', connectionParams);
            if (connectionParams.authorization) {
              const token = connectionParams.authorization.split(' ')[1];
              const user = await jwtService.verifyAsync(token);
              console.log(user);
              return { user };
            }
            throw new Error('Missing auth token!');
          },
          context: ({ req, res, connection }) => {
            if (connection) {
              return { req, res, user: connection.context.user }; // Injecting pubSub into context
            }
            return { req, res };
          },
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_POSTGRES_USER,
      password: process.env.DB_POSTGRES_PASSWORD,
      database: process.env.DB_POSTGRES_DB,
      synchronize: true,
      autoLoadEntities: true,
      ssl:
        process.env.STATE === 'production'
          ? {
              rejectUnauthorized: false,
              sslmode: 'require',
            }
          : (false as any),
    }),
    UsersModule,
    AuthModule,
    CakesModule,
    SeedModule,
    CommonModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
