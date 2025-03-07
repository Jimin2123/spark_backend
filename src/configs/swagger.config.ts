import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('SPARK API Documentation') // 문서 제목
  .setDescription(
    'This is the API documentation for the project. It provides details about the available endpoints and how to use them.',
  ) // 자세한 설명
  .setVersion('1.0.0') // API 버전
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })
  .addServer('http://localhost:3000', 'Local server') // 로컬 서버 추가
  .addServer('', 'Production server') // 프로덕션 서버 추가
  .build();

export default swaggerConfig;
