import { Schema } from 'mongoose';
import * as autoPopulate from 'mongoose-autopopulate';

const LanguageSkillSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'ClientUser',
        required: true,
    },

    language: {
        type: Number,
        ref: 'Language',
        required: true,
        autopopulate: true,
    },

    level: {
        type: Number,
        ref: 'LanguageLevel',
        required: true,
        autopopulate: true,
    },
});

LanguageSkillSchema.plugin(autoPopulate);

export { LanguageSkillSchema };
