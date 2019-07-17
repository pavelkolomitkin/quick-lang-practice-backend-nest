import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config/config.service';
import {User} from '../models/user.model';
import {CoreException} from '../exceptions/core.exception';
import * as fsx from 'fs-extra';

@Injectable()
export class UploadManagerService
{
    constructor(private config: ConfigService) {}

    async removeAvatar(user: User)
    {
        if (!user.avatar)
        {
            throw new CoreException('User has no avatar!');
        }

        const file = this.config.get('UPLOAD_DIRECTORY') + '/' + user.avatar.filename;
        if (!await fsx.pathExists(file))
        {
            throw new CoreException('User has no avatar!');
        }

        await fsx.remove(file);
    }
}
