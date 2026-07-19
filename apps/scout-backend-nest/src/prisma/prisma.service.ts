import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient{
  constructor() {
    // 1. Создаем пул соединений
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
    // 2. Передаем пул в адаптер
    const adapter = new PrismaPg(pool);
    // 3. Передаем адаптер в конструктор PrismaClient
    super({ adapter });
  }
}
