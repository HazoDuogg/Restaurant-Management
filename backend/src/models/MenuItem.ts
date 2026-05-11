<<<<<<< HEAD
export default class MenuItem {
  private id: number;
  private name: string;
  private description: string | null;
  private createdAt: Date | null;
  private updateAt: Date | null;

  constructor(
    id: number,
    name: string,
    description: string | null,
    createAt: Date | null,
    updateAt: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createAt;
    this.updateAt = updateAt;
  }
=======
import { MenuStatus } from './enums.js';
import type Category from './Category.js';

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

>>>>>>> 6da82a0c5dca955aecc35586f60428b8dada0760
}
