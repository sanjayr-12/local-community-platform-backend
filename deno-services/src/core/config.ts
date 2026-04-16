export class Config {
  static readonly PORT: number = Number(Deno.env.get("PORT")) || 3000;
  static readonly DATABASE_URL: string = Deno.env.get("DATABASE_URL") || "";
  static readonly GOOGLE_CLIENT_ID: string =
    Deno.env.get("GOOGLE_CLIENT_ID") || "";
  static readonly JWT_SECRET: string =
    Deno.env.get("JWT_SECRET") || "secretmaybe";
  static readonly NOMINATION_URL: string = Deno.env.get("NOMINATION_URL") || "";
  static readonly CLOUDINARY_API_KEY: string =
    Deno.env.get("CLOUDINARY_API_KEY");
  static readonly CLOUDINARY_API_SECRET: string = Deno.env.get(
    "CLOUDINARY_API_SECRET",
  );
  static readonly CLOUD_NAME: string = Deno.env.get("CLOUD_NAME");
  static readonly ML_SERVICE_URL: string =
    Deno.env.get("ML_SERVICE_URL") || "http://localhost:8000";
  static readonly BACKEND_URL: string | undefined =
    Deno.env.get("BACKEND_URL");
}
