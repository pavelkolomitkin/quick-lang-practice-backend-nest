import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import {Injectable} from '@nestjs/common';
import {User} from '../../core/models/user.model';
import * as mongoose from 'mongoose';

@Injectable()
@ValidatorConstraint({ name: 'UserEmailExistsValidator', async: true })
export class UserEmailExistsValidator implements ValidatorConstraintInterface
{
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'The email does not exist!';
    }

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {

        const model = mongoose.model('User');

        const user = await model.findOne({ email: value });

        return !!user;
    }

}
