import {Validate} from 'class-validator';
import {UserRegisterConfirmationKeyValidator} from '../validators/user-register-confirmation-key.validator';

export class UserConfirmRegisterDto
{
    @Validate(UserRegisterConfirmationKeyValidator)
    public key: string;
}
