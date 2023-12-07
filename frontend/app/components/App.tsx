"use client";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import { client } from "@/src";
import { graphql } from "@/src/gql";
import { useState } from "react";

// noinspection JSUnusedLocalSymbols
const GET_ALL_TODOS = graphql(`
  query Todos {
    allTodos {
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

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo Todo app 🚀</h2>
        <DisplayLocations />
        <AddForm />
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
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}
function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_INCOMPLETE_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return <p>No data</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        {data.incompleteTodos.map((e) => (
          <tr key={e?.id}>
            <td>{e?.id}</td>
            <td>{e?.name}</td>
            <td>{e?.completed ? "completed" : "not completed"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default App;
