import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IUser, User } from '../../decorators/user.decorator';
import { Express } from 'express';

@Controller('image')
@ApiBearerAuth()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter(req, file, callback) {
        const maxSize = 1024 * 1024 * 1;
        if (file.size > maxSize) {
          return callback(
            new BadRequestException('file must be less than 1mb'),
            false,
          );
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('file must be in image format'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  async uploadStampIcon(
    @UploadedFile() file: Express.Multer.File,
    @User() account: IUser,
  ) {
    await this.imageService.createImage(file, account);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getImages(@User() account: IUser) {
    return await this.imageService.getImages(account);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deleteImageById(@User() account: IUser, @Param("id") id: string) {
    return await this.imageService.deleteImageById(id, account);
  }
}
