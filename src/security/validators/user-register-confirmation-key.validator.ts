import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import {Injectable} from '@nestjs/common';
import {RegisterKey} from '../../core/models/register-key.model';
import * as mongoose from 'mongoose';

@Injectable()
@ValidatorConstraint({ name: 'UserRegisterConfirmationKeyValidator', async: true })
export class UserRegisterConfirmationKeyValidator implements ValidatorConstraintInterface
{
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'The key is not valid!';
    }

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {

        const model = mongoose.model('RegisterKey');

        const key = await model.findOne({ key: value });

        return !!key;
    }

}
