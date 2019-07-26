import {IsNotEmpty, MaxLength, Validate} from 'class-validator';

export class ContactMessageDto
{
    @IsNotEmpty()
    @MaxLength(4000, { message: 'Maximum 4000 symbols' })
    public text: string;
}
