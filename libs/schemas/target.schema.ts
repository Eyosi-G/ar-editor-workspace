import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from './project.schema';

@Schema({ _id: false })
export class Text {
  @Prop({ type: String })
  value: string;

  @Prop({ type: Number })
  fontsize: number;

  @Prop({ type: String, enum: ['normal', 'bold'] })
  fontweight: 'normal' | 'bold';

  @Prop({ type: String, enum: ['left', 'center', 'right', 'justify'] })
  alignment: 'left' | 'center' | 'right' | 'justify';

  @Prop({ type: String })
  color: string;
}

const TextSchema = SchemaFactory.createForClass(Text);

@Schema({ _id: false })
export class Image {
  @Prop({ type: String, required: false })
  value: string;

  @Prop({ type: String })
  link: string;

  @Prop({ type: Number, required: false })
  height: number;

  @Prop({ type: Number, required: false })
  width: number;
}

const ImageSchema = SchemaFactory.createForClass(Image);

@Schema({ _id: false })
export class Embeded {
  @Prop({ type: String, required: true })
  videoId: string;

  @Prop({ type: String, enum: ['youtube'], default: 'youtube' })
  service: 'youtube';

  @Prop({ type: Boolean })
  autoplay: boolean;

  @Prop({ type: Boolean })
  loop: boolean;

  @Prop({ type: Boolean })
  muted: boolean;

  @Prop({ type: Boolean })
  control: boolean;
}

const EmbededSchema = SchemaFactory.createForClass(Embeded);

@Schema({ _id: false })
export class Content {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, enum: ['text', 'image', 'embeded'] })
  type: 'text' | 'image' | 'embeded';

  @Prop({ type: [Number] })
  position: number[];

  @Prop({ type: [Number] })
  rotation: number[];

  @Prop({ type: [Number] })
  scale: number[];

  @Prop({ type: TextSchema, required: false })
  text?: Text;

  @Prop({ type: ImageSchema, required: false })
  image?: Image;

  @Prop({ type: EmbededSchema, required: false })
  embeded?: Embeded;
}
const ContentSchema = SchemaFactory.createForClass(Content);

@Schema({ _id: false })
export class Target {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  img_src: string;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: [ContentSchema] })
  contents: Content[];

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  //   project: Project;
}

// export type TargetDocument = HydratedDocument<Target>;
export const TargetSchema = SchemaFactory.createForClass(Target);
