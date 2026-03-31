import { registerAs } from '@nestjs/config';

export default registerAs('app_config', () => ({
  jwtToken: process.env.AUTH_JWT_SECRET ?? "sample",
}));