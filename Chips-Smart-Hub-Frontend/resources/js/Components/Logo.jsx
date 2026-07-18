import logoLight from '../../images/smarthub-logo-light.svg'
import logoDark from '../../images/smarthub-logo-dark.svg'
import { useTheme } from '../contexts/ThemeContext'

export default function Logo({ className = 'h-9' }) {
  const { theme } = useTheme()

  return (
    <img
      src={theme === 'dark' ? logoDark : logoLight}
      alt="smarthub — Asset & Booking Management"
      className={className}
    />
  )
}
