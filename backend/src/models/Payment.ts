import { PaymentMethod, PaymentStatus } from './enums.js';
import Invoice from './Invoice.js';

export default class Payment {

    private _id: number;
    private _amount: number;
    private _paymentMethod: PaymentMethod;
    private _status: PaymentStatus;
    private _paymentTime: Date | null;
    private _invoice: Invoice | null;

    constructor(
        id: number,
        amount: number,
        paymentMethod: PaymentMethod,
        status: PaymentStatus = PaymentStatus.PENDING,
        paymentTime: Date | null = null,
        invoice: Invoice | null = null
    ) {
        this._id = id;
        this._amount = amount;
        this._paymentMethod = paymentMethod;
        this._status = status;
        this._paymentTime = paymentTime;
        this._invoice = invoice;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get amount(): number {
        return this._amount;
    }

    public set amount(value: number) {
        this._amount = value;
    }

    public get paymentMethod(): PaymentMethod {
        return this._paymentMethod;
    }

    public set paymentMethod(value: PaymentMethod) {
        this._paymentMethod = value;
    }

    public get status(): PaymentStatus {
        return this._status;
    }

    public set status(value: PaymentStatus) {
        this._status = value;
    }

    public get paymentTime(): Date | null {
        return this._paymentTime;
    }

    public set paymentTime(value: Date | null) {
        this._paymentTime = value;
    }

    public get invoice(): Invoice | null {
        return this._invoice;
    }

    public set invoice(value: Invoice | null) {
        this._invoice = value;
    }

    public processPayment(): boolean {
        if (this._amount <= 0 || !this._invoice) {
            return false;
        }
        this._status = PaymentStatus.COMPLETED;
        this._paymentTime = new Date();
        this._invoice.markAsPaid();
        return true;
    }

    public validatePayment(): boolean {
        return this._amount > 0 && !!this._invoice;
    }

    public toJSON() {
        return {
            id: this._id,
            amount: this._amount,
            paymentMethod: this._paymentMethod,
            status: this._status,
            paymentTime: this._paymentTime,
            invoice: this._invoice,
        };
    }

}
