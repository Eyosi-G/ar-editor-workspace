import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'payment-due';
import * as moment from 'moment';

@Schema({ timestamps: true })
export class Account {
  @Prop()
  email: string;

  @Prop()
  otp?: string;

  @Prop({ type: Date })
  otp_exp_date?: Date;

  @Prop({ type: Number, default: 0 })
  otp_attempt_count?: number;

  @Prop({ type: Date })
  otp_last_updated_at?: Date;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected', 'payment-due'],
    default: 'pending',
  })
  status: AccountStatus;

  @Prop({ type: Number, default: 5000 })
  price: number;

  @Prop({ type: Date, default: moment.utc() })
  sub_end_date: Date;

  @Prop({ type: Number, default: 5 })
  max_project: number;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);
