import {Validate} from 'class-validator';
import {EntityExistsValidator} from '../../core/validators/entity-exists.validator';

export class LanguageSkillDto
{
    @Validate(EntityExistsValidator, ['Language', '_id'], { message: 'The language does not exist!' })
    public language: number;

    @Validate(EntityExistsValidator, ['LanguageLevel', '_id'], { message: 'The language level does not exist!' })
    public level: number;
}
