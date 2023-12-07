import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

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
    t.nonNull.list.field("allTodos", {
      type: "Todo",
      resolve(_root, _args, ctx) {
        return ctx.db.todo.findMany({});
      },
    });
    t.nonNull.list.field("incompleteTodos", {
      type: "Todo",
      resolve(_root, _args, ctx) {
        return ctx.db.todo.findMany({ where: { completed: false } });
      },
    });
    t.nonNull.list.field("completedTodos", {
      type: "Todo",
      resolve(_root, _args, ctx) {
        return ctx.db.todo.findMany({ where: { completed: true } });
      },
    });
  },
});

export const TodoMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createTodo", {
      type: "Todo",
      args: {
        name: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const todo = {
          name: args.name,
          completed: false,
        };
        return ctx.db.todo.create({ data: todo });
      },
    });
    t.field("completeTodo", {
      type: "Todo",
      args: {
        todoId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.todo.update({
          where: { id: args.todoId },
          data: { completed: true },
        });
      },
    });
    t.field("deleteTodo", {
      type: "Todo",
      args: {
        todoId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.todo.delete({
          where: { id: args.todoId },
        });
      },
    });
  },
});
