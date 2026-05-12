
import { MenuStatus } from "./enum.js";
export default class MenuItem {
    private id: number;
    private name: string;
    private price: number;
    private description: string;
    private status: MenuStatus;

    constructor(
        id: number = 0,
        name: string = "",
        price: number = 0,
        description: string = "",
        status: MenuStatus = MenuStatus.AVAILABLE
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.status = status;
    }


    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        return this.price;
    }

    public getDescription(): string {
        return this.description;
    }

    public getStatus(): MenuStatus {
        return this.status;
    }


    public setId(id: number): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setPrice(price: number): void {
        this.price = price;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setStatus(status: MenuStatus): void {
        this.status = status;
    }


    public updatePrice(newPrice: number): void {
        this.price = newPrice;

    }

    public updateStatus(status: MenuStatus): void {
        this.status = status;

    }
}
