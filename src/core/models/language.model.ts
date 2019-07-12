import { Document } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import {EntityIdModel} from './entity-id.model';

export class Language extends EntityIdModel implements Document {

    @Expose({ name: '_id' })
    id: number;

    @Expose()
    name: string;

    @Expose()
    code: string;
}
