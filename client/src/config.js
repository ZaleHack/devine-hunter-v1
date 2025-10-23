const sanitizeBaseUrl = (url, fallback) => {
  if (!url) {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  return trimmed.replace(/\/+$/, '');
};

const inferDefaultUrl = (port) => {
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:${port}`;
    }
    return `${protocol}//${hostname}`;
  }

  return `http://localhost:${port}`;
};

const normalizePath = (value) => {
  if (!value || value === '/') {
    return '';
  }

  const trimmed = value.replace(/\/+$/, '');
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const createEndpointConfig = (rawValue, fallbackValue, defaultPath = '') => {
  const sanitized = sanitizeBaseUrl(rawValue, fallbackValue);

  try {
    const parsed = new URL(sanitized);
    const baseUrl = `${parsed.protocol}//${parsed.host}`;
    const resolvedPath = normalizePath(parsed.pathname) || normalizePath(defaultPath);

    return { baseUrl, path: resolvedPath };
  } catch (error) {
    return {
      baseUrl: sanitized,
      path: normalizePath(defaultPath),
    };
  }
};

const combineUrlSegments = (segments, { leadingSlash = false } = {}) => {
  const cleaned = segments
    .filter((segment) => typeof segment === 'string' && segment.length > 0)
    .map((segment, index) => {
      if (index === 0) {
        return segment.replace(/\/+$/, '');
      }
      return segment.replace(/^\/+/, '').replace(/\/+$/, '');
    })
    .filter((segment) => segment.length > 0);

  if (cleaned.length === 0) {
    return leadingSlash ? '/' : '';
  }

  const combined = cleaned.join('/');
  if (leadingSlash) {
    return combined.startsWith('/') ? combined : `/${combined}`;
  }

  return combined;
};

const apiConfig = createEndpointConfig(
  process.env.REACT_APP_API_BASE_URL,
  inferDefaultUrl(8000),
  '/api'
);

const toolkitConfig = createEndpointConfig(
  process.env.REACT_APP_TOOLKIT_BASE_URL,
  inferDefaultUrl(5000),
  ''
);

export const API_BASE_URL = apiConfig.baseUrl;
export const API_PREFIX = apiConfig.path || '/api';

export const TOOLKIT_BASE_URL = toolkitConfig.baseUrl;
export const TOOLKIT_PREFIX = toolkitConfig.path;

export const buildApiPath = (path = '') =>
  combineUrlSegments([API_PREFIX, path], { leadingSlash: true });

export const buildApiUrl = (path = '') =>
  combineUrlSegments([API_BASE_URL, API_PREFIX, path]);

export const buildToolkitUrl = (path = '') =>
  combineUrlSegments([TOOLKIT_BASE_URL, TOOLKIT_PREFIX, path]);

const config = {
  API_BASE_URL,
  API_PREFIX,
  TOOLKIT_BASE_URL,
  TOOLKIT_PREFIX,
  buildApiPath,
  buildApiUrl,
  buildToolkitUrl,
};

export default config;
