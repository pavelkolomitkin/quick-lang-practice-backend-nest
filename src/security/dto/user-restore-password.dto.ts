import {Equals, MinLength, Validate} from 'class-validator';
import {PasswordRestoreKeyValidator} from '../validators/password-restore-key.validator';
import {UserPasswordsEqualValidator} from '../validators/user-passwords-equal.validator';

export class UserRestorePasswordDto {

    @Validate(PasswordRestoreKeyValidator)
    key: string;

    @MinLength(6, { message: 'Minimum 6 symbols!' })
    @Validate(UserPasswordsEqualValidator)
    password: string;

    @MinLength(6, { message: 'Minimum 6 symbols!' })
    passwordRepeat: string;
}
