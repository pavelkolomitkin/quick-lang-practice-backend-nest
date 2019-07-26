import { Model } from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {ClientUser} from '../../core/models/client-user.model';
import {UserActivity} from '../../core/models/user-activity.model';
import {ActivityTypes} from '../../core/schemas/user-activity.schema';
import {User} from '../../core/models/user.model';

@Injectable()
export class ProfileService
{
    constructor(
        @Inject('User') private readonly model: Model<User>,
        @Inject('UserActivity') private readonly userActivityModel: Model<UserActivity>
        ) {}

    async blockUser(currentUser: ClientUser, addressee: ClientUser)
    {
        await this.model.update(
            {
                _id: currentUser.id
            },
            {
                $addToSet: {
                    blackList: addressee.id
                }
            }
        );

        const log = new this.userActivityModel({
            type: ActivityTypes.BLOCK_USER,
            user: currentUser,
            addressee: addressee
        });

        await log.save();

    }

    async unBlockUser(currentUser: ClientUser, addressee: ClientUser)
    {
        await this.model.update(
            {
                _id: currentUser.id,
            },
            {
                $pull: {
                    blackList: {
                        $in: [addressee.id]
                    }
                }
            }
            );

        const log = new this.userActivityModel({
            type: ActivityTypes.UNBLOCK_USER,
            user: currentUser,
            addressee: addressee
        });

        await log.save();
    }

    async isAddresseeBlocked(currentUser: User, addressee: User)
    {
        return !!await this.model.findOne({
            _id: currentUser,
            blackList: addressee.id
        });
    }
}
