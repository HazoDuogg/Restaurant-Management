import { PrismaClient } from '@prisma/client/extension'
import Reservation from '../models/Reservation.js'
import Table from '../models/Table.js'
import { ReservationStatus, TableStatus } from '../models/enums.js'

const prisma = new PrismaClient()

export default class ReservationRepository {

    async findAll(): Promise<Reservation[]> {
        try {
            const reservations = await prisma.reservation.findMany({
                include: { table: true }
            })
            return reservations.map((r: any) => new Reservation(
                r.id,
                r.reservation_time,
                r.number_people ?? 0,
                r.status as ReservationStatus,
                r.table ? new Table(
                    r.table.id,
                    r.table.table_number,
                    r.table.capacity ?? 0,
                    r.table.status as TableStatus
                ) : null
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách đặt bàn: ${error}`)
        }
    }

    async findById(id: number): Promise<Reservation | null> {
        try {
            const r = await prisma.reservation.findUnique({
                where: { id },
                include: { table: true }
            })
            if (!r) return null
            return new Reservation(
                r.id,
                r.reservation_time,
                r.number_people ?? 0,
                r.status as ReservationStatus,
                r.table ? new Table(
                    r.table.id,
                    r.table.table_number,
                    r.table.capacity ?? 0,
                    r.table.status as TableStatus
                ) : null
            )
        } catch (error) {
            throw new Error(`Không tìm thấy đặt bàn với ID ${id}: ${error}`)
        }
    }

    async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
        try {
            const reservations = await prisma.reservation.findMany({
                where: { status },
                include: { table: true }
            })
            return reservations.map((r: any) => new Reservation(
                r.id,
                r.reservation_time,
                r.number_people ?? 0,
                r.status as ReservationStatus,
                r.table ? new Table(
                    r.table.id,
                    r.table.table_number,
                    r.table.capacity ?? 0,
                    r.table.status as TableStatus
                ) : null
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách đặt bàn theo trạng thái "${status}": ${error}`)
        }
    }

    async findByCustomer(customerId: number): Promise<Reservation[]> {
        try {
            const reservations = await prisma.reservation.findMany({
                where: { customer_id: customerId },
                include: { table: true }
            })
            return reservations.map((r: any) => new Reservation(
                r.id,
                r.reservation_time,
                r.number_people ?? 0,
                r.status as ReservationStatus,
                r.table ? new Table(
                    r.table.id,
                    r.table.table_number,
                    r.table.capacity ?? 0,
                    r.table.status as TableStatus
                ) : null
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách đặt bàn của khách hàng ID ${customerId}: ${error}`)
        }
    }

    async create(reservation: Reservation): Promise<void> {
        try {
            await prisma.reservation.create({
                data: {
                    reservation_time: reservation.reservationTime,
                    number_people: reservation.numberOfPeople,
                    status: reservation.status,
                    customer_id: reservation.customer?.id ?? null,  // ← lấy từ object
                    table_id: reservation.table?.id ?? null
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo đặt bàn: ${error}`)
        }
    }

    async updateStatus(id: number, status: ReservationStatus): Promise<void> {
        try {
            await prisma.reservation.update({
                where: { id },
                data: { status }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái đặt bàn với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.reservation.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa đặt bàn với ID ${id}: ${error}`)
        }
    }

}