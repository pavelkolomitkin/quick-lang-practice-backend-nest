import {Controller, Get, Inject} from '@nestjs/common';
import {LanguageLevel} from '../models/language-level.model';
import { Model } from 'mongoose';
import {plainToClass} from 'class-transformer';

@Controller('common/language-level')
export class LanguageLevelController
{
    constructor(
        @Inject('LanguageLevel') private readonly model: Model<LanguageLevel>,
    ) {}

    @Get('list')
    async getLevelList()
    {
        const list = await this
            .model
            .find({})
            .lean()
            .map(result => result.map(item => plainToClass(LanguageLevel, item)));

        return {
            levels: list,
        };
    }
}
