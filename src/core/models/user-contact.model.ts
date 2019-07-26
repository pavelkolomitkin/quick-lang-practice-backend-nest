import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {Exclude, Expose, Transform} from 'class-transformer';
import {User} from './user.model';
import {ContactMessage} from './contact-message.model';

@Exclude()
export class UserContact extends BaseEntityModel implements Document
{
    @Exclude()
    user: User;

    @Expose()
    addressee: User;

    @Expose()
    newMessages: ContactMessage[];

    @Expose()
    lastMessage: ContactMessage;

    @Expose()
    lastMessageAddedAt: Date;

    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;
}
