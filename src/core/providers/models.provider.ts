import {Provider} from '@nestjs/common';
import { Connection } from 'mongoose';
import { ClientUserSchema } from '../schemas/client-user.schema';
import {UserSchema} from '../schemas/user.schema';
import {LanguageSchema} from '../schemas/language.schema';
import {LanguageLevelSchema} from '../schemas/language-level.schema';
import {LanguageSkillSchema} from '../schemas/language-skill.schema';
import {PasswordRestoreKeySchema} from '../schemas/password-restore-key.schema';
import {RegisterKeySchema} from '../schemas/register-key.schema';
import {plainToClass} from 'class-transformer';
import {User} from '../models/user.model';
import {ClientUser} from '../models/client-user.model';
import {Language} from '../models/language.model';
import {LanguageLevel} from '../models/language-level.model';
import {LanguageSkill} from '../models/language-skill.model';
import {BaseEntityModel} from '../models/base-entity.model';

const serialize = function(modelClass, groups: string[] = []) {

    const plainObject = this.toObject();

    const result = plainToClass(modelClass, plainObject, { groups: groups });
    return result
};

const createSerializer = (modelClasses: any[]) => {
    return function (groups: string[] = []) {

        const classes = [BaseEntityModel, ...modelClasses ];

        let result = {};
        for (let modelClass of classes)
        {
            result = { ...result, ...serialize.call(this, modelClass, groups) };
        }

        return result;
    }
};

export const models: Provider[] = [
    {
        provide: 'User',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => {

            UserSchema.methods.serialize = createSerializer([User]);
            return connection.model('User', UserSchema)
        },
    },
    {
        provide: 'ClientUser',
        inject: ['User'],
        useFactory: (UserModel) => {

            ClientUserSchema.methods.serialize = createSerializer([User, ClientUser]);
            return UserModel.discriminator('ClientUser', ClientUserSchema);
        },
    },
    {
        provide: 'Language',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => {

            LanguageSchema.methods.serialize = createSerializer([Language]);
            return connection.model('Language', LanguageSchema);

        },
    },
    {
        provide: 'LanguageLevel',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => {

            LanguageLevelSchema.methods.serialize = createSerializer([LanguageLevel]);
            return connection.model('LanguageLevel', LanguageLevelSchema)
        },
    },
    {
        provide: 'LanguageSkill',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => {
            LanguageSkillSchema.methods.serialize = createSerializer([LanguageSkill]);
            return connection.model('LanguageSkill', LanguageSkillSchema)
        },
    },
    {
        provide: 'PasswordRestoreKey',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => connection.model('PasswordRestoreKey', PasswordRestoreKeySchema),
    },
    {
        provide: 'RegisterKey',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => connection.model('RegisterKey', RegisterKeySchema),
    },
];
