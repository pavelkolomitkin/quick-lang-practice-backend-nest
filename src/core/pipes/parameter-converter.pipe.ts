import * as mongoose from 'mongoose';
import {ArgumentMetadata, Inject, Injectable, NotFoundException, PipeTransform} from '@nestjs/common';

@Injectable()
export class ParameterConverterPipe implements PipeTransform
{
    constructor(private readonly modelName: string, private readonly fieldName: string) {}

    async transform(value: string, metadata: ArgumentMetadata): Promise<any> {

        const query = {};
        query[this.fieldName] = value;

        const result = await mongoose.model(this.modelName).findOne(query);
        if (result) {
            throw new NotFoundException(`'${this.modelName}' with ${this.fieldName} = ${value} was not found!`);
        }

        return result;
    }

}
