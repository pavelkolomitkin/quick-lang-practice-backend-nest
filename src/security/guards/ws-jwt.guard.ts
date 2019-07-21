import {Injectable} from '@nestjs/common';
import { Client, Server } from 'socket.io';
import {JwtAuthService} from '../services/jwt-auth.service';

@Injectable()
export class WsJwtGuard
{
    constructor(
        private authService: JwtAuthService
        ) {
    }

    authorize(server: Server)
    {
        server.use(async (socket, next) => {

            console.log('THIS IS A WS MIDDLEWARE');
            //socket.request._query['token'];
            const token = socket.request._query['token'];
            if (!token)
            {
                next(new Error('Authorization Error'));
                return;
            }

            const user = await this.authService.getUser(token);
            if (!user)
            {
                next(new Error('Authorization Error'));
                return;
            }

            // @ts-ignore
            socket.user = user;
            next();

        })
    }
}
