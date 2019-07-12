import {Expose} from 'class-transformer';

export class EntityIdModel {

    id?: any;

    // tslint:disable-next-line:variable-name
    _id?: any;

    @Expose({ name: 'id' })
    getId()
    {
        if (typeof this.id !== 'undefined')
        {
            return this.id.toString();
        }
        else if (typeof this._id !== 'undefined')
        {
            return this._id.toString();
        }

        return null;
    }
}
