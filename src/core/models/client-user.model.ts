import { User } from './user.model';
import {Exclude, Expose, Transform, Type} from 'class-transformer';
import {LanguageSkill} from './language-skill.model';

@Exclude()
export class ClientUser extends User
{
    @Expose()
    aboutYourSelf: string;

    @Expose()
    @Type(() => LanguageSkill)
    skills: LanguageSkill[];

    @Expose()
    @Type(() => LanguageSkill)
    readyToPracticeSkill?: LanguageSkill;
}
