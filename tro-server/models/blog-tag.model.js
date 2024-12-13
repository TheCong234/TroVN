import db from "../lib/db.js";

const BogTagModel = {
  methods: {
    async create(data) {
      return await db.blogTag.create({data});
    },

    async createMany(data) {
      return await db.blogTag.createMany({
        data,
        skipDuplicates: true,
      });
    },

    async findMany() {
      return await db.blogTag.findMany();
    },
    async update(data, id) {
      return await db.blogTag.update({
        where: {
          id,
        },
        data,
      });
    },
    async delete(id) {
      return await db.blogTag.delete(id);
    },
  },
};

export default BogTagModel;
