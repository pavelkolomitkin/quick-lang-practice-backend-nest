import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {SecurityService} from '../services/security.service';
import {WsAuthService} from '../services/ws-auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate
{
    constructor(
        private authService: WsAuthService
        ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const client = context.switchToWs().getClient();

        const user = await this.authService.getClientUser(client);
        if (!user)
        {
            return false;
        }

        context.switchToWs().getData().user = user;

        return true;
    }

}
