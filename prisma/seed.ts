import prisma, { transacting } from '../core/db';
import parseHromadasFile from '../core/utils/parse-hromadas-file';
import handleError from '../core/utils/error';

async function main() {
  const settlementsByHromadas = await parseHromadasFile();

  await transacting(prisma, async (prisma) => {
    await Promise.all(
      Object.entries(settlementsByHromadas).map(([hromada, settlements]) =>
        prisma.hromada.upsert({
          where: {
            name: hromada,
          },
          update: {},
          create: {
            name: hromada,
            settlements: {
              createMany: {
                data: settlements.map((s) => ({ name: s })),
              },
            },
          },
        })
      )
    );
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    handleError(e);

    await prisma.$disconnect();

    process.exit(1);
  });
