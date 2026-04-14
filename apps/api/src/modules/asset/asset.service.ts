import { Injectable } from '@nestjs/common';
import { IUser } from '../../decorators/user.decorator';
import { UploadService } from '@app/upload';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { Asset, AssetDocument } from 'libs/schemas/asset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { formatBytesIntl } from 'libs/utils/util_funcs';
import * as sharp from 'sharp';
@Injectable()
export class AssetService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async createAsset(file: Express.Multer.File, account: IUser) {
    const extension = extname(file.originalname);
    const random = randomUUID();
    const key = `assets/${random}${extension}`;
    await this.uploadService.uploadFile(key, file.buffer, file.mimetype);
    const url = this.uploadService.getUploadURL(key);

    console.log(url);
    console.log(file);
    let type = 'image';
    const imageMimes = ['image/jpeg', 'image/png'];
    const meshMimes = ['model/gltf-binary', 'model/gltf+json'];
    const audioMimes = ['audio/mpeg', 'audio/wav'];
    let metadata: sharp.Metadata;
    if (imageMimes.includes(file.mimetype)) {
      type = 'image';
      metadata = await sharp(file.buffer).metadata();
    } else if (meshMimes.includes(file.mimetype)) {
      type = 'mesh';
    } else if (audioMimes.includes(file.mimetype)) {
      type = 'audio';
    }

    await this.assetModel.create({
      url,
      name: file.originalname,
      size: file.size,
      account: account.id,
      type,
      height: type == 'image' ? metadata.height : undefined,
      width: type == 'image' ? metadata.width : undefined,
    });
  }

  getAssets(account: IUser) {
    return this.assetModel.find({
      account: account.id,
    });
  }

  deleteAssetById(id: string, account: IUser) {
    return this.assetModel.deleteOne({
      _id: id,
      account: account.id,
    });
  }
}
