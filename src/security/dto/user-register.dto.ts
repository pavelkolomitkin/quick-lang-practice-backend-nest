import {IsEmail, IsNotEmpty, MinLength, Validate} from 'class-validator';
import {UniqueUserEmailValidator} from '../validators/unique-user-email.validator';
import {UserPasswordsEqualValidator} from '../validators/user-passwords-equal.validator';

export class UserRegisterDto {

    @IsEmail()
    @Validate(UniqueUserEmailValidator)
    public email: string;

    @MinLength(6, { message: 'Minimum 6 symbols!' })
    @Validate(UserPasswordsEqualValidator)
    public password: string;

    @MinLength(6, { message: 'Minimum 6 symbols!' })
    public passwordRepeat: string;

    @IsNotEmpty()
    public fullName: string;

}
