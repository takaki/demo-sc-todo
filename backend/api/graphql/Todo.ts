import { extendType, objectType } from "nexus";

export const Todo = objectType({
  name: "Todo",
  definition(t) {
    t.int("id");
    t.string("name");
    t.boolean("completed");
  },
});

export const TodoQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("todos", {
      type: "Todo",
      resolve() {
        return [{ id: 1, name: "hoge", completed: false }];
      },
    });
  },
});
