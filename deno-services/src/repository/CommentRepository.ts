import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { comments } from "../db/schema/PostSchema.ts";
import { users } from "../db/schema/UserSchema.ts";
import { eq, sql } from "drizzle-orm";

@Service()
export class CommentRepository {
  private db: DB = getPostgresClient();

  async addComment(postId: number, authorId: number, content: string) {
    try {
      const result = await this.db
        .insert(comments)
        .values({ postId, authorId, content })
        .returning();
      return [true, result[0]];
    } catch (error) {
      return [false, error.message];
    }
  }

  async getComments(postId: number) {
    try {
      const result = await this.db.execute(sql`
        select
          c.id as "commentId",
          c.content as "content",
          c.post_id as "postId",
          u.id as "userId",
          u.name as "name",
          u.username as "username",
          u.picture as "picture"
        from ${comments} c
        inner join ${users} u on u.id = c.author_id
        where c.post_id = ${postId}
        order by c.id asc
      `);
      return [true, result];
    } catch (error) {
      return [false, error.message];
    }
  }

  async deleteComment(commentId: number, userId: number) {
    try {
      const existing = await this.db
        .select({ authorId: comments.authorId })
        .from(comments)
        .where(eq(comments.id, commentId))
        .limit(1);

      if (!existing.length || existing[0].authorId !== userId) {
        return [false, "Comment not found or you are not the author"];
      }

      await this.db.delete(comments).where(eq(comments.id, commentId));
      return [true, "Comment deleted"];
    } catch (error) {
      return [false, error.message];
    }
  }
}
