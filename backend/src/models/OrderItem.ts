<<<<<<< HEAD
import Order from "./Order.js";
import MenuItem from "./MenuItem.js";
import { number } from "zod";


export default class OrderItem {
    private id: number;
    private quantity: number;
    private unitPrice: number;
    private totalPrice: number;
    private menuItem: MenuItem | null;
    private order: Order | null;




    constructor(id: number,
        quantity: number = 0,
        order: Order | null,
        menuItem: MenuItem | null,
        //khai bao tam truoc chua chinh
        unitPrice: number
    ) {

        this.id = id;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = this.calculateTotal();
        this.order = order;
        this.menuItem = menuItem;

    }


    public getId() {
        return this.id;
    }
    public getQuantity() {
        return this.quantity;
    }
    public getUnitprice() {
        return this.unitPrice;
    }
    public getTotalprice() {
        return this.totalPrice;
    }

    public setId(id: number) {
        this.id = id;
    }
    public setQuantity(quantity: number) {
        this.quantity = quantity;
        this.totalPrice = this.calculateTotal();
    }
    public setUnitprice(unitPrice: number) {
        this.unitPrice = unitPrice;
        this.totalPrice = this.calculateTotal();
    }
    public setOrder(order: Order): void {
        this.order = order;
    }


    public calculateTotal(): number {
        return this.quantity * this.unitPrice;

    }

}
=======
import { MenuItem } from './MenuItem.js';

export class OrderItem {

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
>>>>>>> ce76514e393de78b6182dc269ef052244959a800
