// lib/performance.ts - PERFORMANCE OPTIMIZATIONS
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string) {
    this.metrics.set(name, performance.now());
  }

  endMeasure(name: string): number {
    const start = this.metrics.get(name);
    if (start) {
      const duration = performance.now() - start;
      this.metrics.delete(name);
      
      // Log to analytics in production
      if (process.env.NODE_ENV === 'production') {
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }

  // Image loading optimization
  static optimizeImageUrl(url: string, width: number, height: number): string {
    if (url.includes('unsplash.com') || url.includes('your-cdn.com')) {
      return `${url}?w=${width}&h=${height}&fit=crop&auto=format&q=80&fm=webp`;
    }
    return url;
  }

  // Lazy loading helper
  static createIntersectionObserver(
    callback: (isIntersecting: boolean) => void,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    return new IntersectionObserver(([entry]) => {
      callback(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });
  }
}