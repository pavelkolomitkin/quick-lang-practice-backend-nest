import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {Exclude, Expose} from 'class-transformer';
import {User} from './user.model';

@Exclude()
export class UserActivity extends BaseEntityModel implements Document
{
    @Expose()
    type: string;

    @Expose()
    user: User;

    @Expose()
    addressee: User;

    @Expose()
    payload: any;
}
