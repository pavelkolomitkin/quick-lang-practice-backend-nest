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

            //socket.request._query['token'];
            const token = socket.request._query['token'];
            if (!token)
            {
                next(new Error('Authorization Error'));
                return;
            }

            let user = null;

            try {
                user = await this.authService.getUser(token);
            }
            catch (error) {

            }

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
