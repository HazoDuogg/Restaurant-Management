import Account from './Account.js';
import type { AccountStatus, StaffStatus } from './enums.js';
import Role from './Role.js';

export default class Staff extends Account {

    private _staffId: string;
    private _position: string;
    private _startDate: Date | null;
    private _statusWork: StaffStatus;

    constructor(
        id: number,
        name: string,
        password: string,
        staffId: string,
        position: string,
        startDate: Date | null = null,
        phone: string | null = null,
        email: string | null = null,
        accountStatus: AccountStatus,
        statusWork: StaffStatus,
        role: Role | null = null
    ) {
        super(id, name, password, phone, email, accountStatus, role);
        this._staffId = staffId;
        this._position = position;
        this._startDate = startDate;
        this._statusWork = statusWork;
    }

    public get staffId(): string {
        return this._staffId;
    }

    public set staffId(value: string) {
        this._staffId = value;
    }

    public get position(): string {
        return this._position;
    }

    public set position(value: string) {
        this._position = value;
    }

    public get statusWork(): StaffStatus {
        return this._statusWork;
    }

    public set statusWork(value: StaffStatus) {
        this._statusWork = value;
    }

    public get startDate(): Date | null {
        return this._startDate;
    }

    public set startDate(value: Date | null) {
        this._startDate = value;
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            staffId: this._staffId,
            position: this._position,
            startDate: this._startDate,
            statusWork: this._statusWork
        };
    }

}
