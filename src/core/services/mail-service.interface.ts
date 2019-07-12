import {RegisterKey} from '../models/register-key.model';
import {PasswordRestoreKey} from '../models/password-restore-key.model';
import {User} from '../models/user.model';

export interface IMailService {

    sendRegisterConfirmation(registerKey: RegisterKey): Promise<void>;

    sendPasswordRestoreLink(restoreKey: PasswordRestoreKey): Promise<void>;

    sendPasswordRestoreNotify(user: User): Promise<void>;

}
