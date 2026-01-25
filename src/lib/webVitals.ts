// src/lib/webVitals.ts
// Core Web Vitals monitoring utility

type MetricName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

interface Metric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

type ReportCallback = (metric: Metric) => void;

// Thresholds based on Google's Core Web Vitals guidelines
const thresholds: Record<MetricName, [number, number]> = {
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  FID: [100, 300],
  INP: [200, 500],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
};

function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const [good, poor] = thresholds[name];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

// Report to console in development
function reportToConsole(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    const colors = {
      good: 'color: green',
      'needs-improvement': 'color: orange',
      poor: 'color: red',
    };
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
      colors[metric.rating]
    );
  }
}

// Report to analytics (customize for your analytics provider)
function reportToAnalytics(metric: Metric) {
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

// Main function to initialize Web Vitals tracking
export async function initWebVitals(onReport?: ReportCallback) {
  if (typeof window === 'undefined') return;

  try {
    const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = await import('web-vitals');

    const handleMetric = (metric: any) => {
      const enrichedMetric: Metric = {
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
      };

      reportToConsole(enrichedMetric);
      reportToAnalytics(enrichedMetric);
      onReport?.(enrichedMetric);
    };

    onCLS(handleMetric);
    onFCP(handleMetric);
    onFID(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  } catch (error) {
    // web-vitals library not available, silently ignore
    console.debug('Web Vitals tracking not available');
  }
}

// Export for manual reporting
export function reportWebVitals(onPerfEntry?: ReportCallback) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    initWebVitals(onPerfEntry);
  }
}
