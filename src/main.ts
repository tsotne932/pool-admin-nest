import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const certPath = process.env.SSL_CERT_PATH || join(process.cwd(), 'ssl', 'ca.crt');
  const keyPath = process.env.SSL_KEY_PATH || join(process.cwd(), 'ssl', 'ca.key');

  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   cert: readFileSync(certPath),
    //   key: readFileSync(keyPath),
    // },
  });
  app.setGlobalPrefix('pool');
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`HTTPS server is running on port ${port}`);
}
bootstrap();
