import { PrismaClient } from '@prisma/client';
import { DEFAULT_CATEGORIES } from '../src/lib/default-categories';

const prisma = new PrismaClient();

async function main() {
  await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton' },
    update: {}
  });

  const user = await prisma.user.upsert({
    where: { email: '[email protected]' },
    create: { id: 'default-user', name: 'Prophecy Radar User', email: '[email protected]' },
    update: {}
  });

  for (const c of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: c.id },
      create: { id: c.id, name: c.name, emoji: c.emoji, keywords: [...c.keywords] },
      update: {}
    });
  }

  console.log(`Seeded ${DEFAULT_CATEGORIES.length} categories and user ${user.email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
