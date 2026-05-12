<<<<<<< HEAD
import MenuItem from "./MenuItem.js";

export default class Category {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  menuItems: MenuItem[] = [];

  constructor(data: Partial<Category> = {}) {
    this.id = data.id ?? 0;
    this.name = data.name ?? "";
    this.description = data.description ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.menuItems = data.menuItems ?? [];
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }
=======
import { MenuItem } from './MenuItem.js';

export default class Category {

    private _id: number;
    private _name: string;
    private _description: string | null;
    private _createdAt: Date | null;
    private _updatedAt: Date | null;
    private _menuItems: MenuItem[] = [];

    constructor(
        id: number,
        name: string,
        description: string | null = null,
        createdAt: Date | null = null,
        updatedAt: Date | null = null
    ) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
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

    public get description(): string | null {
        return this._description;
    }

    public set description(value: string | null) {
        this._description = value;
    }

    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public set createdAt(value: Date | null) {
        this._createdAt = value;
    }

    public get updatedAt(): Date | null {
        return this._updatedAt;
    }

    public set updatedAt(value: Date | null) {
        this._updatedAt = value;
    }

    public get menuItems(): MenuItem[] {
        return this._menuItems;
    }

    public addMenuItem(item: MenuItem): void {
        if (!this._menuItems.find(m => m.id === item.id)) {
            this._menuItems.push(item);
        }
    }

    public removeMenuItem(itemId: number): void {
        this._menuItems = this._menuItems.filter(m => m.id !== itemId);
    }

>>>>>>> 6da82a0c5dca955aecc35586f60428b8dada0760
}
