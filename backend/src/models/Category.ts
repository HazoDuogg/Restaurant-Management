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
}
