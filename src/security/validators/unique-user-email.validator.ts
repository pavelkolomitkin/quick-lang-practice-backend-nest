import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import { Injectable} from '@nestjs/common';
import {User} from '../../core/models/user.model';
import * as mongoose from 'mongoose';

@Injectable()
@ValidatorConstraint({ name: 'UniqueUserEmailValidator', async: false })
export class UniqueUserEmailValidator implements ValidatorConstraintInterface
{
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'This email already exists!';
    }

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {

        const model = mongoose.model('User');

        const user = await model.findOne({ email: value });

        return !user;
    }

}
