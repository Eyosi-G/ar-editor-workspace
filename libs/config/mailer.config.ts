import { registerAs } from '@nestjs/config';

export default registerAs('mail_config', () => ({
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  host: process.env.MAIL_HOST,
  from: process.env.MAIL_FROM,
}));