import { OrderStatus } from './enums.js';
import { OrderItem } from './OrderItem.js';
import { MenuItem } from './MenuItem.js';
import Customer from './Customer.js';
import Staff from './Staff.js';
import Table from './Table.js';

export default class Order {

    private _id: number;
    private _orderTime: Date;
    private _status: OrderStatus;
    private _totalAmount: number;
    private _customer: Customer | null;
    private _staff: Staff | null;
    private _table: Table | null;
    private _items: OrderItem[] = [];

    constructor(
        id: number,
        orderTime: Date,
        status: OrderStatus = OrderStatus.PENDING,
        totalAmount: number = 0,
        customer: Customer | null = null,
        staff: Staff | null = null,
        table: Table | null = null
    ) {
        this._id = id;
        this._orderTime = orderTime;
        this._status = status;
        this._totalAmount = totalAmount;
        this._customer = customer;
        this._staff = staff;
        this._table = table;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get orderTime(): Date {
        return this._orderTime;
    }

    public set orderTime(value: Date) {
        this._orderTime = value;
    }

    public get status(): OrderStatus {
        return this._status;
    }

    public set status(value: OrderStatus) {
        this._status = value;
    }

    public get totalAmount(): number {
        return this._totalAmount;
    }

    public set totalAmount(value: number) {
        this._totalAmount = value;
    }

    public get customer(): Customer | null {
        return this._customer;
    }

    public set customer(value: Customer | null) {
        this._customer = value;
    }

    public get staff(): Staff | null {
        return this._staff;
    }

    public set staff(value: Staff | null) {
        this._staff = value;
    }

    public get table(): Table | null {
        return this._table;
    }

    public set table(value: Table | null) {
        this._table = value;
    }

    public get items(): OrderItem[] {
        return this._items;
    }

    public addItem(menuItem: MenuItem, quantity: number): void {
        const existing = this._items.find(item => item.menuItem?.id === menuItem.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this._items.push(new OrderItem(0, quantity, menuItem.price, menuItem.price * quantity, menuItem));
        }
        this._totalAmount = this.calculateTotal();
    }

    public removeItem(menuItemId: number): void {
        this._items = this._items.filter(item => item.menuItem?.id !== menuItemId);
        this._totalAmount = this.calculateTotal();
    }

    public calculateTotal(): number {
        return this._items.reduce((sum, item) => sum + item.calculateTotal(), 0);
    }

    public updateStatus(status: OrderStatus): void {
        this._status = status;
    }

}
