import { Document } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import {BaseEntityModel} from './base-entity.model';

export class LanguageLevel extends BaseEntityModel implements Document {

    @Expose({ name: '_id' })
    id: number;

    @Expose()
    level: number;

    @Expose()
    code: string;

    @Expose()
    title: string;
}
