import { OrderStatus } from "./enum.js";
import OrderItem from "./OrderItem.js";
import MenuItem from "./MenuItem.js";

class Order {
    private id: number;
    private orderTime: Date;
    private status: OrderStatus;
    private totalAmount: number;
    private orderItem: OrderItem[];


    constructor(id: number = 0,
        orderTime: Date = new Date(),
        status: OrderStatus = OrderStatus.PENDING,
        totalAmount: number) {

        this.id = id;
        this.orderTime = orderTime;
        this.status = status
        this.totalAmount = totalAmount;
        this.orderItem = [];

    }

    public getId(): number {
        return this.id;
    }
    public setId(id: number): void {
        this.id = id;
    }
    public getOrderTime(): Date {
        return this.orderTime;
    }
    public getOrderItem(): OrderItem[] {
        return this.orderItem;
    }
    public setOrderTime(orderTime: Date): void {
        this.orderTime = orderTime;
    }
    public getStatus() {
        return this.status;
    }
    public setStatus(status: OrderStatus): void {
        this.status = status;
    }
    public addItem(menuItem: MenuItem, quantity: number): void {
    }
    public removeItem(menuItemId: number): void {
    }


}


export default Order;