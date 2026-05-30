import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function seedAdmin() {
    const name = 'Admin';
    const email = 'admin@vietbep.vn';
    const rawPassword = 'password123';
    const roleName = 'ADMIN';

    const hashed = await bcrypt.hash(rawPassword, 10);
    console.log('Hashed password:', hashed);

    // Tạo role ADMIN nếu chưa có
    const role = await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
    });

    // Tạo account admin nếu chưa có
    const account = await prisma.account.upsert({
        where: { email },
        update: {},
        create: {
            name,
            email,
            password: hashed,
            role_id: role.id,
            status: 'ACTIVE',
        },
    });

    // Tạo bản ghi admin
    await prisma.admin.upsert({
        where: { account_id: account.id },
        update: {},
        create: { account_id: account.id },
    });

    console.log(`Admin created: email=${email}, password=${rawPassword}`);
}

seedAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
