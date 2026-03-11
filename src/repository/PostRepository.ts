import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { posts } from "../db/schema/PostSchema.ts";
import { Location } from "../types.ts";

@Service()
export class PostRepository {
  private db: DB = getPostgresClient();

  private async insert(values: Record<string, any>[], table: AnyPgTable) {
    return await this.db
      .insert(table)
      .values(values as any)
      .returning();
  }

  async addPost(data: {
    userId: number;
    content: string;
    image_url?: string;
    lat: string;
    long: string;
    location: Location;
  }) {
    const post = {
      authorId: data.userId,
      content: data.content,
      imageUrl: data.image_url,
      location: { x: Number(data.lat), y: Number(data.long) },
      stateTag: data.location.state,
      districtTag: data.location.county,
      stateDistrictTag: data.location.state_district,
    };

    return await this.insert([post], posts);
  }
}
