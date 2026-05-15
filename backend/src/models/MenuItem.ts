<<<<<<< HEAD

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
=======
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

>>>>>>> ce76514e393de78b6182dc269ef052244959a800
}
