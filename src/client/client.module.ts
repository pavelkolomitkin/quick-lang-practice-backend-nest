import { Module } from '@nestjs/common';
import {ProfileController} from './controllers/profile.controller';
import {LanguageSkillController} from './controllers/language-skill.controller';
import {MessagesGateway} from './gateways/messages.gateway';

@Module({
    controllers: [
        ProfileController,
        LanguageSkillController
    ],
    providers: [
        MessagesGateway
    ]
})
export class ClientModule {}
