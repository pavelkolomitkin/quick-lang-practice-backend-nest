import { Schema } from 'mongoose';
import * as autoPopulate from 'mongoose-autopopulate';

const LanguageSkillSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'ClientUser',
        required: true,
    },

    language: {
        type: Schema.Types.ObjectId,
        ref: 'Language',
        required: true,
        autopopulate: true,
    },

    level: {
        type: Schema.Types.ObjectId,
        ref: 'LanguageLevel',
        required: true,
        autopopulate: true,
    },
});

LanguageSkillSchema.plugin(autoPopulate);

export { LanguageSkillSchema };
