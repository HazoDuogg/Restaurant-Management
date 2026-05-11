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
}
