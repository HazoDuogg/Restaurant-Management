import { TableStatus, TableType } from './enums.js';

export default class Table {

    private _id: number;
    private _tableNumber: number;
    private _capacity: number;
    private _type: TableType;
    private _status: TableStatus;

    constructor(
        id: number,
        tableNumber: number,
        capacity: number,
        type: TableType = TableType.NORMAL,
        status: TableStatus = TableStatus.AVAILABLE
    ) {
        this._id = id;
        this._tableNumber = tableNumber;
        this._capacity = capacity;
        this._type = type;
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

    public get type(): TableType {
        return this._type;
    }

    public set type(value: TableType) {
        this._type = value;
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

    public toJSON() {
        return {
            id: this._id,
            tableNumber: this._tableNumber,
            capacity: this._capacity,
            type: this._type,
            status: this._status,
        };
    }

}
