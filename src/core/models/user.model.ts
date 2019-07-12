import { Document } from 'mongoose';

import { Exclude, Expose, Transform } from 'class-transformer';
import {EntityIdModel} from './entity-id.model';

export class User extends EntityIdModel implements Document {

    @Transform(value => value.toString())
    _id: string;

    @Exclude()
    email: string;

    @Exclude()
    password: string;

    @Expose()
    fullName: string;

    @Exclude()
    isActive: boolean;

    @Exclude()
    createdAt: string;

    @Exclude()
    updatedAt: string;

    @Expose({ name: 'roles' })
    getRoles(): string[]
    {
        return ['ROLE_USER'];
    }
}
