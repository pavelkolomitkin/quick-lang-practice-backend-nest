import {Exclude, Expose, plainToClass, Transform} from 'class-transformer';

@Exclude()
export abstract class BaseEntityModel {

    @Expose({ name: 'id' })
    id: any;

}
