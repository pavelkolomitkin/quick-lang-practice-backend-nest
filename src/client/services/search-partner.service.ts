import { Model, Types} from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {Language} from '../../core/models/language.model';
import {ClientUser} from '../../core/models/client-user.model';
import {LanguageSkill} from '../../core/models/language-skill.model';

@Injectable()
export class SearchPartnerService
{
    constructor(
        @Inject('ClientUser') private readonly userModel: Model<ClientUser>,
        @Inject('LanguageSkill') private readonly skillModel: Model<LanguageSkill>
    ) {}

    async getUsers(language: Language, limit: number = 20, offset: number = 0)
    {

        const skills = await this.skillModel.find({
            'language': language.id
        })
            .populate({
                path: 'user',
                populate: {
                    path: 'skills',
                    model: 'LanguageSkill'
                }
            })
            .sort({
                'level': -1
            })
            .skip(offset)
            .limit(limit);

        const result = skills.map(item => item.user);

        return result;
    }
}