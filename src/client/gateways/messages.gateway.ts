import { Model, Types } from 'mongoose';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import {Inject, Injectable} from '@nestjs/common';
import {WsJwtGuard} from '../../security/guards/ws-jwt.guard';
import {User} from '../../core/models/user.model';
import {ContactMessageLog} from '../../core/models/contact-message-log.model';
import {ContactMessage} from '../../core/models/contact-message.model';
import {ContactMessageLogActions} from '../../core/schemas/contact-message-log.schema';
import {UserActivity} from '../../core/models/user-activity.model';
import {ActivityTypes} from '../../core/schemas/user-activity.schema';


@Injectable()
@WebSocketGateway({
    namespace: 'messages'
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    users: User[] = [];

    @WebSocketServer()
    server: Server;

    constructor(
        @Inject('ContactMessageLog') private readonly messageLogModel: Model<ContactMessageLog>,
        @Inject('ContactMessage') private readonly messageModel: Model<ContactMessage>,
        @Inject('UserActivity') private readonly userActivityModel: Model<UserActivity>,
        private guard: WsJwtGuard,
    ) {}

    afterInit(server: Server): any
    {
        //console.log('AFTER INIT SERVER');

        this.guard.authorize(server);
    }

    handleConnection(client: Client, ...args: any[]): any
    {
        //console.log('Client is connected!');
        // @ts-ignore
        const { user } = client;
        // @ts-ignore
        client.messageStream = this
            .messageLogModel
            .watch([
                { $match: {
                    'operationType': 'insert',
                    'fullDocument.addressee': new Types.ObjectId(user.id)
                } },
            ]);


        // @ts-ignore
        client.messageStream.on('change', async (message) => {

            const { fullDocument } = message;

            let messageEntity = null;
            if (fullDocument.action === ContactMessageLogActions.REMOVE)
            {
                messageEntity = await this
                    .messageModel
                    .findOneDeleted({ _id: fullDocument.message})
                    .populate('author');
            }
            else
            {
                messageEntity = await this
                    .messageModel
                    .findById(fullDocument.message)
                    .populate('author');
            }

            const author = messageEntity.author.serialize();
            messageEntity = {
                ...messageEntity.serialize(),
                author
            };

            //console.log(message);

            switch (fullDocument.action) {

                case ContactMessageLogActions.ADD:

                    // @ts-ignore
                    client.emit('message_new', messageEntity);
                    break;

                case ContactMessageLogActions.EDIT:

                    // @ts-ignore
                    client.emit('message_edited', messageEntity);
                    break;

                case ContactMessageLogActions.REMOVE:

                    //console.log('MESSAGE HAS BEEN REMOVED!');
                    // @ts-ignore
                    client.emit('message_remove', messageEntity);
                    break;
            }
        });

        // @ts-ignore
        client.userActivityStream = this
            .userActivityModel
            .watch([
                { $match: {
                        'operationType': 'update',
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

                case ActivityTypes.TYPING:

                    if (fullDocument.payload)
                    {
                        // @ts-ignore
                        client.emit('activity_typing', fullDocument.user.serialize());
                    }

                    break;

            }

        });
    }

    handleDisconnect(client: Client): any
    {
        //console.log('Client is disconnected!');

        // @ts-ignore
        client.messageStream.close();
        // @ts-ignore
        client.messageStream = null;

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

    //==================== SUBSCRIBERS ========================


    //==================== Working with the contact list ======

    //==================// Working with the contact list ======


    //==================== Working with a certain contact =====

    // A user opens a certain contact

    // A user is typing

    @SubscribeMessage('typing')
    async handleUserTyping(client: Client, data: { addresseeId: string })
    {
        await this.userActivityModel.updateOne(
            {
                addressee: new Types.ObjectId(data.addresseeId),
                // @ts-ignore
                user: new Types.ObjectId(client.user.id)
            },
            {
                addressee: new Types.ObjectId(data.addresseeId),
                // @ts-ignore
                user: new Types.ObjectId(client.user.id),
                type: ActivityTypes.TYPING,
                payload: true
            },
            {
                upsert: true,
                'new': false
            }
        );
    }
    // A user sends a message

    // Remove a message

    // Edit a message

    // Block the contact

    //==================// Working with a certain contact =====

    //==================// SUBSCRIBERS ========================

}
