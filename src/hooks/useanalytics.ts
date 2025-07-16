import { useCallback } from 'react'
import * as Analytics from '../services/analyticsservice'

export default function useAnalytics() {
  const trackEvent = useCallback((eventName: string, data?: Record<string, unknown>) => {
    Analytics.logEvent(eventName, data)
  }, [])

  return { trackEvent }
}
