import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from 'libs/schemas/account.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify_email.dto';
import { ResendOtpDto } from './dto/resend_otp.dto';
import * as moment from 'moment';
import { generateCode } from 'libs/utils/util_funcs';
import appConfig from 'libs/config/app.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async resendEmail(resendOtpDto: ResendOtpDto) {
    const account = await this.accountModel.findOne({
      email: resendOtpDto.email,
    });
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    const now = moment.utc();
    const isExpired = now.isBefore(moment.utc(account.otp_exp_date));
    let otpAttempts = account.otp_attempt_count + 1;
    if (isExpired && account.otp_attempt_count >= 5) {
      const diff = now.diff(moment.utc(account.otp_last_updated_at), 'hours');
      if (diff < 24) {
        throw new BadRequestException(
          `Your account has been termporarly blocked please wait ${diff} hours or contact us`,
        );
      } else {
        otpAttempts = 1;
      }
    }

    const otp = generateCode();
    await this.accountModel.findByIdAndUpdate(account.id, {
      otp,
      otp_attempt_count: otpAttempts,
      otp_last_updated_at: moment.utc().toDate(),
      otp_exp_date: moment.utc().add(5, 'minutes').toDate(),
    });

    //todo: send email
    console.log(otp);
  }
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    let account = await this.accountModel.findOne({
      email: verifyEmailDto.email,
      otp: verifyEmailDto.otp,
      otp_exp_date: {
        $gt: moment.utc().toDate(),
      },
    });
    if (account) {
      await this.accountModel.findByIdAndUpdate(account._id, {
        otp_exp_date: moment.utc().toDate(),
      });

      const token = this.jwtService.sign(
        { id: account._id, email: account.email },
        { secret: this.config.jwtToken, expiresIn: '5d' },
      );
      return token;
    } else {
      throw new BadRequestException('account not found');
    }
  }

  async login(loginDto: LoginDto) {
    let account = await this.accountModel.findOne({
      email: loginDto.email,
    });
    if (!account) {
      account = await this.accountModel.create({
        email: loginDto.email,
        otp: generateCode(),
        otp_attempt_count: 1,
        otp_last_updated_at: moment.utc().toDate(),
        otp_exp_date: moment.utc().add(5, 'minutes').toDate(),
      });
    }

    const now = moment.utc();
    const isExpired = now.isBefore(moment.utc(account.otp_exp_date));
    let otpAttempts = account.otp_attempt_count + 1;
    if (isExpired && account.otp_attempt_count >= 5) {
      const diff = now.diff(moment.utc(account.otp_last_updated_at), 'hours');
      if (diff < 24) {
        throw new BadRequestException(
          `Your account has been termporarly blocked please wait ${diff} hours or contact us`,
        );
      } else {
        otpAttempts = 1;
      }
    }

    const otp = generateCode();
    await this.accountModel.findByIdAndUpdate(account.id, {
      otp,
      otp_attempt_count: otpAttempts,
      otp_last_updated_at: moment.utc().toDate(),
      otp_exp_date: moment.utc().add(5, 'minutes').toDate(),
    });

    //todo: send email
    console.log(otp);
  }
}
