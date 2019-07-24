import { Module } from '@nestjs/common';
import {ProfileController} from './controllers/profile.controller';
import {LanguageSkillController} from './controllers/language-skill.controller';
import {MessagesGateway} from './gateways/messages.gateway';
import {UserContactService} from './services/user-contact.service';
import {ContactMessageService} from './services/contact-message.service';
import {UserContactController} from './controllers/user-contact.controller';
import {ContactMessageController} from './controllers/contact-message.controller';
import {ProfileService} from './services/profile.service';
import {UsersGateway} from './gateways/users.gateway';

@Module({
    controllers: [
        ProfileController,
        LanguageSkillController,
        UserContactController,
        ContactMessageController,
    ],
    providers: [
        UserContactService,
        ContactMessageService,
        ProfileService,
        UsersGateway,
        MessagesGateway,
    ]

})
export class ClientModule {}
