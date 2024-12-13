import db from "../lib/db.js";
const PolicyModel = {
  methods: {
    async create(data) {
      return await db.policy.create({ data });
    },

    async find(id) {
      return await db.policy.findFirst({
        where: {
          id,
        },
      });
    },

    async delete(id) {
      return await db.policy.delete({
        where: {
          id,
        },
      });
    },
  },
};

export default PolicyModel;
