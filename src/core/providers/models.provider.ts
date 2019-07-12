import {Provider} from '@nestjs/common';
import { Connection } from 'mongoose';
import { ClientUserSchema } from '../schemas/client-user.schema';
import {UserSchema} from '../schemas/user.schema';
import {LanguageSchema} from '../schemas/language.schema';
import {LanguageLevelSchema} from '../schemas/language-level.schema';
import {LanguageSkillSchema} from '../schemas/language-skill.schema';
import {PasswordRestoreKeySchema} from '../schemas/password-restore-key.schema';
import {RegisterKeySchema} from '../schemas/register-key.schema';

export const models: Provider[] = [
    {
        provide: 'User',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
    },
    {
        provide: 'ClientUser',
        inject: ['User'],
        useFactory: (User) => User.discriminator('ClientUser', ClientUserSchema),
    },
    {
        provide: 'Language',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => connection.model('Language', LanguageSchema),
    },
    {
        provide: 'LanguageLevel',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => connection.model('LanguageLevel', LanguageLevelSchema),
    },
    {
        provide: 'LanguageSkill',
        inject: ['DATABASE_CONNECTION'],
        useFactory: (connection: Connection) => connection.model('LanguageSkill', LanguageSkillSchema),
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
