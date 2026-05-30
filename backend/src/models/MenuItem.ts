import { MenuStatus } from './enums.js';
import Category from './Category.js';

export class MenuItem {

    private _id: number;
    private _name: string;
    private _price: number;
    private _description: string | null;
    private _status: MenuStatus;
    private _category: Category | null;

    constructor(
        id: number,
        name: string,
        price: number,
        description: string | null = null,
        status: MenuStatus = MenuStatus.AVAILABLE,
        category: Category | null = null
    ) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._description = description;
        this._status = status;
        this._category = category;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get price(): number {
        return this._price;
    }

    public set price(value: number) {
        this._price = value;
    }

    public get description(): string | null {
        return this._description;
    }

    public set description(value: string | null) {
        this._description = value;
    }

    public get status(): MenuStatus {
        return this._status;
    }

    public set status(value: MenuStatus) {
        this._status = value;
    }

    public get category(): Category | null {
        return this._category;
    }

    public set category(value: Category | null) {
        this._category = value;
    }

    public updatePrice(newPrice: number): void {
        if (newPrice > 0) {
            this._price = newPrice;
        }
    }

    public updateStatus(status: MenuStatus): void {
        this._status = status;
    }

    public toJSON() {
        return {
            id: this._id,
            name: this._name,
            price: this._price,
            description: this._description,
            status: this._status,
            category: this._category,
        };
    }

}
