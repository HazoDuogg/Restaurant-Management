import { MenuItem } from './MenuItem.js';

export default class InvoiceDetail {

    private _id: number;
    private _quantity: number;
    private _unitPrice: number;
    private _totalPrice: number;
    private _menuItem: MenuItem | null;

    constructor(
        id: number,
        quantity: number,
        unitPrice: number,
        totalPrice: number,
        menuItem: MenuItem | null = null
    ) {
        this._id = id;
        this._quantity = quantity;
        this._unitPrice = unitPrice;
        this._totalPrice = totalPrice;
        this._menuItem = menuItem;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(value: number) {
        this._quantity = value;
        this._totalPrice = this._unitPrice * value;
    }

    public get unitPrice(): number {
        return this._unitPrice;
    }

    public set unitPrice(value: number) {
        this._unitPrice = value;
        this._totalPrice = value * this._quantity;
    }

    public get totalPrice(): number {
        return this._totalPrice;
    }

    public set totalPrice(value: number) {
        this._totalPrice = value;
    }

    public get menuItem(): MenuItem | null {
        return this._menuItem;
    }

    public set menuItem(value: MenuItem | null) {
        this._menuItem = value;
    }

    public calculateTotal(): number {
        return this._unitPrice * this._quantity;
    }

}
