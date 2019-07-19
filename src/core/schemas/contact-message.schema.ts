import { Schema } from 'mongoose';

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

export { ContactMessageSchema };
