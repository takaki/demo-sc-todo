"use client";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import { client } from "@/src";
import { graphql } from "@/src/gql";
import { useState } from "react";

const GET_COMPLETED_TODOS = graphql(`
  query Todos {
    completedTodos {
      id
      name
      completed
    }
  }
`);

const GET_INCOMPLETE_TODOS = graphql(`
  query InCompleteTodos {
    incompleteTodos {
      id
      name
      completed
    }
  }
`);

const ADD_TODO = graphql(`
  mutation createTodo($name: String!) {
    createTodo(name: $name) {
      id
      name
      completed
    }
  }
`);

const COMPLETE_TODO = graphql(`
  mutation CompleteTodo($todoId: Int!) {
    completeTodo(todoId: $todoId) {
      id
      name
      completed
    }
  }
`);

function App() {
  const [completed, setCompleted] = useState(false);
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo Todo app 🚀</h2>
        <input
          type={"radio"}
          name={"completed"}
          value={"false"}
          checked={!completed}
          onClick={() => setCompleted(false)}
        />
        <label>未完了</label>
        <input
          type={"radio"}
          name={"completed"}
          value={"true"}
          checked={completed}
          onClick={() => setCompleted(true)}
        />
        <label>完了</label>
        {completed ? <DisplayCompleteTodos /> : <DisplayIncompleteTodos />}
      </div>
    </ApolloProvider>
  );
}

function AddForm() {
  const [name, setName] = useState("");
  // noinspection JSUnusedLocalSymbols
  const [addTodo, { data, loading, error }] = useMutation(ADD_TODO, {
    refetchQueries: ["InCompleteTodos"],
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await addTodo({ variables: { name: name } });
        setName("");
      }}
    >
      課題を追加
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

function Complete(v: { todoId: number }) {
  // noinspection JSUnusedLocalSymbols
  const [completeTodo, { data, loading, error }] = useMutation(COMPLETE_TODO, {
    refetchQueries: ["InCompleteTodos"],
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <button
      onClick={async () => {
        await completeTodo({ variables: { todoId: v.todoId } });
      }}
    >
      完了!!
    </button>
  );
}

function DisplayIncompleteTodos() {
  const { loading, error, data } = useQuery(GET_INCOMPLETE_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return <p>No data</p>;
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>課題名</th>
            <th>完了ボタン</th>
          </tr>
        </thead>
        <tbody>
          {data.incompleteTodos.map((e) =>
            e?.id ? (
              <tr key={e?.id}>
                <td>{e?.id}</td>
                <td>{e?.name}</td>
                <td>
                  {e?.completed ? "completed" : <Complete todoId={e?.id} />}
                </td>
              </tr>
            ) : (
              <tr key={e?.id}>
                <td>No data</td>
                <td />
                <td />
              </tr>
            )
          )}
        </tbody>
      </table>
      <AddForm />
    </div>
  );
}

function DisplayCompleteTodos() {
  const { loading, error, data } = useQuery(GET_COMPLETED_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return <p>No data</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>課題名</th>
          <th>状況</th>
        </tr>
      </thead>
      <tbody>
        {data.completedTodos.map((e) => (
          <tr key={e?.id}>
            <td>{e?.id}</td>
            <td>{e?.name}</td>
            <td>完了済</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
