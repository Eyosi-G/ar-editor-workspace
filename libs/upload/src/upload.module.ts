import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadFtpService } from './upload-ftp.service';
import { ConfigModule } from '@nestjs/config';
import ftpConfig from 'libs/config/ftp.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ftpConfig],
    }),
  ],
  providers: [
    {
      useClass: UploadFtpService,
      provide: UploadService,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
