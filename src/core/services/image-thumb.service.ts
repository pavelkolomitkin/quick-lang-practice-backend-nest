import * as fs from 'fs';
import * as fsx from 'fs-extra';
import {promisify} from 'util';
const fileExistsAsync = promisify(fs.stat);
import * as sharp from 'sharp';

import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config/config.service';
import {User} from '../models/user.model';
import {CoreException} from '../exceptions/core.exception';

@Injectable()
export class ImageThumbService
{
    constructor(private readonly config: ConfigService) {}

    async getUserAvatar(user: User, size: string): Promise<string>
    {
        if (!user.avatar)
        {
            throw new CoreException('User has not avatar!');
        }

        const thumbConfig = this.config.getThumbConfig();
        const avatarSizes = thumbConfig['avatar'][size];
        if (!avatarSizes)
        {
            throw new CoreException('Invalid size!');
        }

        const originalFile = this.config.get('UPLOAD_DIRECTORY') + '/' + user.avatar.filename;

        try {
            await fileExistsAsync(originalFile);
        }
        catch (error) {
            throw new CoreException('System Error');
        }

        const directoryPath = this.config.get('IMAGE_THUMB_DIRECTORY') + '/avatar/' + user.id + '/' + user.avatar.filename;
        try {
            await fileExistsAsync(directoryPath);
        }
        catch (directoryException) {

            try {
                await fs.promises.mkdir(directoryPath, { recursive: true });
            }
            catch (directoryCreateError) {
                throw new CoreException('Can not get file!');
            }

        }


        const filePath = directoryPath + '/' + size;
        try {
            await fileExistsAsync(filePath);
        }
        catch (error) {

            // there should be a file exist called /app/thumbs/avatar/:userId/:originalFileName/:size
            // if the target thumb file doesn't exist
            // make thumb for certain size
            try {
                await sharp(originalFile)
                    .resize(avatarSizes.width, avatarSizes.height)
                    .toFile(filePath);
            }
            catch (thumbError) {
                throw new CoreException('Can not get file!');
            }

        }

        return filePath;
    }

    async removeUserAvatar(user: User)
    {
        const directoryPath = this.config.get('IMAGE_THUMB_DIRECTORY') + '/avatar/' + user.id;
        try {
            await fileExistsAsync(directoryPath);
            await fsx.remove(directoryPath);
        }
        catch (error) {
            throw new CoreException('Can not remove this avatar!');
        }
    }
}
