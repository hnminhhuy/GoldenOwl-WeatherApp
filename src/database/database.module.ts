import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from 'src/subscriber/subscriber.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService : ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow("DB_HOST"),
                port: configService.getOrThrow("DB_PORT"),
                username: configService.getOrThrow("DB_USERNAME"),
                password: configService.getOrThrow("DB_PASS"),
                database: configService.getOrThrow("DB_DBNAME"),
                autoLoadEntities: true,
                ssl: true,
                synchronize: configService.getOrThrow<boolean>("DB_SYNCHRONIZE"),
                logging: true,
                entities: [Subscriber]
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}
