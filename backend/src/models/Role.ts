export default class Role {

    private _id: number;
    private _roleName: string;
    private _description: string | null;

    constructor(id: number, roleName: string, description: string | null = null) {
        this._id = id;
        this._roleName = roleName;
        this._description = description;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get roleName(): string {
        return this._roleName;
    }

    public set roleName(value: string) {
        this._roleName = value;
    }

    public get description(): string | null {
        return this._description;
    }

    public set description(value: string | null) {
        this._description = value;
    }

}
