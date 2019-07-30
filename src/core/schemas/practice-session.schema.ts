import { Schema } from 'mongoose';
import * as autoPopulate from 'mongoose-autopopulate';
import * as mongooseDelete from 'mongoose-delete';
import { aggregate } from '../middlewares/soft-delete-entity.middleware';

const PracticeSessionSchema = new Schema({
    caller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },

    callerPeer: {
        type: String
    },


    callee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },

    calleePeer: {
        type: String
    },

    skill: {
        type: Schema.Types.ObjectId,
        ref: 'LanguageSkill',
        autopopulate: true
    },

    progressStartTime: {
        type: Date
    },

    progressEndTime: {
        type: Date
    },
    status: {
        type: Number,
        ref: 'PracticeSessionStatus',
        autopopulate: true
    }

},
    { timestamps: true }
);

PracticeSessionSchema.plugin(autoPopulate);

PracticeSessionSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });
PracticeSessionSchema.pre('aggregate', aggregate);

export { PracticeSessionSchema };