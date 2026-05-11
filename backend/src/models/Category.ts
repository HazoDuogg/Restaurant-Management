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

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getCreateAt(): Date {
    return this.createdAt;
  }

  public setCreateAt(createAt: Date): void {
    this.createdAt = createAt;
  }

  public getUpdateAt(): Date {
    return this.updatedAt;
  }

  public setUpdateAt(updateAt: Date): void {
    this.updatedAt = updateAt;
  }
}
