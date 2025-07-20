// prisma/seed.ts

import { PrismaClient, Role, ClubRole } from '@prisma/client';
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
      password: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
      active: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Criar clubes
  const clubs = [
    {
      name: 'FC Porto',
      shortName: 'FCP',
      image: null, // Vai usar a imagem padrão
      foregroundColor: '#FFFFFF',
      backgroundColor: '#003366',
    },
    {
      name: 'Sport Lisboa e Benfica',
      shortName: 'SLB',
      image: null,
      foregroundColor: '#FFFFFF',
      backgroundColor: '#E20E0E',
    },
    {
      name: 'Sporting Clube de Portugal',
      shortName: 'SCP',
      image: null,
      foregroundColor: '#FFFFFF',
      backgroundColor: '#006600',
    },
    {
      name: 'Vitória SC',
      shortName: 'VSC',
      image: "data:image/jpeg;base64,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",
      foregroundColor: '#FFFFFF',
      backgroundColor: '#8B0000',
    },
  ];

  const createdClubs = [];
  
  for (const clubData of clubs) {
    // Verificar se o clube já existe pelo nome
    const existingClub = await prisma.club.findFirst({
      where: { name: clubData.name },
    });

    let club;
    if (existingClub) {
      club = existingClub;
      console.log('✅ Club already exists:', club.name);
    } else {
      club = await prisma.club.create({
        data: clubData,
      });
      console.log('✅ Club created:', club.name);
    }
    
    createdClubs.push(club);

    // Associar o admin como OWNER de todos os clubes
    await prisma.clubUser.upsert({
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
        role: ClubRole.OWNER,
      },
    });

    console.log(`✅ Admin added as OWNER to ${club.name}`);

    // Criar uma época ativa para cada clube
    const existingSeason = await prisma.season.findFirst({
      where: {
        clubId: club.id,
        name: '2024/2025',
      },
    });

    if (!existingSeason) {
      await prisma.season.create({
        data: {
          name: '2024/2025',
          startDate: new Date('2024-07-01'),
          endDate: new Date('2025-06-30'),
          active: true,
          clubId: club.id,
        },
      });
      console.log(`✅ Season 2024/2025 created for ${club.name}`);
    } else {
      console.log(`✅ Season 2024/2025 already exists for ${club.name}`);
    }
  }

  // Definir o primeiro clube como padrão para o admin
  if (createdClubs.length > 0) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { defaultClubId: createdClubs[0].id },
    });
    console.log(`✅ Default club set to ${createdClubs[0].name} for admin`);
  }

  // Criar utilizadores de teste
  const testUsers = [
    {
      email: 'coach@coaching.com',
      password: 'coach123',
      name: 'João Silva',
      role: Role.COACH,
    },
    {
      email: 'client@coaching.com',
      password: 'client123',
      name: 'Maria Santos',
      role: Role.CLIENT,
    },
  ];

  for (const userData of testUsers) {
    const hashedUserPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedUserPassword,
        name: userData.name,
        role: userData.role,
        active: true,
        defaultClubId: createdClubs[0]?.id, // Primeiro clube como padrão
      },
    });

    console.log('✅ Test user created:', user.email);

    // Associar utilizadores de teste aos clubes
    if (createdClubs.length > 0) {
      // Coach tem acesso aos primeiros 2 clubes
      const clubsForUser = userData.role === Role.COACH 
        ? createdClubs.slice(0, 2) 
        : [createdClubs[0]]; // Client só ao primeiro

      for (const club of clubsForUser) {
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
            role: userData.role === Role.COACH ? ClubRole.COACH : ClubRole.MEMBER,
          },
        });

        console.log(`✅ ${user.name} added to ${club.name} as ${userData.role}`);
      }
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });