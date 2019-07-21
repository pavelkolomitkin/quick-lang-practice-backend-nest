import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {Exclude, Expose, Transform} from 'class-transformer';
import {User} from './user.model';
import {UserContact} from './user-contact.model';

@Exclude()
export class ContactMessage extends BaseEntityModel implements Document
{
    @Expose()
    text: string;

    @Expose()
    author: User;

    @Exclude()
    contacts: UserContact[];

    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;
}
