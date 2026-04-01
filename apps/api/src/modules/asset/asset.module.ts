import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { UploadModule } from '@app/upload';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from 'libs/schemas/asset.schema';
import { AuthGuard } from '../../guards/auth.guard';
import { Account, AccountSchema } from 'libs/schemas/account.schema';

@Module({
  imports: [
    UploadModule,
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [AssetController],
  providers: [AssetService, AuthGuard],
})
export class AssetModule {}
