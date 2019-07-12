import { Schema } from 'mongoose';

const ClientUserSchema = new Schema({
    aboutYourSelf: {
        type: String,
    },

    skills: [{
        type: Schema.Types.ObjectId,
        ref: 'LanguageSkill',
    }],

    readyToPracticeSkill: {
        type: Schema.Types.ObjectId,
        ref: 'LanguageSkill',
        required: false,
    },
},
{
    discriminatorKey: 'kind',
},
);

ClientUserSchema.virtual('roles').get(() => {

    return ['ROLE_CLIENT_USER'];

});

export { ClientUserSchema };
