import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Account } from './account.schema';
import mongoose, { HydratedDocument } from 'mongoose';
@Schema()
export class Image {
  @Prop({ type: String})
  url: string;

  @Prop({ type: String})
  name: string;

  @Prop({ type: String})
  size: string;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: Account;
}

export type ImageDocument = HydratedDocument<Image>;
export const ImageSchema = SchemaFactory.createForClass(Image);
