export class MenuItem {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly photoUrl: string | null,
    public readonly description: string | null,
    public readonly price: number,
    public readonly category: string
  ) {}
} 