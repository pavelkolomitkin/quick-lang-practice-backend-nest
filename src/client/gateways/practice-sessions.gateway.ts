import {Inject, Injectable} from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import {WsJwtGuard} from '../../security/guards/ws-jwt.guard';
import { Model, Types } from 'mongoose';
import {PracticeSession} from '../../core/models/practice-session.model';
import {PracticeSessionService} from '../services/practice-session.service';
import {PracticeSessionStatusCodes} from '../../core/schemas/practice-session-status.schema';

@Injectable()
@WebSocketGateway({
    namespace: 'practice-sessions'
})
export class PracticeSessionsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private guard: WsJwtGuard,
        @Inject('PracticeSession') private readonly practiceSessionModel: Model<PracticeSession>,
        private service: PracticeSessionService
    ) {}

    afterInit(server: Server): any {

        this.guard.authorize(server);
    }

    handleConnection(client: Client, ...args: any[]): any
    {
        // @ts-ignore
        const { user } = client;

        // @ts-ignore
        client.sessionStream = this.practiceSessionModel.watch([
            {
                $match: {
                    $or: [
                        { 'fullDocument.caller': new Types.ObjectId(user.id) },
                        { 'fullDocument.callee': new Types.ObjectId(user.id) },
                    ]
                }
            }
        ], { fullDocument: 'updateLookup' });

        // @ts-ignore
        client.sessionStream.on('change', async ( data ) => {

            console.log('PRACTICE SESSION HAS BEEN UPDATED...');
            console.log(data);

            const { fullDocument } = data;
            const session = await this.practiceSessionModel.findById(fullDocument._id)
                .populate('caller')
                .populate('callee')
                .populate('status');

            let sessionEventName = null;

            switch (session.status.code) {

                case PracticeSessionStatusCodes.INITIALIZED:

                    sessionEventName = 'practice_session_init';

                    break;

                case PracticeSessionStatusCodes.UN_ANSWERED:

                    sessionEventName = 'practice_session_unanswered';

                    break;

                case PracticeSessionStatusCodes.IN_PROCESS:

                    sessionEventName = 'practice_session_in_process';

                    break;

                case PracticeSessionStatusCodes.ENDED:

                    sessionEventName = 'practice_session_ended';

                    break;
            }

            if (sessionEventName)
            {

                console.log(session);
                // @ts-ignore
                client.emit(sessionEventName, this.serializeSession(session));
            }
        });
    }

    async handleDisconnect(client: Client): Promise<any> {

        // @ts-ignore
        const { user } = client;
        await this.service.closeAllUserSessions(user);


        // @ts-ignore
        client.sessionStream.close();
        // @ts-ignore
        client.sessionStream = null;

        // @ts-ignore
        client.conn.close();
        // @ts-ignore
        client.removeAllListeners();
        // @ts-ignore
        client.disconnect(true);
    }

    serializeSession(session: PracticeSession)
    {
        return {
            // @ts-ignore
            ...session.serialize(),
            // @ts-ignore
            caller: session.caller.serialize(),
            // @ts-ignore
            callee: session.callee.serialize(),
            // @ts-ignore
            skill: session.skill.serialize(),
        };
    }

}