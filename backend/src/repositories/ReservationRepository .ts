import Reservation from '../models/Reservation.js'
import Customer from '../models/Customer.js'
import Table from '../models/Table.js'
import { AccountStatus, ReservationStatus, TableStatus, TableType } from '../models/enums.js'
import { prisma } from "../config/prisma.js"

const INCLUDE_FULL = {
    table: true,
    customer: { include: { account: true } },
} as const

function mapRow(r: any): Reservation {
    const table = r.table
        ? new Table(r.table.id, r.table.table_number, r.table.capacity ?? 0, r.table.table_type as TableType, r.table.status as TableStatus)
        : null

    const customer = r.customer?.account
        ? new Customer(
            r.customer.account_id,
            r.customer.account.name,
            '',
            r.customer.customer_code ?? '',
            r.customer.account.phone ?? null,
            r.customer.account.email ?? null,
            r.customer.account.status as AccountStatus
          )
        : null

    const reservation = new Reservation(
        r.id,
        r.reservation_time,
        r.number_people ?? 0,
        r.status as ReservationStatus,
        table,
        customer,
        r.guest_name ?? null,
        r.guest_phone ?? null
    )
    return reservation
}

export default class ReservationRepository {

    async findAll(): Promise<Reservation[]> {
        try {
            const rows = await prisma.reservation.findMany({ include: INCLUDE_FULL })
            return rows.map(mapRow)
        } catch (error) {
            throw new Error(`Không thể lấy danh sách đặt bàn: ${error}`)
        }
    }

    async findById(id: number): Promise<Reservation | null> {
        try {
            const r = await prisma.reservation.findUnique({ where: { id }, include: INCLUDE_FULL })
            if (!r) return null
            return mapRow(r)
        } catch (error) {
            throw new Error(`Không tìm thấy đặt bàn với ID ${id}: ${error}`)
        }
    }

    async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
        try {
            const rows = await prisma.reservation.findMany({ where: { status }, include: INCLUDE_FULL })
            return rows.map(mapRow)
        } catch (error) {
            throw new Error(`Không thể lấy danh sách đặt bàn theo trạng thái "${status}": ${error}`)
        }
    }

    async findByCustomer(customerId: number): Promise<Reservation[]> {
        try {
            const rows = await prisma.reservation.findMany({ where: { customer_id: customerId }, include: INCLUDE_FULL })
            return rows.map(mapRow)
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
                    customer_id: reservation.customer?.id ?? null,
                    table_id: reservation.table?.id ?? null,
                    guest_name: reservation.guestName ?? null,
                    guest_phone: reservation.guestPhone ?? null,
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo đặt bàn: ${error}`)
        }
    }

    async update(id: number, reservationTime: Date, numberOfPeople: number): Promise<void> {
        try {
            await prisma.reservation.update({
                where: { id },
                data: { reservation_time: reservationTime, number_people: numberOfPeople }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật đặt bàn với ID ${id}: ${error}`)
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