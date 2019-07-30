
import {IsNotEmpty, MaxLength} from 'class-validator';

export class ProfileDto
{
    @MaxLength(4000, { message: '4000 symbols maximum' })
    public aboutYourSelf: string;

    @IsNotEmpty()
    @MaxLength(100, { message: 'Maximum 100 symbols!' })
    public fullName: string;
}
