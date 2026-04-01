import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Account } from './account.schema';
import mongoose, { HydratedDocument } from 'mongoose';
@Schema()
export class Asset {
  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  size: number;

  @Prop({ type: String, enum: ['image', 'audio', 'mesh'] })
  type: 'image' | 'audio' | 'mesh';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: Account;
}

export type AssetDocument = HydratedDocument<Asset>;
export const AssetSchema = SchemaFactory.createForClass(Asset);
