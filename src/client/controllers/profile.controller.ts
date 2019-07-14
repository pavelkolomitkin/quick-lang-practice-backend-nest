import {Body, Controller, Get, Inject, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {ClientUser} from '../../core/models/client-user.model';
import { Model } from 'mongoose';
import {ProfileDto} from '../dto/profile.dto';
import {LanguageSkill} from '../../core/models/language-skill.model';
import {LanguageSkillDto} from '../dto/language-skill.dto';
import {Language} from '../../core/models/language.model';
import {LanguageLevel} from '../../core/models/language-level.model';

// TODO find the way of arranging nested routes
@Controller('client/profile')
@UseGuards(AuthGuard())
export class ProfileController
{
    constructor(
        @Inject('ClientUser') private readonly clientUserModel: Model<ClientUser>,
        @Inject('LanguageSkill') private readonly languageSkillModel: Model<LanguageSkill>
    ) {}


    @Get(':id')
    async getProfile(
        @Param('id', new ParameterConverterPipe('ClientUser', 'id')) profile,
        @CurrentUser() user
    )
    {
        await this.clientUserModel.populate(profile, [
            { path: 'skills' },
            { path: 'readyToPracticeSkill' }
        ]);

        const serializationGroups = [];
        if (profile.id === user.id)
        {
            serializationGroups.push('mine')
        }

        //debugger
        return profile.serialize(serializationGroups);
    }

    @Put('/')
    async edit(@Body() data: ProfileDto, @CurrentUser() profile: ClientUser)
    {
        profile.aboutYourSelf = data.aboutYourSelf;

        // @ts-ignore
        await profile.save();
    }
}
