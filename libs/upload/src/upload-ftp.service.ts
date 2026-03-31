import { Inject, Injectable } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigType } from '@nestjs/config';
import * as path from 'path';
import * as ftp from 'basic-ftp';
import { Readable } from 'stream';
import ftpConfig from 'libs/config/ftp.config';

@Injectable()
export class UploadFtpService implements UploadService {
  constructor(
    @Inject(ftpConfig.KEY)
    private config: ConfigType<typeof ftpConfig>,
  ) {}

  delete(url: string) {}

  getUploadURL(key: string): string {
    return `${this.config.ftpDownloadURL}/${key}`;
  }

  async uploadFile(
    key: string,
    buffer: any,
    contentType?: string,
  ): Promise<void> {
    const stream = Readable.from(buffer);
    const client = new ftp.Client();
    const directory = path.join(
      this.config.ftpUploadPath,
      path.dirname(key),
    );
    try {
      await client.access({
        host: this.config.ftpHost,
        user: this.config.ftpUser,
        password: this.config.ftpPassword,
        secure: false,
        // secureOptions: { rejectUnauthorized: false },
      });

      await client.ensureDir(directory);
      await client.uploadFrom(stream, path.basename(key));
    } catch (e) {
      console.log(e);
      throw 'upload failed';
    } finally {
      client.close();
    }
  }
}
