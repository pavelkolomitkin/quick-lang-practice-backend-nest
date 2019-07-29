import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {Exclude, Expose, Transform, Type} from 'class-transformer';
import {User} from './user.model';
import {PracticeSessionStatus} from './practice-session-status.model';
import {LanguageSkill} from './language-skill.model';

@Exclude()
export class PracticeSession extends BaseEntityModel implements Document
{
    @Expose()
    caller: User;

    @Expose()
    callerPeer: string;

    @Expose()
    callee: User;

    @Expose()
    calleePeer: string;

    @Expose()
    skill: LanguageSkill;

    @Expose()
    progressStartTime: Date;

    @Expose()
    progressEndTime: Date;

    @Expose()
    status: PracticeSessionStatus;
}