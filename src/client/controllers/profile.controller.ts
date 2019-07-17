import {BadRequestException, Body, Controller, Get, Inject, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {ClientUser} from '../../core/models/client-user.model';
import { Model } from 'mongoose';
import {ProfileDto} from '../dto/profile.dto';
import {LanguageSkill} from '../../core/models/language-skill.model';
import {FileInterceptor} from '@nestjs/platform-express';
import {ImageThumbService} from '../../core/services/image-thumb.service';
import {UploadManagerService} from '../../core/services/upload-manager.service';

// TODO find the way of arranging nested routes
@Controller('client/profile')
@UseGuards(AuthGuard())
export class ProfileController
{
    constructor(
        @Inject('ClientUser') private readonly clientUserModel: Model<ClientUser>,
        @Inject('LanguageSkill') private readonly languageSkillModel: Model<LanguageSkill>,
        private readonly thumbService: ImageThumbService,
        private readonly uploadManager: UploadManagerService,
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

    @Put('practice-skill/off')
    async readyToPracticeSkillOff(@CurrentUser() user: ClientUser)
    {
        user.readyToPracticeSkill = null;
        // @ts-ignore
        await user.save();

        return { skill: null };
    }

    @Put('practice-skill/:id')
    async readyToPracticeSkillOn(
        @Param('id', new ParameterConverterPipe('LanguageSkill', 'id')) skill: LanguageSkill,
        @CurrentUser() user: ClientUser
        )
    {
        if (skill.user.toString() !== user.id.toString())
        {
            throw new BadRequestException('You can not use this skill!');
        }

        user.readyToPracticeSkill = skill;

        // @ts-ignore
        await user.save();

        // @ts-ignore
        return {
            // @ts-ignore
            skill: skill.serialize()
        };
    }

    @Post('avatar/upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadAvatar(@UploadedFile() file, @CurrentUser() user)
    {
        if (user.avatar)
        {
            try {
                await this.uploadManager.removeAvatar(user);
                await this.thumbService.removeUserAvatar(user);
            }
            catch (e) { }
        }

        user.setAvatar(file);
        await user.save();

        return user.serialize(['mine']);
    }

    @Put('avatar/remove')
    async removeAvatar(@CurrentUser() user)
    {
        try {
            await this.uploadManager.removeAvatar(user);
        }
        catch (e) {}


        user.setAvatar(null);
        await user.save();
        try {
            await this.thumbService.removeUserAvatar(user);
        }
        catch (e) {}

        return user.serialize(['mine']);
    }
}
