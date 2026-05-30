import { prisma } from "../config/prisma.js"
import Customer from "../models/Customer.js"
import Role from "../models/Role.js";
import type { AccountStatus } from "../models/enums.js";

export default class CustomerRepository {

    async findAll(): Promise<Customer[]> {
        try {
            const customer = await prisma.customer.findMany({
                include: { account: { include: { role: true } } }
            });
            return customer.map((c) => {
                const role = c.account.role ? new Role(c.account.role.id, c.account.role?.name, null) : null;
                return new Customer(
                    c.account_id, c.account.name,
                    c.account.password, c.customer_code ?? "",
                    c.account.phone, c.account.email,
                    c.account.status as AccountStatus,
                    role
                );
            });
        } catch (error) {
            throw new Error(`Không thể lấy danh sách khách hàng: ${error}`);
        }
    }

    async findById(id: number): Promise<Customer | null> {
        try {
            const customer = await prisma.customer.findUnique({
                where: { account_id: id },
                include: { account: { include: { role: true } } }
            })
            if (!customer)
                return null;
            const role = customer.account.role ? new Role(customer.account.role.id, customer.account.name, null) : null;
            return new Customer(
                customer.account.id, customer.account.name,
                customer.account.password, customer.customer_code ?? "",
                customer.account.phone, customer.account.email,
                customer.account.status as AccountStatus,
                role
            );
        } catch (error) {
            throw new Error(`Không thể tìm thấy khách hàng: ${error}`);
        }
    }

    async createCustomer(customer: Customer): Promise<void> {
        try {
            await prisma.customer.create({
                data: {
                    account_id: customer.id,
                    customer_code: customer.customerId
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo khách hàng: ${error}`)
        }
    }

    async deleteCustomer(accountId: number): Promise<void> {
        try {
            await prisma.customer.delete({
                where: { account_id: accountId }
            })
        } catch (error) {
            throw new Error(`Không thể xóa khách hàng với ID ${accountId}: ${error}`)
        }
    }

}