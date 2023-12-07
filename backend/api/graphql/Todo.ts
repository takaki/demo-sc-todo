import { objectType } from "nexus";

export const Todo = objectType({
  name: "Todo",
  definition(t) {
    t.int("id");
    t.string("name");
    t.boolean("completed");
  },
});
