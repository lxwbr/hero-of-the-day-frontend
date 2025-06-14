import { useState, useEffect } from 'react'
import { useCounterStore } from '../stores/counterStore'
import { fetchHeroData } from '../services/api'
import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

const Home = () => {
  const { count, increment, decrement } = useCounterStore()
  const [heroData, setHeroData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHeroData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchHeroData()
        setHeroData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hero data')
      } finally {
        setLoading(false)
      }
    }

    loadHeroData()
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome to Hero of the Day
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Counter Example (Zustand)
          </h2>
          <div className="flex items-center space-x-4">
            <Button color="red" onClick={decrement}>-</Button>
            <span className="text-2xl font-bold text-gray-900">{count}</span>
            <Button color="green" onClick={increment}>+</Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mantine Example
          </h2>
          <Button
            onClick={() => showNotification({
              title: 'Mantine Notification',
              message: 'This is a Mantine notification!',
              color: 'blue',
            })}
          >
            Show Mantine Notification
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            API Data Example (Axios)
          </h2>
          {loading && (
            <div className="text-gray-600">Loading hero data...</div>
          )}
          {error && (
            <div className="text-red-600">Error: {error}</div>
          )}
          {heroData && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {heroData.title}
              </h3>
              <p className="text-gray-700">{heroData.body}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home 