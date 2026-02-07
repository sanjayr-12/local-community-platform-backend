export class Config {
  static readonly PORT: number = Number(Deno.env.get("PORT")) || 3000;
  static readonly DATABASE_URL: string = Deno.env.get("DATABASE_URL") || "";
}
