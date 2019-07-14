import { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        fullName: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.methods.getRoles = () => {
    return ['ROLE_USER'];
};

UserSchema.virtual('roles').get(function(){
    return this.getRoles();
});

export { UserSchema };
