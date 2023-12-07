"use client";
import { ApolloProvider, useQuery } from "@apollo/client";
import { client } from "@/src";
import { graphql } from "@/src/gql";

const GET_LOCATIONS = graphql(`
  query Todos {
    allTodos {
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
      </div>
    </ApolloProvider>
  );
}

function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

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
        {data.allTodos.map((e) => (
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
