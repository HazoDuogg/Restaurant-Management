import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function seedDemo() {
    // Tạo roles nếu chưa có
    const staffRole = await prisma.role.upsert({
        where: { name: 'STAFF' },
        update: {},
        create: { name: 'STAFF' },
    });

    const customerRole = await prisma.role.upsert({
        where: { name: 'CUSTOMER' },
        update: {},
        create: { name: 'CUSTOMER' },
    });

    // === STAFF DEMO ===
    const staffPassword = await bcrypt.hash('password123', 10);
    const staffAccount = await prisma.account.upsert({
        where: { email: 'staff@vietbep.vn' },
        update: {
            name: 'Nguyễn Nhất Khang'
        },
        create: {
            name: 'Nguyễn Nhất Khang',
            email: 'staff@vietbep.vn',
            phone: '0901234567',
            password: staffPassword,
            role_id: staffRole.id,
            status: 'ACTIVE',
        },
    });

    await prisma.staff.upsert({
        where: { account_id: staffAccount.id },
        update: {},
        create: {
            account_id: staffAccount.id,
            staff_code: 'STF001',
            position: 'Phục vụ',
            start_date: new Date('2024-01-01'),
        },
    });

    console.log(`Staff created: email=staff@vietbep.vn, password=password123`);

    // === CUSTOMER DEMO ===
    const customerPassword = await bcrypt.hash('password123', 10);
    const customerAccount = await prisma.account.upsert({
        where: { email: 'customer@vietbep.vn' },
        update: {
            name: 'Ngũ Trí Tính'
        },
        create: {
            name: 'Ngũ Trí Tính',
            email: 'customer@vietbep.vn',
            phone: '0912345678',
            password: customerPassword,
            role_id: customerRole.id,
            status: 'ACTIVE',
        },
    });

    await prisma.customer.upsert({
        where: { account_id: customerAccount.id },
        update: {},
        create: {
            account_id: customerAccount.id,
            customer_code: 'CUS001',
        },
    });

    console.log(`Customer created: email=customer@vietbep.vn, password=password123`);
}

seedDemo()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
