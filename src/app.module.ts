import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: async (jwtService: JwtService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req, connection }) =>
          connection ? { req: connection.context } : { req },
        // context({ req }) {
        //   const token = req.headers.authorization?.replace('Bearer ', '');
        //   if (!token) throw Error('Token needed');
        //   const payload = jwtService.decode(token);
        //   if (!payload) throw Error('Token not valid');
        // },
      }),
    }),

    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
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
    CakesModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //Todo: Borrar
  constructor() {
    console.log('Variables de entorno');
    console.log('STATE', process.env.STATE);
    console.log('host', process.env.DB_HOST);
    console.log('port', +process.env.DB_PORT);
    console.log('username', process.env.DB_POSTGRES_USER);
    console.log('password', process.env.DB_POSTGRES_PASSWORD);
    console.log('database', process.env.DB_POSTGRES_DB);
  }
}
