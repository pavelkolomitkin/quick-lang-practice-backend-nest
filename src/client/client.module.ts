import { Module } from '@nestjs/common';
import {ProfileController} from './controllers/profile.controller';
import {LanguageSkillController} from './controllers/language-skill.controller';

@Module({
    controllers: [
        ProfileController,
        LanguageSkillController
    ]
})
export class ClientModule {}
