import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {SecurityService} from './security.service';
import {ConfigService} from '../config/config.service';
import {JwtPayload} from './models/jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(
        private readonly service: SecurityService,
        private readonly config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('APP_SECRET'),
        });
    }

    async validate({ email }: JwtPayload)
    {
        const user = await this.service.getActiveUserByEmail(email);
        if (!user)
        {
            throw new UnauthorizedException();
        }


        return user;
    }
}
