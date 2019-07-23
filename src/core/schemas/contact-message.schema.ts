import { Schema } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

const ContactMessageSchema = new Schema({
    text: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'UserContact'
    }]
},
    {
        timestamps: true,
    }
);

ContactMessageSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

export { ContactMessageSchema };
