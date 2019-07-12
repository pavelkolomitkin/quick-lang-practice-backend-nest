import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import {Injectable} from '@nestjs/common';
import {PasswordRestoreKey} from '../../core/models/password-restore-key.model';
import * as mongoose from 'mongoose';

@Injectable()
@ValidatorConstraint({ name: 'PasswordRestoreKeyValidator', async: true })
export class PasswordRestoreKeyValidator implements ValidatorConstraintInterface
{
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'The key is not valid!';
    }

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {

        const model = mongoose.model('PasswordRestoreKey');

        const key: PasswordRestoreKey = await model.findOne({ key: value });
        if (!key)
        {
            return false;
        }

        // TODO Add addition conditions if it's needed

        return true;
    }

}
