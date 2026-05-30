import type Customer from './Customer.js';
import { ReservationStatus } from './enums.js';
import Table from './Table.js';

export default class Reservation {

    private _id: number;
    private _reservationTime: Date;
    private _numberOfPeople: number;
    private _status: ReservationStatus;
    private _table: Table | null;
    private _customer: Customer | null;
    private _guestName: string | null;
    private _guestPhone: string | null;

    constructor(
        id: number,
        reservationTime: Date,
        numberOfPeople: number,
        status: ReservationStatus = ReservationStatus.PENDING,
        table: Table | null = null,
        customer: Customer | null = null,
        guestName: string | null = null,
        guestPhone: string | null = null
    ) {
        this._id = id;
        this._reservationTime = reservationTime;
        this._numberOfPeople = numberOfPeople;
        this._status = status;
        this._table = table;
        this._customer = customer;
        this._guestName = guestName;
        this._guestPhone = guestPhone;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get reservationTime(): Date {
        return this._reservationTime;
    }

    public set reservationTime(value: Date) {
        this._reservationTime = value;
    }

    public get numberOfPeople(): number {
        return this._numberOfPeople;
    }

    public set numberOfPeople(value: number) {
        this._numberOfPeople = value;
    }

    public get status(): ReservationStatus {
        return this._status;
    }

    public set status(value: ReservationStatus) {
        this._status = value;
    }

    public get table(): Table | null {
        return this._table;
    }

    public set table(value: Table | null) {
        this._table = value;
    }

    public get customer(): Customer | null {
        return this._customer
    }

    public set customer(value: Customer | null) {
        this._customer = value
    }

    public get guestName(): string | null {
        return this._guestName;
    }

    public set guestName(value: string | null) {
        this._guestName = value;
    }

    public get guestPhone(): string | null {
        return this._guestPhone;
    }

    public set guestPhone(value: string | null) {
        this._guestPhone = value;
    }

    public reserveTable(): void {
        this._status = ReservationStatus.CONFIRMED;
    }

    public cancelReservation(): void {
        this._status = ReservationStatus.CANCELLED;
    }

    public toJSON() {
        return {
            id: this._id,
            reservationTime: this._reservationTime,
            numberOfPeople: this._numberOfPeople,
            status: this._status,
            table: this._table,
            customer: this._customer,
            guestName: this._guestName,
            guestPhone: this._guestPhone,
        };
    }

}
