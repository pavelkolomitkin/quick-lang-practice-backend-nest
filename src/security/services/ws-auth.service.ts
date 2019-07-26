import {Injectable} from '@nestjs/common';
import { Client } from 'socket.io';
import {JwtService} from '@nestjs/jwt';
import {SecurityService} from './security.service';

@Injectable()
export class WsAuthService
{
    constructor(
        private jwtService: JwtService,
        private securityService: SecurityService
    ) {}

    async getClientUser(client: Client)
    {
        const token = this.getToken(client);
        if (!token)
        {
            return null;
        }

        const payload = await this.jwtService.verify(token);
        if (!payload)
        {
            return null;
        }

        const { email } = payload;
        const user = await this.securityService.getActiveUserByEmail(email);
        return user;
    }

    private getToken(client): string
    {
        const authHeader = client.headers['authorization'];
        if (!authHeader)
        {
            return null;
        }

        const headerItems = authHeader.split('Bearer');
        if (headerItems.length !== 2)
        {
            return null;
        }

        return headerItems[1].trim();
    }
}
