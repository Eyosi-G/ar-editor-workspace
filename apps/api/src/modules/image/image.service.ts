import { Injectable } from '@nestjs/common';
import { IUser } from '../../decorators/user.decorator';
import { UploadService } from '@app/upload';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { Image, ImageDocument } from 'libs/schemas/image.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { formatBytesIntl } from 'libs/utils/util_funcs';

@Injectable()
export class ImageService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async createImage(file: Express.Multer.File, account: IUser) {
    const extension = extname(file.originalname);
    const random = randomUUID();
    const key = `images/${random}${extension}`;
    await this.uploadService.uploadFile(key, file.buffer, file.mimetype);
    const url = this.uploadService.getUploadURL(key);
    await this.imageModel.create({
      url,
      name: file.originalname,
      size: formatBytesIntl(file.size),
      account: account.id,
    });
  }

  getImages(account: IUser) {
    return this.imageModel.find({
      account: account.id,
    });
  }

  deleteImageById(id: string, account: IUser) {
    return this.imageModel.deleteOne({
        _id: id,
        account: account.id
    })
  }
}
