import { TableStatus } from './enums.js';

export default class Table {

    private _id: number;
    private _tableNumber: number;
    private _capacity: number;
    private _status: TableStatus;

    constructor(
        id: number,
        tableNumber: number,
        capacity: number,
        status: TableStatus = TableStatus.AVAILABLE
    ) {
        this._id = id;
        this._tableNumber = tableNumber;
        this._capacity = capacity;
        this._status = status;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get tableNumber(): number {
        return this._tableNumber;
    }

    public set tableNumber(value: number) {
        this._tableNumber = value;
    }

    public get capacity(): number {
        return this._capacity;
    }

    public set capacity(value: number) {
        this._capacity = value;
    }

    public get status(): TableStatus {
        return this._status;
    }

    public set status(value: TableStatus) {
        this._status = value;
    }

    public updateStatus(status: TableStatus): void {
        this._status = status;
    }

}
