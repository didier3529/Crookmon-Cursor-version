import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const SETTINGS_STORAGE_KEY = 'crookmon_quick_clash_settings'

type Settings = {
  theme: 'light' | 'dark'
  soundVolume: number
  musicVolume: number
  showNotifications: boolean
  language: string
  adsEnabled: boolean
  animationsEnabled: boolean
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  theme: 'light',
  soundVolume: 0.5,
  musicVolume: 0.5,
  showNotifications: true,
  language: 'en',
  adsEnabled: true,
  animationsEnabled: true
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
        if (stored) {
          return { ...defaultSettings, ...JSON.parse(stored) }
        }
      }
    } catch {
      // ignore
    }
    return defaultSettings
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      )
    } catch {
      // ignore
    }
  }, [settings])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    let stored: string | null = null
    try {
      stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    } catch {
      // ignore
    }
    if (stored) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSettings(prev => ({ ...prev, theme: e.matches ? 'dark' : 'light' }))
    }
    applyTheme(mediaQuery)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    } else if ((mediaQuery as any).addListener) {
      ;(mediaQuery as any).addListener(applyTheme)
      return () => (mediaQuery as any).removeListener(applyTheme)
    }
  }, [])

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings })
  }, [])

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
