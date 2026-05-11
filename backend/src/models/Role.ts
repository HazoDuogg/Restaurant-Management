export default class Role {
    protected id: number;
    protected roleName: string;
    protected description: string;

    constructor(id: number, roleName: string, description: string) {
        this.id = id;
        this.roleName = roleName;
        this.description = description;
    }

    public getId(): number { return this.id; }
    public getRoleName(): string { return this.roleName; }
    public getDesCripTion(): string { return this.description; }



}