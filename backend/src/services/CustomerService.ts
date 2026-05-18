import CustomerRepository from "../repositories/CustomerRepository.js";
import Customer from "../models/Customer.js";

export class CustomerService {

    private customerRepo = new CustomerRepository();

    async getAll(): Promise<Customer[]> {
        return await this.customerRepo.findAll();
    }

    async getById(id: number): Promise<Customer> {
        const customer = await this.customerRepo.findById(id);
        if (!customer) throw new Error(`Khách hàng với ID ${id} không tồn tại`);
        return customer;
    }

    async delete(id: number): Promise<void> {
        const customer = await this.customerRepo.findById(id);
        if (!customer) throw new Error(`Khách hàng với ID ${id} không tồn tại`);
        await this.customerRepo.deleteCustomer(id);
    }

}
