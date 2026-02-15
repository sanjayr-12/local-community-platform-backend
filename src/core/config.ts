export class Config {
  static readonly PORT: number = Number(Deno.env.get("PORT")) || 3000;
  static readonly DATABASE_URL: string = Deno.env.get("DATABASE_URL") || "";
  static readonly GOOGLE_CLIENT_ID: string =
    Deno.env.get("GOOGLE_CLIENT_ID") || "";
  static readonly JWT_SECRET: string =
    Deno.env.get("JWT_SECRET") || "secretmaybe";
}
