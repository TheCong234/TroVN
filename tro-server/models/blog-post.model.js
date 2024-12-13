import db from "../lib/db.js";

const BlogPostModel = {
  methods: {
    async create(data) {
      return await db.blogPost.create({
        data,
      });
    },

    async findAll(keyword, tag, page = 1, limit = 10) {
      const skip = (page - 1) * parseInt(limit);
      return await db.blogPost.findMany({
        skip,
        take: parseInt(limit),
        where: {
          OR: keyword
            ? [
                { title: { contains: keyword, mode: "insensitive" } },
                { content: { contains: keyword, mode: "insensitive" } },
              ]
            : undefined,
          tags: tag ? { some: { name: tag } } : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnail: true,
          tags: true,
          createdAt: true,
          author: {
            select: {
              fullName: true,
              id: true,
              avatarUrl: true,
            },
          },
        },
        // include: {
        //   author: {
        //     select: {
        //       fullName: true,
        //       id: true,
        //       avatarUrl: true,
        //       // email: true,
        //       // phoneNumber: true,
        //       // isVerify: true,
        //     },
        //   },
        //   tags: true,
        // },
      });
    },

    async update(data, id) {
      return await db.blogPost.update({
        where: {
          id,
        },
        data,
      });
    },

    async delete(id) {
      return await db.blogPost.delete({ where: { id } });
    },

    async findOne(slug) {
      return await db.blogPost.findFirst({
        where: {
          slug,
        },
        include: {
          author: {
            select: {
              id: true,
              avatarUrl: true,
              fullName: true,
              email: true,
            },
          },
          tags: true,
        },
      });
    },
  },
};

export default BlogPostModel;
