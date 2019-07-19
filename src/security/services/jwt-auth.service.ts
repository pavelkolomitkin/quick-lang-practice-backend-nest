import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {SecurityService} from './security.service';

@Injectable()
export class JwtAuthService
{
    constructor(
        private jwtService: JwtService,
        private securityService: SecurityService
    ) {}

    async getUser(token: string)
    {
        const payload = await this.jwtService.verify(token);
        if (!payload)
        {
            return null;
        }

        const { email } = payload;
        const user = await this.securityService.getActiveUserByEmail(email);
        return user;
    }
}
