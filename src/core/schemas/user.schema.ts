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
        avatar: {
            type: {},
            default: null,
        },
        blackList: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            select: false
        }],

        lastActivity: {
            type: Date,
        }
    },
    {
        timestamps: true,
    },
);

UserSchema.methods.getRoles = () => {
    return ['ROLE_USER'];
};

UserSchema.methods.setAvatar = function(file = null) {

    if (!file)
    {
        this.avatar = null;
        return;
    }

    this.avatar = {
        encoding: file.encoding,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
        filename: file.filename
    };
};


UserSchema.virtual('roles').get(function(){
    return this.getRoles();
});

export { UserSchema };
