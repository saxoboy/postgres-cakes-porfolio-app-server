import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      singOptions: {
        expiresIn: configService.get('JWT_EXPIRATION_TIME'),
      },
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    return await this.authService.validateUser(id);
  }
}
