import {IsEmail, IsNotEmpty, MaxLength, MinLength, Validate} from 'class-validator';
import {UniqueUserEmailValidator} from '../validators/unique-user-email.validator';
import {UserPasswordsEqualValidator} from '../validators/user-passwords-equal.validator';
import {EntityExistsValidator} from '../../core/validators/entity-exists.validator';

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
    @MaxLength(100, { message: 'Maximum 100 symbols!' })
    public fullName: string;

    @Validate(EntityExistsValidator, ['Language', '_id'], { message: 'Select the language!' })
    public language: number;

    @Validate(EntityExistsValidator, ['LanguageLevel', '_id'], { message: 'Select the language level!' })
    public level: number;
}
