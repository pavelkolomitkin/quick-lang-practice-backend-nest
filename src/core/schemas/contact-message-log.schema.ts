import { Schema } from 'mongoose';

const ContactMessageLogActions = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    REMOVE: 'REMOVE'
};

const ContactMessageLogSchema = new Schema({

    message: {
        type: Schema.Types.ObjectId,
        ref: 'ContactMessage'
    },

    actor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    addressee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    action: {
        type: String
    }

},
    {
        capped: {
            size: 1048576, // 1M
            max: 1000
        },
        timestamps: true,
    });

export { ContactMessageLogSchema, ContactMessageLogActions };
