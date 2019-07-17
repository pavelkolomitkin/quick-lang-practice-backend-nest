import { Document } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import {BaseEntityModel} from './base-entity.model';

export class Language extends BaseEntityModel implements Document {

    @Expose({ name: '_id' })
    id: number;

    @Expose()
    name: string;

    @Expose()
    code: string;
}
