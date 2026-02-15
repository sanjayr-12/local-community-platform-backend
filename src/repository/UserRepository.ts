import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { users } from "../db/schema/UserSchema.ts";
import { sql } from "drizzle-orm";

@Service()
export class UserRepository {
  private db: DB = getPostgresClient();

  private async insert(values: Record<string, any>[], table: AnyPgTable) {
    return await this.db
      .insert(table)
      .values(values as any)
      .returning();
  }

  async findUserById(id: number) {
    const user = await this.db
      .select()
      .from(users)
      .where(sql`${users.id} = ${id}`);
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`);

    return user;
  }

  async signInWithGoogle(data: {
    name: string;
    email: string;
    username: string;
    picture: string;
  }) {
    return await this.insert([data], users);
  }
}
