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
import {PracticeSessionsGateway} from './gateways/practice-sessions.gateway';
import {PracticeSessionController} from './controllers/practice-session.controller';
import {PracticeSessionService} from './services/practice-session.service';

@Module({
    controllers: [
        ProfileController,
        LanguageSkillController,
        UserContactController,
        ContactMessageController,
        PracticeSessionController,
    ],
    providers: [
        UserContactService,
        ContactMessageService,
        ProfileService,
        PracticeSessionService,
        UsersGateway,
        MessagesGateway,
        PracticeSessionsGateway
    ]

})
export class ClientModule {}
