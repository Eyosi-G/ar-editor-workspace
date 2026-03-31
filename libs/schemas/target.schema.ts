import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Project } from './project.schema';

@Schema({ _id: false })
export class Property {
  @Prop({ type: [Number] })
  position: number[];

  @Prop({ type: [Number] })
  rotation: number[];

  @Prop({ type: [Number] })
  scale: number[];
}

const PropertySchema = SchemaFactory.createForClass(Property);

@Schema({ _id: false })
export class Text {
  @Prop({ type: String })
  value: string;

  @Prop({ type: Number })
  fontSize: number;

  @Prop({ type: String, enum: ['normal', 'bold'] })
  fontWeight: 'normal' | 'bold';
}

const TextSchema = SchemaFactory.createForClass(Text);

export class Content {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, enum: ['text', 'image', 'video'] })
  type: 'text' | 'image' | 'video';

  @Prop({ type: PropertySchema, required: false })
  properties: Property;

  @Prop({ type: TextSchema, required: false })
  text: Text;
}
const ContentSchema = SchemaFactory.createForClass(Content);

@Schema()
export class Target {
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
}

export type TargetDocument = HydratedDocument<Target>;
export const TargetSchema = SchemaFactory.createForClass(Target);
