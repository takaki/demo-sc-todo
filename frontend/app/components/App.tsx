"use client";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import { client } from "@/src";
import { graphql } from "@/src/gql";
import { Button, Input, Radio, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Todo } from "@/src/gql/graphql";
import { atom, RecoilRoot, selector, useRecoilState, useRecoilValue } from "recoil";

const GET_COMPLETED_TODOS = graphql(`
  query Todos {
    completedTodos {
      id
      name
      completed
    }
  }
`)

const GET_INCOMPLETE_TODOS = graphql(`
  query InCompleteTodos {
    incompleteTodos {
      id
      name
      completed
    }
  }
`)

const ADD_TODO = graphql(`
  mutation createTodo($name: String!) {
    createTodo(name: $name) {
      id
      name
      completed
    }
  }
`)

const COMPLETE_TODO = graphql(`
  mutation CompleteTodo($todoId: Int!) {
    completeTodo(todoId: $todoId) {
      id
      name
      completed
    }
  }
`)

const completedState = atom({
  key: 'completedState',
  default: false,
})

function App() {
  return (
    <RecoilRoot>
      <ApolloProvider client={client}>
        <AppImpl />
      </ApolloProvider>
    </RecoilRoot>
  )
}

function AppImpl() {
  const [completed, setCompleted] = useRecoilState(completedState)
  return (
    <ApolloProvider client={client}>
      <Typography.Title level={2}>My first Apollo Todo app 🚀</Typography.Title>
      <Radio.Group name={"completed"} defaultValue={1} onChange={(e) => setCompleted(e.target.value !== 1)}>
        <Radio value={1}>未完了</Radio>
        <Radio value={2}>完了</Radio>
      </Radio.Group>
      {completed ? <DisplayCompleteTodos /> : <DisplayIncompleteTodos />}
    </ApolloProvider>
  )
}

const nameState = atom({
  key: 'nameState',
  default: '',
})

const nameLengthState = selector({
  key: 'nameLengthState',
  get: ({ get }) => {
    return get(nameState).length
  },
})

function AddForm() {
  const [name, setName] = useRecoilState(nameState)
  const nameLength = useRecoilValue(nameLengthState)
  // noinspection JSUnusedLocalSymbols
  const [addTodo, { data, loading, error }] = useMutation(ADD_TODO, {
    refetchQueries: ['InCompleteTodos'],
  })

  if (loading) return 'Submitting...'
  if (error) return `Submission error! ${error.message}`

  return (
    <div>
      <Typography.Title level={3}>課題を追加</Typography.Title>
      <Input type="text" value={name} style={{ width: "20%" }} onChange={(e) => setName(e.target.value)} />
      <Button
        type="default"
        onClick={async (e) => {
          e.preventDefault()
          await addTodo({ variables: { name: name } })
          setName('')
        }}
      >
        Add Todo (length = {nameLength})
      </Button>
    </div>
  )
}

function Complete(v: { todoId: number }) {
  // noinspection JSUnusedLocalSymbols
  const [completeTodo, { data, loading, error }] = useMutation(COMPLETE_TODO, {
    refetchQueries: ['InCompleteTodos'],
  })

  if (loading) return 'Submitting...'
  if (error) return `Submission error! ${error.message}`

  return (
    <Button
      onClick={async () => {
        await completeTodo({ variables: { todoId: v.todoId } })
      }}
    >
      完了!!
    </Button>
  )
}

function DisplayIncompleteTodos() {
  const { loading, error, data } = useQuery(GET_INCOMPLETE_TODOS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>
  if (!data) return <p>No data</p>
  const dataSource = data.incompleteTodos.map((e) => ({
    id: e?.id,
    name: e?.name,
    completed: e?.completed,
  }))
  const columns: ColumnsType<Omit<Todo, '__typename'>> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    { title: '課題名', dataIndex: 'name', key: 'name' },
    {
      title: '完了ボタン',
      dataIndex: 'id',
      key: 'completed',
      render: (id) => <Complete todoId={id} />,
    },
  ]

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
      <AddForm />
    </div>
  )
}

function DisplayCompleteTodos() {
  const { loading, error, data } = useQuery(GET_COMPLETED_TODOS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>
  if (!data) return <p>No data</p>

  const dataSource = data.completedTodos.map((e) => ({
    id: e?.id,
    name: e?.name,
  }))
  const columns: ColumnsType<Omit<Todo, '__typename' | 'completed'>> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    { title: '課題名', dataIndex: 'name', key: 'name' },
    {
      title: '状況',
      dataIndex: 'completed',
      key: 'completed',
      render: () => 'Done',
    },
  ]

  return <Table dataSource={dataSource} columns={columns} />
}

export default App
