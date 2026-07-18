import Logo from '../Components/Logo'
import ThemeToggle from '../Components/ThemeToggle'

export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-primary/10 dark:from-ink dark:to-ink-soft px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-ink-soft rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Logo className="h-10" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
