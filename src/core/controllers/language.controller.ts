import {Controller, Get, Options, Inject} from '@nestjs/common';
import {Language} from '../models/language.model';
import { Model } from 'mongoose';
import {plainToClass} from 'class-transformer';

@Controller('common/language')
export class LanguageController {

    constructor(
        @Inject('Language') private readonly model: Model<Language>,
    ) {}

    @Get('list')
    async getLanguageList()
    {
        const list = await this.model.find({})
            .map((result) => {
                return result.map((item) => {
                    return item.serialize();
                });
            });

        return {
            languages: list,
        };
    }
}
