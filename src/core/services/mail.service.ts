import {Injectable} from '@nestjs/common';
import {IMailService} from './mail-service.interface';
import {PasswordRestoreKey} from '../models/password-restore-key.model';
import {User} from '../models/user.model';
import {RegisterKey} from '../models/register-key.model';

@Injectable()
export class MailService implements IMailService
{
    async sendPasswordRestoreLink(restoreKey: PasswordRestoreKey): Promise<void> {
        return undefined;
    }

    async sendPasswordRestoreNotify(user: User): Promise<void> {
        return undefined;
    }

    async sendRegisterConfirmation(registerKey: RegisterKey): Promise<void> {
        return undefined;
    }

}
