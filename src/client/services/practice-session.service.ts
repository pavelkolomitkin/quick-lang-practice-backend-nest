import { Model, Types } from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {User} from '../../core/models/user.model';
import {CoreException} from '../../core/exceptions/core.exception';
import {PracticeSession} from '../../core/models/practice-session.model';
import {PracticeSessionStatus} from '../../core/models/practice-session-status.model';
import {PracticeSessionStatusCodes} from '../../core/schemas/practice-session-status.schema';
import {LanguageSkill} from '../../core/models/language-skill.model';
import {ProfileService} from './profile.service';

@Injectable()
export class PracticeSessionService
{
    constructor(
        @Inject('PracticeSession') private readonly model: Model<PracticeSession>,
        @Inject('PracticeSessionStatus') private readonly statusModel: Model<PracticeSessionStatus>,
        private profileService: ProfileService
    ) {}

    async init(user: User, addressee: User, skill: LanguageSkill, peer: string)
    {
        if (user.id === addressee.id)
        {
            throw new CoreException('You can not to call yourself!');
        }

        if (user.id !== skill.user.toString())
        {
            throw new CoreException('Wrong skill parameter!');
        }

        const isUserBlocked = await this.profileService.isAddresseeBlocked(addressee, user);
        if (isUserBlocked)
        {
            throw new CoreException('The user has blocked you!');
        }

        const isAddresseeBlocked = await this.profileService.isAddresseeBlocked(user, addressee);
        if (isAddresseeBlocked)
        {
            throw new CoreException('You have blocked the user!');
        }


        // TODO: consider the case when user is online/offline
        // if user is not online
            // throw an exception
        const isAddresseeBusy: boolean = await this.isUserBusy(addressee);
        if (isAddresseeBusy)
        {
            throw new CoreException(addressee.fullName + ' is busy!');
        }

        const isUserBusy: boolean = await this.isUserBusy(user);
        if (isUserBusy)
        {
            throw new CoreException('You already have a session!');
        }
        // create a new session with the status called 'initialized'
        const initializedStatus = await this.getStatusByCode(PracticeSessionStatusCodes.INITIALIZED);
        const result = new this.model({
            caller: user,
            callerPeer: peer,
            callee: addressee,
            status: initializedStatus,
            skill: skill
        });

        await result.save();

        return result;
    }

    async end(session: PracticeSession, user: User)
    {
        this.validateMember(session, user);

        if (session.status.code === PracticeSessionStatusCodes.INITIALIZED)
        {
            session.status = await this.getStatusByCode(PracticeSessionStatusCodes.UN_ANSWERED);
            //@ts-ignore
            await session.save();

            return;
        }

        if (session.status.code === PracticeSessionStatusCodes.IN_PROCESS)
        {
            session.status = await this.getStatusByCode(PracticeSessionStatusCodes.ENDED);
            session.progressEndTime = new Date();
            //@ts-ignore
            await session.save();

            return;
        }

        throw new CoreException('The session is already ended!');
    }

    async accept(session: PracticeSession, user: User, peer: string)
    {
        this.validateMember(session, user);

        if (session.status.code === PracticeSessionStatusCodes.INITIALIZED)
        {
            session.status = await this.getStatusByCode(PracticeSessionStatusCodes.IN_PROCESS);
            session.progressStartTime = new Date();
            session.calleePeer = peer;
            //@ts-ignore
            await session.save();

            return;
        }

        throw new CoreException('The session is ended!');
    }

    async closeAllUserSessions(user: User)
    {
        const inProcessStatus = await this.getStatusByCode(PracticeSessionStatusCodes.IN_PROCESS);
        const endedStatus = await this.getStatusByCode(PracticeSessionStatusCodes.ENDED);
        const initializedStatus = await this.getStatusByCode(PracticeSessionStatusCodes.INITIALIZED);
        const unAnsweredStatus = await this.getStatusByCode(PracticeSessionStatusCodes.UN_ANSWERED);

        const endProcess = this.model.updateMany(
            {
                status: inProcessStatus,
                $or: [
                    { caller: user },
                    { callee: user }
                ]
            },
            {
                $set: {
                    status: endedStatus
                }
            }
        );

        const unAnsweredProcess = this.model.updateMany(
            {
                status: initializedStatus,
                $or: [
                    { caller: user },
                    { callee: user }
                ]
            },
            {
                $set: {
                    status: unAnsweredStatus
                }
            }
            );


        await endProcess;
        await unAnsweredProcess;
    }

    validateMember(session: PracticeSession, member: User)
    {
        if (
            (session.callee.id.toString() === member.id) ||
            (session.caller.id.toString() === member.id)
        )
        {
            return;
        }

        throw new CoreException('You are not a member');
    }

    async isUserBusy(user: User)
    {
        const busyStatus = await this.getStatusByCode(PracticeSessionStatusCodes.IN_PROCESS);

        const result = await this.model.findOne({
            status: busyStatus.id,
            $or: [
                { caller: user },
                { callee: user }
            ]
        });

        return !!result;
    }

    async getStatusByCode(code: string)
    {
        return await this.statusModel.findOne({
            code: code
        });
    }

    async getStatusesByCodes(codes: string[])
    {
        return await this.statusModel.find({
            code: {
                $in: codes
            }
        });
    }
}