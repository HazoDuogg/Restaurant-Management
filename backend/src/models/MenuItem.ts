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
    this.name;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getCreateAt(): Date | null {
    return this.createdAt;
  }

  public setCreateAt(createAt: Date): void {
    this.createdAt = createAt;
  }

  public getUpdateAt(): Date | null {
    return this.updateAt;
  }

  public setUpdateAt(updateAt: Date): void {
    this.updateAt = updateAt;
  }
}
