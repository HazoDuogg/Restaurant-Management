import { ReservationStatus } from './enums.js';
import Table from './Table.js';

export default class Reservation {

    private _id: number;
    private _reservationTime: Date;
    private _numberOfPeople: number;
    private _status: ReservationStatus;
    private _table: Table | null;

    constructor(
        id: number,
        reservationTime: Date,
        numberOfPeople: number,
        status: ReservationStatus = ReservationStatus.PENDING,
        table: Table | null = null
    ) {
        this._id = id;
        this._reservationTime = reservationTime;
        this._numberOfPeople = numberOfPeople;
        this._status = status;
        this._table = table;
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

    public reserveTable(): void {
        this._status = ReservationStatus.CONFIRMED;
    }

    public cancelReservation(): void {
        this._status = ReservationStatus.CANCELLED;
    }

}
