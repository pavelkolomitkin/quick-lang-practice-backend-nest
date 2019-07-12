import { Schema } from 'mongoose';

const PasswordRestoreKeySchema = new Schema({

    key: {
        type: String,
        unique: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

},
    { timestamps: true },
);

export { PasswordRestoreKeySchema };
