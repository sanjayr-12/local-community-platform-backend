import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { users } from "../db/schema/UserSchema.ts";
import { sql } from "drizzle-orm";
import { posts } from "../db/schema/PostSchema.ts";

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

  async getMeV2(userId: number){
    try {
      const user = await this.db.execute(sql`
      select 
        u.id as id,
        u.name as name,
        u.username as username,
        u.email as email,
        u.picture as picture,
        u.bio as bio,
        u.created_at as createdAt,
        COUNT(p.id) as "totalNumOfPosts"

      from ${users} u
      left join ${posts} p on u.id = p.author_id
      where u.id = ${userId}
      group by 
          u.id,
          u.name,
          u.username,
          u.email,
          u.picture,
          u.bio,
          u.created_at
      `)
      return [true, user];
    } catch (error) {
      console.log(error)
      return [false, error.message]
    }
  }
}
