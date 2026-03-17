type MetricName =
  | "processing_decomposition_duration_ms"
  | "processing_motion_duration_ms"
  | "processing_playback_duration_ms"
  | "processing_failures_total"
  | "processing_retries_total"
  | "processing_queue_depth"
  | "guest_cleanup_deleted_projects_total"
  | "guest_cleanup_deleted_sessions_total"

type MetricEntry = {
  count: number
  total: number
  lastValue: number
}

const store = new Map<MetricName, MetricEntry>()

function ensureMetric(name: MetricName) {
  const existing = store.get(name)

  if (existing) {
    return existing
  }

  const initial = {
    count: 0,
    total: 0,
    lastValue: 0,
  }

  store.set(name, initial)
  return initial
}

export const metrics = {
  observe(name: MetricName, value: number) {
    const metric = ensureMetric(name)
    metric.count += 1
    metric.total += value
    metric.lastValue = value
  },

  increment(name: MetricName, value = 1) {
    const metric = ensureMetric(name)
    metric.count += 1
    metric.total += value
    metric.lastValue = value
  },

  gauge(name: MetricName, value: number) {
    const metric = ensureMetric(name)
    metric.lastValue = value
  },

  snapshot() {
    return Object.fromEntries(
      Array.from(store.entries()).map(([name, metric]) => [
        name,
        {
          count: metric.count,
          total: metric.total,
          lastValue: metric.lastValue,
          average: metric.count > 0 ? metric.total / metric.count : 0,
        },
      ]),
    )
  },
}
