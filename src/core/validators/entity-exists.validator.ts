import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import * as mongoose from 'mongoose';

@ValidatorConstraint({ name: 'EntityExistsValidator', async: true })
export class EntityExistsValidator implements ValidatorConstraintInterface
{
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'This does not exist!';
    }

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {

        let [ modelName, fieldName ] = validationArguments.constraints;

        const model = mongoose.model(modelName);

        if (fieldName === 'id')
        {
            fieldName = '_id';
        }

        const query = {};
        query[fieldName] = value;

        const entity = await model.findOne(query);

        return !!entity;
    }

}
