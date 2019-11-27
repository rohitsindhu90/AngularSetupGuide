
export class UserStatus {

    private activetatus: Array<{ text: string, value: number }> = [
        {
            text: "Active",
            value: 1
        },
        {
            text: "InActive",
            value: 0
        }

    ]

    public getUserStatus(): Array<{ text: string, value: number }>
    {
        return this.activetatus;

    }
}