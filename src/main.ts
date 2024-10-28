import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {

  const Port = process.env.SERVER_PORT || 3000

  const app = await NestFactory.create(AppModule);
  await app.listen(Port,()=>{
    console.log("Server started on port " + Port);
  });
}
bootstrap();
