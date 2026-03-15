import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { likes } from "../db/schema/PostSchema.ts";
import { and, eq } from "drizzle-orm";

@Service()
export class LikeRepository {
  private db: DB = getPostgresClient();

  async addLike(postId: number, userId: number) {
    try {
      await this.db
        .insert(likes)
        .values({ postId, authorId: userId })
        .onConflictDoNothing();
      return [true, "Post liked"];
    } catch (error) {
      return [false, error.message];
    }
  }

  async removeLike(postId: number, userId: number) {
    try {
      await this.db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.authorId, userId)));
      return [true, "Post unliked"];
    } catch (error) {
      return [false, error.message];
    }
  }
}
