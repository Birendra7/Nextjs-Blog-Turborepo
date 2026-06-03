import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const prismaRequire = createRequire(__filename);
const { PrismaClient } = prismaRequire(
  join(__dirname, '../../../generated/prisma/client'),
) as typeof import('../../generated/prisma/client');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? 'file:./dev.db',
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
