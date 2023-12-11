import App from '@/app/components/App'
import { SAMPLE_DUMMY, SAMPLE_DUMMY_2 } from '@local/dummy'

export default function Home() {
  return (
    <main>
      <h1 className="bg-sky-50 text-3xl font-bold underline">Hello tailwindcss</h1>
      <h1 className="local-test-class">Hello tailwindcss</h1>
      <h1 className="rounded-lg border-amber-600 bg-blue-500 p-2 text-white">
        read from local package {SAMPLE_DUMMY / SAMPLE_DUMMY_2}
      </h1>
      <App />
      <hr />
    </main>
  )
}
