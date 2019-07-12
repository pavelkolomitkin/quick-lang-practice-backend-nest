import { Schema } from 'mongoose';

const LanguageSchema = new Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
    },
    code: {
        type: String,
    },
});

export { LanguageSchema };
