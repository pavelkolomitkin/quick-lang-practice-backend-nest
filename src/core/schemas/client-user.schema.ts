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
    },
},
{
    discriminatorKey: 'kind',
},
);

ClientUserSchema.methods.getRoles = () => {
    return ['ROLE_CLIENT_USER'];
};

ClientUserSchema.virtual('roles').get(function() {

    return this.getRoles();

});

export { ClientUserSchema };
