import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {Exclude, Expose, Transform} from 'class-transformer';
import {User} from './user.model';

@Exclude()
export class UserContact extends BaseEntityModel implements Document
{
    @Exclude()
    user: User;

    @Expose()
    addressee: User;

}
