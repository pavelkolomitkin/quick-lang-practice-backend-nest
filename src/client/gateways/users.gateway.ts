import {Inject, Injectable} from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import {UserActivity} from '../../core/models/user-activity.model';
import {WsJwtGuard} from '../../security/guards/ws-jwt.guard';
import { Model, Types } from 'mongoose';
import {ActivityTypes} from '../../core/schemas/user-activity.schema';

@Injectable()
@WebSocketGateway({
    namespace: 'users'
})
export class UsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject('UserActivity') private readonly userActivityModel: Model<UserActivity>,
        private guard: WsJwtGuard,
    ) {}


    afterInit(server: Server): any {

        this.guard.authorize(server);

    }

    handleConnection(client: Client, ...args: any[]): any {

        // @ts-ignore
        const { user } = client;

        // @ts-ignore
        client.userActivityStream = this
            .userActivityModel
            .watch([
                    { $match: {
                            'fullDocument.addressee': new Types.ObjectId(user.id)
                        }
                    }
                ],
                { fullDocument: 'updateLookup' });

        // @ts-ignore
        client.userActivityStream.on('change', async (activity) => {

            const { fullDocument } = activity;
            await this.userActivityModel.populate(fullDocument, { path: 'user' });

            switch (fullDocument.type) {

                case ActivityTypes.BLOCK_USER:

                    // @ts-ignore
                    client.emit('user_block_addressee', fullDocument.user.serialize());

                    break;

                case ActivityTypes.UNBLOCK_USER:

                    // @ts-ignore
                    client.emit('user_unblock_addressee', fullDocument.user.serialize());

                    break;
            }

        });

    }

    handleDisconnect(client: Client): any {

        // @ts-ignore
        client.userActivityStream.close();
        // @ts-ignore
        client.userActivityStream = null;

        // @ts-ignore
        client.conn.close();
        // @ts-ignore
        client.removeAllListeners();
        // @ts-ignore
        client.disconnect(true);
    }

}
