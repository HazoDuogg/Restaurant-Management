export default class Role {
    protected id: number;
    protected roleName: string;
    protected description: string;

    constructor(id: number, roleName: string, description: string) {
        this.id = id;
        this.roleName = roleName;
        this.description = description;
    }

    public getId() {
        return this.id;
    }
    public setId(id: number) {
        this.id = id;
    }

    public getRoleName() {
        return this.roleName;
    }
    public setRoleName(roleName: string) {
        this.roleName = roleName;
    }

    public getDescription() {
        return this.description;
    }
    public setDescription(description: string) {
        this.description = description;
    }
}
