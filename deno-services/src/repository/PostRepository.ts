import { Service } from "typedi";
import { DB, getPostgresClient } from "../core/db.ts";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { likes, postViews, posts, saved, trendingTopics } from "../db/schema/PostSchema.ts";
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
          (s.post_id IS NOT NULL) as "isSaved",
          (l_me.post_id IS NOT NULL) as "isLiked",
          COUNT(DISTINCT l_all.id)::int as "likeCount",
          COUNT(DISTINCT c.id)::int as "commentCount",
          COUNT(DISTINCT v.id)::int as "viewCount"

        from ${posts} p

        inner join ${users} u
          on u.id = p.author_id

        left join ${saved} s
          on s.post_id = p.id
          and s.author_id = ${userId}

        left join ${likes} l_me
          on l_me.post_id = p.id
          and l_me.author_id = ${userId}

        left join ${likes} l_all
          on l_all.post_id = p.id

        left join "comments" c
          on c.post_id = p.id

        left join ${postViews} v
          on v.post_id = p.id

        where p.author_id != ${userId}
        and p.state_district_tag = ${location.state_district}

        group by
          p.id, u.id, s.post_id, l_me.post_id

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

  async addView(postId: number, viewerId: number) {
    try {
      await this.db
        .insert(postViews)
        .values({ postId, viewerId })
        .onConflictDoNothing();
      return [true, "View recorded"];
    } catch (error) {
      return [false, error.message];
    }
  }

  async getTrendingByDistrict(district: string) {
    try {
      const result = await this.db
        .select()
        .from(trendingTopics)
        .where(eq(trendingTopics.district, district))
        .orderBy(sql`${trendingTopics.computedAt} desc`)
        .limit(1);
      return [true, result[0] ?? null];
    } catch (error) {
      return [false, error.message];
    }
  }

  async searchPostsByKeyword(district: string, keyword: string, userId: number) {
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
          (s.post_id IS NOT NULL) as "isSaved",
          (l_me.post_id IS NOT NULL) as "isLiked",
          COUNT(DISTINCT l_all.id)::int as "likeCount",
          COUNT(DISTINCT c.id)::int as "commentCount",
          COUNT(DISTINCT v.id)::int as "viewCount"

        from ${posts} p

        inner join ${users} u
          on u.id = p.author_id

        left join ${saved} s
          on s.post_id = p.id
          and s.author_id = ${userId}

        left join ${likes} l_me
          on l_me.post_id = p.id
          and l_me.author_id = ${userId}

        left join ${likes} l_all
          on l_all.post_id = p.id

        left join "comments" c
          on c.post_id = p.id

        left join ${postViews} v
          on v.post_id = p.id

        where p.state_district_tag = ${district}
        and p.content ILIKE ${'%' + keyword + '%'}

        group by
          p.id, u.id, s.post_id, l_me.post_id

        order by p.created_at desc
      `);
      return [true, allPosts];
    } catch (error) {
      return [false, error.message];
    }
  }
}
