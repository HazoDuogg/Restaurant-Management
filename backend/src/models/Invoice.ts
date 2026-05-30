import { InvoiceStatus } from './enums.js';
import Order from './Order.js';
import InvoiceDetail from './InvoiceDetail.js';

export default class Invoice {

    private _id: number;
    private _invoiceCode: string;
    private _createdTime: Date;
    private _totalAmount: number;
    private _tax: number;
    private _discount: number;
    private _finalAmount: number;
    private _status: InvoiceStatus;
    private _order: Order | null;
    private _details: InvoiceDetail[] = [];

    constructor(
        id: number,
        invoiceCode: string,
        createdTime: Date,
        totalAmount: number = 0,
        tax: number = 0,
        discount: number = 0,
        finalAmount: number = 0,
        status: InvoiceStatus = InvoiceStatus.PENDING,
        order: Order | null = null
    ) {
        this._id = id;
        this._invoiceCode = invoiceCode;
        this._createdTime = createdTime;
        this._totalAmount = totalAmount;
        this._tax = tax;
        this._discount = discount;
        this._finalAmount = finalAmount;
        this._status = status;
        this._order = order;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get invoiceCode(): string {
        return this._invoiceCode;
    }

    public set invoiceCode(value: string) {
        this._invoiceCode = value;
    }

    public get createdTime(): Date {
        return this._createdTime;
    }

    public set createdTime(value: Date) {
        this._createdTime = value;
    }

    public get totalAmount(): number {
        return this._totalAmount;
    }

    public set totalAmount(value: number) {
        this._totalAmount = value;
    }

    public get tax(): number {
        return this._tax;
    }

    public set tax(value: number) {
        this._tax = value;
    }

    public get discount(): number {
        return this._discount;
    }

    public set discount(value: number) {
        this._discount = value;
    }

    public get finalAmount(): number {
        return this._finalAmount;
    }

    public set finalAmount(value: number) {
        this._finalAmount = value;
    }

    public get status(): InvoiceStatus {
        return this._status;
    }

    public set status(value: InvoiceStatus) {
        this._status = value;
    }

    public get order(): Order | null {
        return this._order;
    }

    public set order(value: Order | null) {
        this._order = value;
    }

    public get details(): InvoiceDetail[] {
        return this._details;
    }

    public generateFromOrder(order: Order): void {
        this._order = order;
        this._totalAmount = order.calculateTotal();
        this._details = order.items.map(item =>
            new InvoiceDetail(0, item.quantity, item.unitPrice, item.calculateTotal(), item.menuItem)
        );
        this.calculateFinalAmount();
    }

    public calculateFinalAmount(): number {
        this._finalAmount = this._totalAmount + this._tax - this._discount;
        return this._finalAmount;
    }

    public applyDiscount(amount: number): void {
        this._discount = amount;
        this.calculateFinalAmount();
    }

    public markAsPaid(): void {
        this._status = InvoiceStatus.PAID;
    }

}
