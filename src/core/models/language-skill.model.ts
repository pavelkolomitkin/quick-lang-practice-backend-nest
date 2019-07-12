import { Document } from 'mongoose';
import {ClientUser} from './client-user.model';
import {Language} from './language.model';
import {LanguageLevel} from './language-level.model';
import {Exclude, Expose, Transform, Type} from 'class-transformer';
import {EntityIdModel} from './entity-id.model';

export class LanguageSkill extends EntityIdModel implements Document {

    @Expose({ name: '_id'})
    @Transform(value => value.toString())
    _id: string;

    @Exclude()
    @Type(() => ClientUser)
    user: ClientUser;

    @Expose()
    @Type(() => Language)
    language: Language;

    @Expose()
    @Type(() => LanguageLevel)
    level: LanguageLevel;
}
