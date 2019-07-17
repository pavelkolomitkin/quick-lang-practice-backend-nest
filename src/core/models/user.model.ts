import { Document } from 'mongoose';

import {Exclude, Expose, Transform} from 'class-transformer';
import {BaseEntityModel} from './base-entity.model';

@Exclude()
export class User extends BaseEntityModel implements Document {

    @Expose({ groups: ['mine', 'admin'] })
    email: string;

    @Exclude()
    password: string;

    @Expose()
    fullName: string;

    @Exclude()
    isActive: boolean;

    @Expose()
    avatar: any;

    @Exclude()
    createdAt: string;

    @Exclude()
    updatedAt: string;

    @Expose()
    roles: string[];
}
