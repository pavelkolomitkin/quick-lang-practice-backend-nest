import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {ContactMessage} from './contact-message.model';
import {Exclude, Expose} from 'class-transformer';
import {User} from './user.model';

@Exclude()
export class ContactMessageLog extends BaseEntityModel implements Document
{
    @Expose()
    message: ContactMessage;

    @Expose()
    addressee: User;

    @Expose()
    action: string;
}
