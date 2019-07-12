import {IMailService} from './mail-service.interface';
import {PasswordRestoreKey} from '../models/password-restore-key.model';
import {User} from '../models/user.model';
import {RegisterKey} from '../models/register-key.model';

export class MailDevService implements IMailService
{
    async sendPasswordRestoreLink(restoreKey: PasswordRestoreKey): Promise<void> {

        console.log(`Sending the restore password link to email ${ restoreKey.user.email }...`);
        console.log(`Restore password link: http://localhost:4200/security/password-recovery/${restoreKey.key}`);

    }

    async sendPasswordRestoreNotify(user: User): Promise<void> {

    }

    async sendRegisterConfirmation(registerKey: RegisterKey): Promise<void> {

        console.log(`Sending the registration key to ${ registerKey.client.email }`);
        console.log(`Activation link: http://localhost:4200/security/register-confirm/${ registerKey.key }`);
    }

}
