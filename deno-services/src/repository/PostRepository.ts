import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { posts, saved } from "../db/schema/PostSchema.ts";
import { Location } from "../types.ts";
import { and, eq, sql } from "drizzle-orm";
import { users } from "../db/schema/UserSchema.ts";

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
    imageUrl?: string;
    publicId?: string;
    lat: string;
    long: string;
    location: Location;
  }) {
    const post = {
      authorId: data.userId,
      content: data.content,
      imageUrl: data.imageUrl,
      publicId: data.publicId,
      location: { x: Number(data.lat), y: Number(data.long) },
      stateTag: data.location.state,
      districtTag: data.location.county,
      stateDistrictTag: data.location.state_district,
    };

    return await this.insert([post], posts);
  }

  async getPosts(location: Location, userId: number) {
    try {
      const allPosts = await this.db.execute(sql`
        select 
          p.id as "postId",
          p.content as "content",
          p.image_url as "imageUrl",
          p.state_district_tag as "district",
          p.public_id as "publicId",
          p.created_at as "createdAt",
          u.id as "userId",
          u.name as "name",
          u.username as "username",
          u.picture as "picture",
          (s.post_id IS NOT NULL) as "isSaved"

        from ${posts} p

        inner join ${users} u
          on u.id = p.author_id

        left join ${saved} s
          on s.post_id = p.id
          and s.author_id = ${userId}

        where p.author_id != ${userId}
        and p.state_district_tag = ${location.state_district}

        order by p.created_at desc
    `);
      return [true, allPosts];
    } catch (error) {
      return [false, error.message];
    }
  }

  async getMyPosts(userId: number) {
    try {
      const myPosts = await this.db.execute(sql`
    select
      p.id as "postId",
      p.content as "content",
      p.image_url as "imageUrl",
      p.state_district_tag as "district",
      p.public_id as "publicId",
      p.created_at as "createdAt",
      u.id as "userId",
      u.name as "name",
      u.username as "username",
      u.picture as "picture"

    from ${posts} p
    join ${users} u on p.author_id = u.id
    where u.id = ${userId}
    order by p.created_at desc
    `);
      return [true, myPosts];
    } catch (error) {
      return [false, error.message];
    }
  }

  async savePost(postId: number, userId: number){
    try{
      const savePost = {
        authorId: userId,
        postId: postId
      }
      await this.insert([savePost], saved)
      return [true, "Post saved"]
    }catch(error){
      return [false, error.message]
    }
  }

  async getSavedPost(userId: number){
    try {
      const savePost = await this.db.execute(sql`
      select
        p.id as id,
        p.content as content,
        p.image_url as "imageUrl",
        p.district_tag as "districtTag",
        p.state_tag as "stateTag",
        p.state_district_tag as "stateDistrictTag",
        u.name as name,
        u.username as username,
        u.email as email,
        u.picture as picture,
        s.created_at as "createdAt"
      from ${saved} s
      join ${posts} p on p.id = s.post_id
      join ${users} u on u.id = p.author_id
      where s.author_id = ${userId}
      `)
      return [true, savePost]
    } catch (error) {
      return [false, error.message]
    }
  }

  async removeSavedPost(postId: number, userId: number){
    try {
      await this.db.delete(saved).where(and(eq(saved.postId, postId), eq(saved.authorId, userId)))
      return [true, "Post Unsaved"]
    } catch (error) {
      return [false, error.message]
    }
  }
}
