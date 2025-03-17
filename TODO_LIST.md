## 2025/03/07 @Jimin2123

```
# 환경 변수 설정 패키지
npm install @nestjs/config

# TypeORM 및 MariaDB 드라이버
npm install @nestjs/typeorm typeorm mysql2

# JWT 및 인증 관련 패키지
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt

# 요청 유효성 검사 (Validation)
npm install class-validator class-transformer

# API 문서화 (Swagger)
npm install --save @nestJS/swagger

# NestJS에서 사용하여 쿠키를 사용할 수 있게 해줌
npm install cookie-parser

# HTTP 보안 헤더를 설정하여 XSS, 클릭재킹, MIME 스니핑 등 다양한 공격을 방어하는 역할
npm i --save helmet

# Rate Limiting 기능을 제공
npm i --save @nestjs/throttler

# Database
npm install --save @nestjs/typeorm typeorm mysql2

# ENV
npm install --save-dev cross-env
```

## 2025/03/13 @Jimin2123

MQTT를 사용해 IOT 데이터를 가져오기 위해서 세팅을 해주었음

## 2025/03/15 @Jimin2123

Redis를 사용하기 위해서 세팅을 해주었음
NestJS 11버전으로 올라오면서 기존에 쓰는 Cache-Manger 라이브러리가 작동을 하지않아
ioredis만을 사용해 Redis를 사용하도록 구현하였음
원래는 캐시만 저장하는 CacheService와 Pub/Sub같은 기능을 사용하는 RedisService로 분리하려고했지만 CacheModule이 맛이가버려서 못함. ㅠ
그래도 CacheService를 캐시 저장을 위한 비즈니스 처리 형식으로 구현하였고 RedisService는 Redis 명령어를 사용한 Low레벨 언어를 사용하여 더 많은 기능을 사용할 수 있도록 하였음

## 2025/03/16 @Jimin2123

사용자 Address를 추가 시키고 TransactionUtil을 만들었음 기존에 있는 트랜잭션을 사용하여도 되지만 나중에 추가 시킬 Logger를 생각하면
따로 util을 구현하는게 좋을꺼 같다고 판단하였음.

## 2025/03/17 @Jimin2123

Coin관련된 엔티티를 생성하였습니다.
