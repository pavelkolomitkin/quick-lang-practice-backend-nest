import { Schema } from 'mongoose';

const UserContactSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    addressee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'ContactMessage'
    }],

    newMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'ContactMessage'
    }]
},
    {
        timestamps: true,
    }
);


export { UserContactSchema };
