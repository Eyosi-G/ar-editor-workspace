import { registerAs } from '@nestjs/config';

export default registerAs('ftp_config', () => ({
  ftpDownloadURL: process.env.FTP_DOWNLOAD_URL,
  ftpUploadPath: process.env.FTP_UPLOAD_PATH,
  ftpHost: process.env.FTP_HOST,
  ftpUser: process.env.FTP_USER,
  ftpPassword: process.env.FTP_PASSWORD,
}));