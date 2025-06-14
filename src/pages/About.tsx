const About = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hero of the Day
          </h2>
          <p className="text-gray-700 mb-4">
            This is a minimal SPA built with modern React technologies:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>React 19 with TypeScript</li>
            <li>Vite for fast development and building</li>
            <li>React Router for client-side routing</li>
            <li>Zustand for state management</li>
            <li>Axios for HTTP requests</li>
            <li>Tailwind CSS for styling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About 