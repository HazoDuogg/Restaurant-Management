export default class Report {

    private _id: number;
    private _fromDate: Date;
    private _toDate: Date;
    private _totalRevenue: number | null;
    private _createdAt: Date | null;

    constructor(
        id: number = 0,
        fromDate: Date = new Date(),
        toDate: Date = new Date(),
        totalRevenue: number | null = null,
        createdAt: Date | null = null
    ) {
        this._id = id;
        this._fromDate = fromDate;
        this._toDate = toDate;
        this._totalRevenue = totalRevenue;
        this._createdAt = createdAt;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get fromDate(): Date {
        return this._fromDate;
    }

    public set fromDate(value: Date) {
        this._fromDate = value;
    }

    public get toDate(): Date {
        return this._toDate;
    }

    public set toDate(value: Date) {
        this._toDate = value;
    }

    public get totalRevenue(): number | null {
        return this._totalRevenue;
    }

    public set totalRevenue(value: number | null) {
        this._totalRevenue = value;
    }

    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public set createdAt(value: Date | null) {
        this._createdAt = value;
    }

    public generateReport(): void {
        this._createdAt = new Date();
    }

    public calculateRevenue(): number {
        if (this._totalRevenue === null) {
            return 0;
        }
        return this._totalRevenue;
    }

}
