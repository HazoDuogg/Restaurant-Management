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