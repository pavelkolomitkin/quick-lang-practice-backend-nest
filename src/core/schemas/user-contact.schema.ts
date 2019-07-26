import { Schema } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import { aggregate } from '../middlewares/soft-delete-entity.middleware';

const UserContactSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    addressee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    newMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'ContactMessage'
    }],

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'ContactMessage'
    },

    lastMessageAddedAt: {
        type: Date,
        default: new Date()
    }
},
    {
        timestamps: true,
    }
);

UserContactSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

UserContactSchema.pre('aggregate', aggregate);

export { UserContactSchema };
