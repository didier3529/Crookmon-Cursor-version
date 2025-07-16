import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

const WinStreakContext = createContext<WinStreakContextType | undefined>(undefined)

const CURRENT_STREAK_KEY = 'winStreak.current'
const BEST_STREAK_KEY = 'winStreak.best'

export function WinStreakProvider({ children }: { children: ReactNode }): JSX.Element {
  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    try {
      const stored = window.localStorage.getItem(CURRENT_STREAK_KEY)
      return stored !== null ? parseInt(stored, 10) || 0 : 0
    } catch (e) {
      console.error('Failed to read current streak from localStorage:', e)
      return 0
    }
  })

  const [bestStreak, setBestStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    try {
      const stored = window.localStorage.getItem(BEST_STREAK_KEY)
      return stored !== null ? parseInt(stored, 10) || 0 : 0
    } catch (e) {
      console.error('Failed to read best streak from localStorage:', e)
      return 0
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(CURRENT_STREAK_KEY, currentStreak.toString())
      window.localStorage.setItem(BEST_STREAK_KEY, bestStreak.toString())
    } catch (e) {
      console.error('Failed to save win streaks to localStorage:', e)
    }
  }, [currentStreak, bestStreak])

  const incrementStreak = () => {
    setCurrentStreak(prev => {
      const next = prev + 1
      setBestStreak(prevBest => Math.max(prevBest, next))
      return next
    })
  }

  const resetStreak = () => {
    setCurrentStreak(0)
  }

  return (
    <WinStreakContext.Provider value={{ currentStreak, bestStreak, incrementStreak, resetStreak }}>
      {children}
    </WinStreakContext.Provider>
  )
}

export function useWinStreak(): WinStreakContextType {
  const context = useContext(WinStreakContext)
  if (!context) {
    throw new Error('useWinStreak must be used within a WinStreakProvider')
  }
  return context
}
