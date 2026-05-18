import type { Request, Response } from "express";
import { ReservationService } from "../services/ReservationService.js";
import { ReservationStatus } from "../models/enums.js";

const reservationService = new ReservationService();

export class ReservationController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const reservations = await reservationService.getAll();
            res.status(200).json({ success: true, data: reservations });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const reservation = await reservationService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: reservation });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async getByCustomer(req: Request, res: Response): Promise<void> {
        try {
            const reservations = await reservationService.getByCustomer(Number(req.params.customerId));
            res.status(200).json({ success: true, data: reservations });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.params;
            if (!Object.values(ReservationStatus).includes(status as ReservationStatus)) {
                res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
                return;
            }
            const reservations = await reservationService.getByStatus(status as ReservationStatus);
            res.status(200).json({ success: true, data: reservations });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { customerId, tableId, reservationTime, numberOfPeople, guestName, guestPhone } = req.body;
            if (!tableId || !reservationTime || !numberOfPeople) {
                res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin đặt bàn" });
                return;
            }
            if (!customerId && (!guestName || !guestPhone)) {
                res.status(400).json({ success: false, message: "Vui lòng nhập tên và số điện thoại" });
                return;
            }
            await reservationService.create(
                customerId ? Number(customerId) : null,
                Number(tableId),
                new Date(reservationTime),
                Number(numberOfPeople),
                guestName,
                guestPhone
            );
            res.status(201).json({ success: true, message: "Đặt bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { reservationTime, numberOfPeople } = req.body;
            if (!reservationTime || !numberOfPeople) {
                res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
                return;
            }
            await reservationService.update(Number(req.params.id), new Date(reservationTime), Number(numberOfPeople));
            res.status(200).json({ success: true, message: "Cập nhật đặt bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async confirm(req: Request, res: Response): Promise<void> {
        try {
            await reservationService.confirm(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xác nhận đặt bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async cancel(req: Request, res: Response): Promise<void> {
        try {
            await reservationService.cancel(Number(req.params.id));
            res.status(200).json({ success: true, message: "Hủy đặt bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async complete(req: Request, res: Response): Promise<void> {
        try {
            await reservationService.complete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Hoàn thành đặt bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
