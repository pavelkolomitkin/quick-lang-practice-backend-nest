import { Model } from 'mongoose';
import {BadRequestException, Body, Controller, Delete, Inject, Param, Post, Put, UseGuards} from '@nestjs/common';
import {LanguageSkill} from '../../core/models/language-skill.model';
import {LanguageSkillDto} from '../dto/language-skill.dto';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {Language} from '../../core/models/language.model';
import {LanguageLevel} from '../../core/models/language-level.model';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {ClientUser} from '../../core/models/client-user.model';
import {AuthGuard} from '@nestjs/passport';
import {ValidationItemError} from '../../core/exceptions/validation-item.error';

@Controller('client/skill')
@UseGuards(AuthGuard())
export class LanguageSkillController
{
    constructor(@Inject('LanguageSkill') private readonly languageSkillModel: Model<LanguageSkill>) {}

    @Post()
    async add(
        @Body() data: LanguageSkillDto,
        @Body('language', new ParameterConverterPipe('Language', 'id')) language: Language,
        @Body('level', new ParameterConverterPipe('LanguageLevel', 'id')) level: LanguageLevel,
        @CurrentUser() user
    )
    {
        const existedSkill = user.skills.find((item) => {
            return (item.language.id === language.id);
        });
        if (existedSkill)
        {
            throw new BadRequestException([
                new ValidationItemError('language', { exists: 'You have got this skill already!' })
            ]);
        }


        const result = new this.languageSkillModel({
            level: level,
            language: language,
            user: user
        });

        await result.save();
        user.skills.push(result);
        await user.save();

        return {
            skill: {
                id: result.id,
                language: result.language.serialize(),
                level: result.level.serialize()
            }
        }
    }

    @Put(':id')
    async update(
        @Body('level', new ParameterConverterPipe('LanguageLevel', 'id')) level: LanguageLevel,
        @Param('id', new ParameterConverterPipe('LanguageSkill', 'id')) skill: LanguageSkill,
        @CurrentUser() user: ClientUser
        )
    {
        debugger
        if (skill.user.toString() !== user.id.toString())
        {
            throw new BadRequestException('You can not edit this skill!');
        }

        skill.level = level;

        // @ts-ignore
        await skill.save();


        return {
            skill: {
                id: skill.id,
                // @ts-ignore
                language: skill.language.serialize(),
                // @ts-ignore
                level: skill.level.serialize()
            }
        }
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParameterConverterPipe('LanguageSkill', 'id')) skill: LanguageSkill,
        @CurrentUser() user: ClientUser
    )
    {
        if (skill.user.toString() !== user.id.toString())
        {
            throw new BadRequestException('You can not edit this skill!');
        }

        // @ts-ignore
        await skill.remove();
    }
}
