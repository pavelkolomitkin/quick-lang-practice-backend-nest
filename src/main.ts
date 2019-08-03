import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
const fs = require('fs');

async function bootstrap() {

  let app = null;
  if (process.env.NODE_ENV === 'production')
  {
    process.env.OPENDIKIM_KEY = fs.readFileSync('opendkim/mail.private');

    const sslKey = fs.readFileSync(process.env.SSL_KEY_FILE_PATH);
    const sslCert = fs.readFileSync(process.env.SLL_CERT_FILE_PATH);

    app = await NestFactory.create(AppModule,
        {
            cors: false,
            httpsOptions: {
              key: sslKey,
              cert: sslCert
            }
        });
  }
  else
  {
    app = await NestFactory.create(AppModule, { cors: true });
  }

  app.use(helmet());
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
