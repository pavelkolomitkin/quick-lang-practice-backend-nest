
import {MaxLength} from 'class-validator';

export class ProfileDto
{
    @MaxLength(4000, { message: '4000 symbols maximum' })
    public aboutYourSelf: string;
}
