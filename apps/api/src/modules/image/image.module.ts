import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { UploadModule } from '@app/upload';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'libs/schemas/image.schema';
import { AuthGuard } from '../../guards/auth.guard';
import { Account, AccountSchema } from 'libs/schemas/account.schema';

@Module({
  imports: [
    UploadModule,
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [ImageController],
  providers: [ImageService, AuthGuard],
})
export class ImageModule {}
