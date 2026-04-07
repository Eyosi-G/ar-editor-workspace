import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

enum TextWeight {
  NORMAL = 'normal',
  BOLD = 'bold',
}

class TextDto {
  @IsString()
  value: string;

  @IsNumber()
  fontSize: number = 12;

  @IsEnum(TextWeight)
  fontWeight: TextWeight = TextWeight.BOLD;
}

class ImageDto {
  @IsString()
  value: string;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;
}

export enum EmbededValueType {
  YOUTUBE = 'youtube',
}

class EmbededDto {
  @IsString()
  value: string;

  @IsEnum(EmbededValueType)
  service: string;

  @ValidateIf((o) => o.service == EmbededValueType.YOUTUBE)
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  autoplay: boolean;

  @ValidateIf((o) => o.service == EmbededValueType.YOUTUBE)
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  loop: boolean;

  @ValidateIf((o) => o.service == EmbededValueType.YOUTUBE)
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  muted: boolean;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  EMBEDED = 'embeded',
}
class ContentDto {
  @IsString()
  name: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  position: number[];

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  rotation: number[];

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  scale: number[];

  @ValidateIf((o) => o.type === ContentType.TEXT)
  @ValidateNested()
  @Type(() => TextDto)
  text?: TextDto;

  @ValidateIf((o) => o.type === ContentType.IMAGE)
  @ValidateNested()
  @Type(() => TextDto)
  image?: ImageDto;

  @ValidateIf((o) => o.type === ContentType.EMBEDED)
  @ValidateNested()
  @Type(() => EmbededDto)
  embeded?: EmbededDto;
}

class TargetDto {
  @IsString()
  name: string;

  @IsString()
  imgSrc: string;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  width: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents: ContentDto[];
}

export class UpdateTargetsDto {
  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  targets: TargetDto[];
}
