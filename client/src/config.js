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

export const API_BASE_URL = sanitizeBaseUrl(
  process.env.REACT_APP_API_BASE_URL,
  inferDefaultUrl(8000)
);

export const TOOLKIT_BASE_URL = sanitizeBaseUrl(
  process.env.REACT_APP_TOOLKIT_BASE_URL,
  inferDefaultUrl(5000)
);

export default {
  API_BASE_URL,
  TOOLKIT_BASE_URL,
};
