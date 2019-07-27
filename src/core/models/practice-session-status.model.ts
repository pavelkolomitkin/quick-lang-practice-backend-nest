import { Document } from 'mongoose';
import {BaseEntityModel} from './base-entity.model';
import {Exclude, Expose, Transform, Type} from 'class-transformer';

@Exclude()
export class PracticeSessionStatus extends BaseEntityModel implements Document
{
    @Expose()
    title: string;

    @Expose()
    code: string;
}