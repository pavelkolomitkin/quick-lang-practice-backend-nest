import { Document } from 'mongoose';
import {ClientUser} from './client-user.model';
import {Language} from './language.model';
import {LanguageLevel} from './language-level.model';
import {Exclude, Expose, Transform, Type} from 'class-transformer';
import {BaseEntityModel} from './base-entity.model';

@Exclude()
export class LanguageSkill extends BaseEntityModel implements Document {

    @Type(() => ClientUser)
    user: ClientUser;

    @Expose()
    @Type(() => Language)
    language: Language;

    @Expose()
    @Type(() => LanguageLevel)
    level: LanguageLevel;
}
