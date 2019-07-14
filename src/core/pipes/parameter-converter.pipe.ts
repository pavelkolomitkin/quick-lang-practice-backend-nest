import * as mongoose from 'mongoose';
import {ArgumentMetadata, Inject, Injectable, NotFoundException, PipeTransform} from '@nestjs/common';

@Injectable()
export class ParameterConverterPipe implements PipeTransform
{
    constructor(private modelName: string, private fieldName: string) {}

    async transform(value: string, metadata: ArgumentMetadata): Promise<any> {

        if (this.fieldName == 'id')
        {
            this.fieldName = '_id';
        }

        const query = {};
        query[this.fieldName] = value;

        const result = await mongoose.model(this.modelName).findOne(query);
        if (!result) {
            throw new NotFoundException(`'${this.modelName}' with ${this.fieldName} = ${value} was not found!`);
        }

        return result;
    }

}
