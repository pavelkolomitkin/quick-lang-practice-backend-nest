import { Schema } from 'mongoose';

const RegisterKeySchema = new Schema({

    key: {
        type: String,
        unique: true,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'ClientUser',
        required: true,
    },

}, { timestamps: true });

export { RegisterKeySchema };
