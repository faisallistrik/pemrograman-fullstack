export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600">
              Smart-Hub
            </h1>
            <p className="text-sm text-gray-500 mt-1">Asset & Booking Management</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
