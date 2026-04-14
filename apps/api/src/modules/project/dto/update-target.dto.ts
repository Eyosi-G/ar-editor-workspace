import { Transform, Type } from 'class-transformer';
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

enum TextAlignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  JUSTIFY = 'justify',
}

class TextDto {
  @IsString()
  value: string;

  @IsNumber()
  fontsize: number = 0.5;

  @IsEnum(TextWeight)
  fontweight: TextWeight = TextWeight.BOLD;

  @IsEnum(TextAlignment)
  alignment: TextAlignment = TextAlignment.LEFT;
}

class ImageDto {
  @IsString()
  value: string;


  @IsOptional()
  @IsString()
  link?: string;


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
  videoId: string;

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

  @ValidateIf((o) => o.service == EmbededValueType.YOUTUBE)
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  control: boolean;

}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  EMBEDED = 'embeded',
}
class ContentDto {
  @IsString()
  id: string;

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

  @IsOptional()
  @ValidateIf((o) => o.type === ContentType.TEXT)
  @ValidateNested()
  @Type(() => TextDto)
  text?: TextDto;

  @IsOptional()
  @ValidateIf((o) => o.type === ContentType.IMAGE)
  @ValidateNested()
  @Type(() => TextDto)
  image?: ImageDto;

  @IsOptional()
  @ValidateIf((o) => o.type === ContentType.EMBEDED)
  @ValidateNested()
  @Type(() => EmbededDto)
  embeded?: EmbededDto;
}

class TargetDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  img_src: string;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  width: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  @Transform(({ value }) =>
    value === null || value === undefined ? [] : value,
  )
  contents: ContentDto[] = [];
}

export class UpdateTargetsDto {
  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TargetDto)
  targets: TargetDto[];
}
