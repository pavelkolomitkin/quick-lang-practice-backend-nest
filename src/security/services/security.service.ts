import { Model } from 'mongoose';
import * as sha256 from 'crypto-js/sha256';
import {UserRegisterDto} from '../dto/user-register.dto';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {ClientUser} from '../../core/models/client-user.model';
import { hash, compare } from 'bcrypt';
import {IMailService} from '../../core/services/mail-service.interface';
import {RegisterKey} from '../../core/models/register-key.model';
import {UserConfirmRegisterDto} from '../dto/user-confirm-register.dto';
import {UserRestorePasswordRequestDto} from '../dto/user-restore-password-request.dto';
import {User} from '../../core/models/user.model';
import {PasswordRestoreKey} from '../../core/models/password-restore-key.model';
import {UserRestorePasswordDto} from '../dto/user-restore-password.dto';
import {UserCredentialsDto} from '../dto/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import {Language} from '../../core/models/language.model';
import {LanguageLevel} from '../../core/models/language-level.model';
import {LanguageSkill} from '../../core/models/language-skill.model';

@Injectable()
export class SecurityService
{
    static PASSWORD_HASH_SALT = 10;

    constructor(
        // @ts-ignore
        @Inject('User') private readonly userModel: Model<User>,
        // @ts-ignore
        @Inject('ClientUser') private readonly clientUserModel: Model<ClientUser>,
        @Inject('RegisterKey') private readonly registerKeyModel: Model<RegisterKey>,
        @Inject('PasswordRestoreKey') private readonly passwordRestoreKeyModel: Model<PasswordRestoreKey>,
        @Inject('Language') private readonly languageModel: Model<Language>,
        @Inject('LanguageLevel') private readonly languageLevelModel: Model<LanguageLevel>,
        @Inject('LanguageSkill') private readonly languageSkillModel: Model<LanguageSkill>,
        @Inject('MAILER') private readonly mailer: IMailService,
        private readonly jwtService: JwtService,
        ) {}

    async register(data: UserRegisterDto): Promise<ClientUser>
    {
        const { email, password, fullName } = data;


        // hash the password
        const passwordHash = await hash(password, SecurityService.PASSWORD_HASH_SALT);

        // init a new client model instance
        const result = new this.clientUserModel({
            email, password: passwordHash, fullName,
        });

        // save it to the database
        await result.save();
        await this.addUserSkill(data, result);

        // send the email to the user in order to provide a confirmation link
        const registerKey = new this.registerKeyModel({
            key: this.generateRandomHash(),
            client: result,
        });

        await registerKey.save();
        await this.mailer.sendRegisterConfirmation(registerKey);

        return result;
    }

    private async addUserSkill(data: UserRegisterDto, user: ClientUser)
    {
        const { language, level } = data;

        // add first user skill
        const languageGet = this.languageModel.findById(language);
        const languageLevelGet = this.languageLevelModel.findById(level);

        const languageEntity = await languageGet;
        const languageLevelEntity = await languageLevelGet;
        const skill = new this.languageSkillModel({
            language: languageEntity,
            level: languageLevelEntity,
            user: user
        });

        await skill.save();

        user.skills.push(skill);
        user.readyToPracticeSkill = skill;
        //@ts-ignore
        await user.save();
    }

    async confirmRegisteredAccount(data: UserConfirmRegisterDto): Promise<ClientUser>
    {
        const { key } = data;

        const keyEntity = await this.registerKeyModel.findOne({ key }).populate('client');

        const user = keyEntity.client;

        user.isActive = true;
        await user.save();

        await keyEntity.remove();

        return user;
    }

    async requestRestorePassword(data: UserRestorePasswordRequestDto): Promise<PasswordRestoreKey>
    {
        const { email } = data;

        const user = await this.userModel.findOne({ email });

        let restoreKey = await this.passwordRestoreKeyModel.findOne({
            user: user.id
        }).populate('user');


        if (!restoreKey)
        {
            restoreKey = new this.passwordRestoreKeyModel({
                user,
                key: this.generateRandomHash(),
            });
            await restoreKey.save();
        }

        await this.mailer.sendPasswordRestoreLink(restoreKey);

        return restoreKey;
    }

    async restorePassword(data: UserRestorePasswordDto): Promise<User>
    {
        const { key, password } = data;

        const keyEntity = await this.passwordRestoreKeyModel.findOne({ key }).populate('user');

        const user = keyEntity.user;
        user.password = await hash(password, SecurityService.PASSWORD_HASH_SALT);
        user.isActive = true;

        await user.save();
        await keyEntity.remove();

        return user;
    }

    async login(data: UserCredentialsDto): Promise<{ user: User, token: string }>
    {
        const user = await this.userModel.findOne({ email: data.email, isActive: true });
        if (!user)
        {
            throw new BadRequestException('Bad credentials!');
        }

        const isEquals: boolean = await compare(data.password, user.password);
        if (!isEquals)
        {
            throw new BadRequestException('Bad credentials!');
        }

        const token = await this.getTokenByUser(user);

        return { user, token };
    }

    async getTokenByUser(user: User)
    {
        return this.jwtService.sign({ email: user.email });
    }

    async getActiveUserByEmail(email: string): Promise<any>
    {
        return await this.userModel.findOne({ email, isActive: true })
            .populate('skills')
            .populate('readyToPracticeSkill');
    }

    private generateRandomHash()
    {
        return sha256((+new Date()) + '' + Math.random());
    }
}
