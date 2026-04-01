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
import { AssetService } from './asset.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IUser, User } from '../../decorators/user.decorator';
import { Express } from 'express';

@Controller('assets')
@ApiBearerAuth()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}
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
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'model/gltf-binary',
          'model/gltf+json',
          'audio/mpeg',
          'audio/wav',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('file format not allowed'),
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
  async createAsset(
    @UploadedFile() file: Express.Multer.File,
    @User() account: IUser,
  ) {
    await this.assetService.createAsset(file, account);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAssets(@User() account: IUser) {
    return await this.assetService.getAssets(account);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteAssetById(@User() account: IUser, @Param('id') id: string) {
    return await this.assetService.deleteAssetById(id, account);
  }
}
