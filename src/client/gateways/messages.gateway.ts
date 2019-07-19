import { Model } from 'mongoose';
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
import {ContactMessage} from '../../core/models/contact-message.model';
import {WsAuthService} from '../../security/services/ws-auth.service';
import {JwtService} from '@nestjs/jwt';
import {JwtAuthService} from '../../security/services/jwt-auth.service';


@Injectable()
@WebSocketGateway({
    namespace: 'messages'
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject('ContactMessage') private readonly messageModel: Model<ContactMessage>,
        private authService: JwtAuthService
    ) {}

    afterInit(server: Server): any
    {
        console.log('AFTER INIT SERVER');

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

        });
    }

    handleConnection(client: Client, ...args: any[]): any
    {
        console.log('Client is connected!');
        //debugger
        // @ts-ignore
        const { user } = client;
        if (user)
        {
            const messageStream = this.messageModel.watch();

            messageStream.on('change', (message) => {
                console.log('NEW MESSAGE');
                console.log(message);

                // @ts-ignore
                client.emit('new_message', message);
            });

        }
        else
        {
            // @ts-ignore
            client.disconnect();
        }
        // TODO get current user

        // watch new message number

        // watch new messages
        // const newMessageStream = this.messageModel.watch();
        // newMessageStream.on('change', (next) => {
        //
        //     console.log(next);
        //     client.conn.emit('newMessage', next);
        // });

    }

    handleDisconnect(client: Client): any
    {
        console.log('Client is disconnected!');
    }

    //==================== SUBSCRIBERS ========================

    @SubscribeMessage('test')
    handleTestMessage(client: Client, data: any)
    {
        console.log('Message "Test" is here!');

        // @ts-ignore
        client.emit('test_receive', {
            message: 'Hello from server!',
            data: data
        });
    }


    //==================== Working with the contact list ======

    // Remove a contact

    //==================// Working with the contact list ======


    //==================== Working with a certain contact =====

    // A user opens a certain contact

    // A user is typing

    // A user sends a message

    // Remove a message

    // Edit a message

    // Block the contact

    //==================// Working with a certain contact =====

    //==================// SUBSCRIBERS ========================

}
