import { Model, Types} from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {Language} from '../../core/models/language.model';
import {ClientUser} from '../../core/models/client-user.model';
import {LanguageSkill} from '../../core/models/language-skill.model';
import {options} from 'tsconfig-paths/lib/options';

@Injectable()
export class SearchPartnerService
{
    constructor(
        @Inject('ClientUser') private readonly userModel: Model<ClientUser>,
        @Inject('LanguageSkill') private readonly skillModel: Model<LanguageSkill>
    ) {}

    async getUsers(language: Language, limit: number = 20, offset: number = 0)
    {
        const skills = await this.skillModel.aggregate([
            //@ts-ignore
            { $match: { language: language._id } },
            { $lookup: { from: 'languagelevels', localField: 'level', foreignField: '_id', as: 'level' } },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            {
                '$unwind': '$user'
            },
            {
                '$unwind': '$level'
            },
            { $sort: { 'level.level': -1, 'user.lastActivity': -1 } },
            { $project: {
                    'user._id': 1,
                    'user.lastActivity': 1,
                    'level.level': 1
                }
            },
        ])
            .skip(offset)
            .limit(limit);

        const userIds = skills.map(item => item.user._id );
        const users = await this.userModel.find({
            _id: {
                $in: userIds
            }
        })
            .populate({
                path: 'skills',
                populate: {
                    path: 'skills',
                    model: 'LanguageSkill'
                }
            })
            .populate('readyToPracticeSkill');

        const result = userIds.map((userId) => {
            return users.find((user) => user.id === userId.toString());
        });

        return result;
    }
}