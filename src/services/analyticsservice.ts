export interface AnalyticsEvent {
  eventName: string
  data?: Record<string, unknown>
  timestamp: number
  userId?: string | null
}

class AnalyticsService {
  private endpoint: string | null = null
  private apiKey: string | null = null
  private userId: string | null = null
  private queue: AnalyticsEvent[] = []
  private maxQueueSize = 50
  private batchSize = 10
  private flushing = false

  initAnalytics(endpoint: string, apiKey?: string) {
    this.endpoint = endpoint
    this.apiKey = apiKey || null
  }

  setUserId(id: string | null) {
    this.userId = id
  }

  logEvent(eventName: string, data?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      eventName,
      data,
      timestamp: Date.now(),
      userId: this.userId,
    }
    this.queue.push(event)
    if (this.queue.length > this.maxQueueSize) {
      while (this.queue.length > this.maxQueueSize) {
        this.queue.shift()
      }
      console.warn(
        'AnalyticsService: queue size exceeded maxQueueSize, oldest events dropped'
      )
    }
    if (this.queue.length >= this.batchSize) {
      this.flush().catch((err) => {
        console.error('AnalyticsService flush failed', err)
      })
    }
  }

  async flush(): Promise<void> {
    if (!this.endpoint || this.queue.length === 0) {
      return
    }
    if (this.flushing) {
      return
    }
    this.flushing = true
    const batch = this.queue.splice(0, this.batchSize)
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ events: batch }),
      })
      if (!response.ok) {
        throw new Error(
          `AnalyticsService request failed with status ${response.status}`
        )
      }
    } catch (error) {
      this.queue = [...batch, ...this.queue]
      throw error
    } finally {
      this.flushing = false
    }
  }
}

const analyticsService = new AnalyticsService()

export const initAnalytics = analyticsService.initAnalytics.bind(analyticsService)
export const logEvent = analyticsService.logEvent.bind(analyticsService)
export const setUserId = analyticsService.setUserId.bind(analyticsService)
export const flush = analyticsService.flush.bind(analyticsService)

export default analyticsService
