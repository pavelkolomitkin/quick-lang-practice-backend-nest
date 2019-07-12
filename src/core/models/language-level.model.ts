import { Document } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import {EntityIdModel} from './entity-id.model';

export class LanguageLevel extends EntityIdModel implements Document {

    @Expose({ name: '_id' })
    id: number;

    @Expose()
    level: number;

    @Expose()
    code: string;

    @Expose()
    title: string;
}
