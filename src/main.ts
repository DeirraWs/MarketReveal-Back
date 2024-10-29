import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";



async function bootstrap() {

  const Port = process.env.SERVER_PORT || 3000

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('Market Reveal')
      .setDescription('Market reveal API')
      .setVersion('1.0')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(Port,()=>{
    console.log("Server started on port " + Port);
  });
}
bootstrap();
