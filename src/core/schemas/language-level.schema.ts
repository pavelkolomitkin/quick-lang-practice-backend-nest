import { Schema } from 'mongoose';

const LanguageLevelSchema = new Schema({
    _id: {
        type: Number,
    },
    level: {
        type: Number,
    },
    code: {
        type: String,
    },
    title: {
        type: String,
    },
});

export { LanguageLevelSchema };
