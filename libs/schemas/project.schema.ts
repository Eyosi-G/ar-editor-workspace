import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from './account.schema';
import { Target, TargetSchema } from './target.schema';

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Boolean, default: false })
  is_published: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: Account;

  @Prop({ type: [TargetSchema]})
  targets: Target[]
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);
