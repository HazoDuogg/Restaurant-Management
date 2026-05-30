import Reservation from "../models/Reservation.js";
import { ReservationStatus, TableStatus } from "../models/enums.js";
import ReservationRepository from "../repositories/ReservationRepository .js";
import TableRepository from "../repositories/TableRepository.js";

export class ReservationService {

    private reservationRepo = new ReservationRepository();
    private tableRepo = new TableRepository();

    async getAll(): Promise<Reservation[]> {
        return await this.reservationRepo.findAll();
    }

    async getById(id: number): Promise<Reservation> {
        const reservation = await this.reservationRepo.findById(id);
        if (!reservation) throw new Error(`Đặt bàn với ID ${id} không tồn tại`);
        return reservation;
    }

    async getByCustomer(customerId: number): Promise<Reservation[]> {
        return await this.reservationRepo.findByCustomer(customerId);
    }

    async getByStatus(status: ReservationStatus): Promise<Reservation[]> {
        return await this.reservationRepo.findByStatus(status);
    }

    async create(
        customerId: number | null,
        tableId: number,
        reservationTime: Date,
        numberOfPeople: number,
        guestName?: string,
        guestPhone?: string
    ): Promise<void> {
        if (numberOfPeople <= 0) throw new Error('Số người phải lớn hơn 0');
        if (reservationTime <= new Date()) throw new Error('Vui lòng chọn thời gian sau giờ hiện tại!!');

        const table = await this.tableRepo.findById(tableId);
        if (!table) throw new Error(`Bàn với ID ${tableId} không tồn tại`);
        if (table.status === TableStatus.OCCUPIED) throw new Error('Bàn đang có khách, vui lòng chọn bàn khác');
        if (table.capacity < numberOfPeople) throw new Error(`Bàn chỉ chứa tối đa ${table.capacity} người`);

        const reservation = new Reservation(0, reservationTime, numberOfPeople, ReservationStatus.PENDING, table);
        if (customerId) reservation.customer = { id: customerId } as any;
        if (guestName) reservation.guestName = guestName;
        if (guestPhone) reservation.guestPhone = guestPhone;
        await this.reservationRepo.create(reservation);
        await this.tableRepo.updateStatus(tableId, TableStatus.RESERVED);
    }

    async update(id: number, reservationTime: Date, numberOfPeople: number): Promise<void> {
        const reservation = await this.reservationRepo.findById(id);
        if (!reservation) throw new Error(`Đặt bàn với ID ${id} không tồn tại`);
        if (reservation.status !== ReservationStatus.PENDING) {
            throw new Error('Chỉ có thể chỉnh sửa đặt bàn đang chờ xác nhận');
        }
        if (numberOfPeople <= 0) throw new Error('Số người phải lớn hơn 0');
        if (reservationTime <= new Date()) throw new Error('Vui lòng chọn thời gian sau giờ hiện tại');
        if (reservation.table && reservation.table.capacity < numberOfPeople) {
            throw new Error(`Bàn chỉ chứa tối đa ${reservation.table.capacity} người`);
        }
        await this.reservationRepo.update(id, reservationTime, numberOfPeople);
    }

    async confirm(id: number): Promise<void> {
        const reservation = await this.reservationRepo.findById(id);
        if (!reservation) throw new Error(`Đặt bàn với ID ${id} không tồn tại`);
        if (reservation.status !== ReservationStatus.PENDING) {
            throw new Error('Chỉ có thể xác nhận đặt bàn đang ở trạng thái chờ');
        }
        await this.reservationRepo.updateStatus(id, ReservationStatus.CONFIRMED);
        if (reservation.table) {
            await this.tableRepo.updateStatus(reservation.table.id, TableStatus.RESERVED);
        }
    }

    async cancel(id: number): Promise<void> {
        const reservation = await this.reservationRepo.findById(id);
        if (!reservation) throw new Error(`Đặt bàn với ID ${id} không tồn tại`);
        if (reservation.status === ReservationStatus.COMPLETED || reservation.status === ReservationStatus.CANCELLED) {
            throw new Error('Không thể hủy đặt bàn đã hoàn thành hoặc đã hủy');
        }
        await this.reservationRepo.updateStatus(id, ReservationStatus.CANCELLED);
        if (reservation.table) {
            await this.tableRepo.updateStatus(reservation.table.id, TableStatus.AVAILABLE);
        }
    }

    async complete(id: number): Promise<void> {
        const reservation = await this.reservationRepo.findById(id);
        if (!reservation) throw new Error(`Đặt bàn với ID ${id} không tồn tại`);
        if (reservation.status !== ReservationStatus.CONFIRMED) {
            throw new Error('Chỉ có thể hoàn thành đặt bàn đã được xác nhận');
        }
        await this.reservationRepo.updateStatus(id, ReservationStatus.COMPLETED);
    }

}
