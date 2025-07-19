// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Criar utilizador admin
  const hashedPassword = await bcrypt.hash('admin', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coaching.com' },
    update: {},
    create: {
      email: 'admin@coaching.com',
      name: 'Admin Sistema',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Criar clube exemplo
  const club = await prisma.club.upsert({
    where: { id: 'default-club' },
    update: {},
    create: {
      id: 'default-club',
      name: 'Clube Exemplo',
      shortName: 'CE',
      foregroundColor: '#1E40AF',
      backgroundColor: '#DBEAFE',
      image: null,
    },
  });

  console.log('✅ Example club created:', club.name);

  // Criar época para o clube
  const season = await prisma.season.upsert({
    where: { 
      clubId_name: { 
        clubId: club.id, 
        name: `Época ${new Date().getFullYear()}/${new Date().getFullYear() + 1}` 
      } 
    },
    update: {},
    create: {
      name: `Época ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      startDate: new Date(),
      clubId: club.id,
      active: true,
    },
  });

  console.log('✅ Season created:', season.name);

  // Adicionar admin ao clube como OWNER
  const clubUser = await prisma.clubUser.upsert({
    where: {
      userId_clubId: {
        userId: admin.id,
        clubId: club.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      clubId: club.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Admin added to club as OWNER');

  // Definir clube como padrão para o admin
  await prisma.user.update({
    where: { id: admin.id },
    data: { defaultClubId: club.id },
  });

  console.log('✅ Default club set for admin');

  // Criar utilizadores exemplo
  const exampleUsers = [
    {
      email: 'coach@coaching.com',
      name: 'João Treinador',
      role: 'COACH',
      clubRole: 'COACH',
    },
    {
      email: 'athlete@coaching.com',
      name: 'Maria Atleta',
      role: 'CLIENT',
      clubRole: 'MEMBER',
    },
  ];

  for (const userData of exampleUsers) {
    const userPassword = await bcrypt.hash('123456', 12);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: userPassword,
        role: userData.role as any,
        active: true,
        defaultClubId: club.id,
      },
    });

    // Adicionar ao clube
    await prisma.clubUser.upsert({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: club.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        clubId: club.id,
        role: userData.clubRole as any,
      },
    });

    console.log(`✅ User created: ${user.email} as ${userData.role}`);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('📝 Login credentials:');
  console.log('  Admin: admin@coaching.com / admin');
  console.log('  Coach: coach@coaching.com / 123456');
  console.log('  Athlete: athlete@coaching.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });