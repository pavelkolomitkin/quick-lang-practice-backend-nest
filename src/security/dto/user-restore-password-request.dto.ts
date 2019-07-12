import {IsEmail, Validate} from 'class-validator';
import {UserEmailExistsValidator} from '../validators/user-email-exists.validator';

export class UserRestorePasswordRequestDto
{
    @IsEmail()
    @Validate(UserEmailExistsValidator)
    public email: string;
}
