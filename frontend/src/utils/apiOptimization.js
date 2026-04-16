/**
 * ═══════════════════════════════════════════════════════════════
 * API Optimization Utilities
 * ═══════════════════════════════════════════════════════════════
 *
 * Utilities for optimizing API calls and caching
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import axios from 'axios';

// Cache configuration
const CACHE_CONFIG = {
  enabled: true,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 100 // Maximum number of cached responses
};

// In-memory cache
const cache = new Map();

/**
 * Create cached axios instance
 */
export const createCachedAxios = (config = {}) => {
  const instance = axios.create({
    timeout: 10000,
    ...config
  });

  // Request interceptor
  instance.interceptors.request.use(
    (request) => {
      // Add cache key to request
      request.cacheKey = generateCacheKey(request);

      // Check cache for GET requests
      if (request.method === 'get' && CACHE_CONFIG.enabled) {
        const cached = getFromCache(request.cacheKey);
        if (cached) {
          request._cached = true;
          request._cachedData = cached;
        }
      }

      return request;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Cache GET responses
      if (response.config.method === 'get' && CACHE_CONFIG.enabled) {
        setCache(response.config.cacheKey, {
          data: response.data,
          status: response.status,
          headers: response.headers
        }, response.config.cacheTTL || CACHE_CONFIG.defaultTTL);
      }

      return response;
    },
    (error) => {
      // Return cached data on error if available
      if (error.config && error.config._cached) {
        return Promise.resolve({
          data: error.config._cachedData.data,
          status: 200,
          statusText: 'OK (cached)',
          headers: error.config._cachedData.headers,
          config: error.config,
          cached: true
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Generate cache key from request config
 */
function generateCacheKey(config) {
  const { url, params, data } = config;
  return JSON.stringify({ url, params, data });
}

/**
 * Get data from cache
 */
function getFromCache(key) {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  // Check if cache is expired
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

/**
 * Set data in cache
 */
function setCache(key, data, ttl) {
  // Enforce cache size limit
  if (cache.size >= CACHE_CONFIG.maxSize) {
    // Delete oldest entry
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  cache.set(key, {
    data,
    expires: Date.now() + ttl
  });
}

/**
 * Clear cache
 */
export function clearCache(pattern) {
  if (pattern) {
    // Clear cache entries matching pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}

/**
 * Prefetch API calls
 */
export async function prefetchApiCall(url, config = {}) {
  const cachedAxios = createCachedAxios();

  try {
    await cachedAxios.get(url, config);
    console.log('Prefetched:', url);
  } catch (error) {
    console.error('Prefetch failed:', url, error);
  }
}

/**
 * Batch multiple API calls
 */
export async function batchApiCalls(requests) {
  const cachedAxios = createCachedAxios();

  const promises = requests.map(({ url, config = {} }) =>
    cachedAxios.get(url, config)
  );

  try {
    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Batch API call failed:', error);
    throw error;
  }
}

/**
 * Debounce API calls
 */
export function debounceApiCall(func, delay = 300) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

/**
 * Retry failed API calls
 */
export async function retryApiCall(func, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await func();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}

/**
 * Create optimized API client
 */
export const apiClient = createCachedAxios({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
});

/**
 * Optimized API hooks
 */
export const useOptimizedApi = () => {
  const cachedAxios = createCachedAxios();

  return {
    get: (url, config) => cachedAxios.get(url, config),
    post: (url, data, config) => cachedAxios.post(url, data, config),
    put: (url, data, config) => cachedAxios.put(url, data, config),
    delete: (url, config) => cachedAxios.delete(url, config),
    prefetch: prefetchApiCall,
    batch: batchApiCalls,
    clearCache: clearCache
  };
};

/**
 * Request queue for sequential API calls
 */
export class RequestQueue {
  constructor(concurrency = 5) {
    this.queue = [];
    this.activeCount = 0;
    this.concurrency = concurrency;
  }

  add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject
      });

      this.process();
    });
  }

  async process() {
    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      const { requestFn, resolve, reject } = this.queue.shift();

      this.activeCount++;

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.activeCount--;
        this.process();
      }
    }
  }
}

/**
 * Create request queue instance
 */
export const requestQueue = new RequestQueue();
