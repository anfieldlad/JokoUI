/**
 * PrabogoConnect - HTTP Client for Prabogo Backend
 * Dedicated API adapter with automatic JSON parsing
 */

/**
 * PrabogoClient class for making HTTP requests to Prabogo Backend
 */
export class PrabogoClient {
    /**
     * Create a new PrabogoClient instance
     * @param {Object} config - Configuration options
     * @param {string} config.baseUrl - Base URL for the API
     * @param {Object} config.defaultHeaders - Default headers for all requests
     * @param {number} config.timeout - Request timeout in milliseconds
     */
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || '';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...config.defaultHeaders
        };
        this.timeout = config.timeout || 30000;
        this.interceptors = {
            request: [],
            response: []
        };
    }

    /**
     * Set the base URL for all requests
     * @param {string} url - The base URL
     */
    setBaseUrl(url) {
        this.baseUrl = url;
    }

    /**
     * Add a default header to all requests
     * @param {string} key - Header key
     * @param {string} value - Header value
     */
    setHeader(key, value) {
        this.defaultHeaders[key] = value;
    }

    /**
     * Set authorization token
     * @param {string} token - Bearer token
     */
    setAuthToken(token) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Add request interceptor
     * @param {Function} interceptor - Function to transform request config
     */
    addRequestInterceptor(interceptor) {
        this.interceptors.request.push(interceptor);
    }

    /**
     * Add response interceptor
     * @param {Function} interceptor - Function to transform response
     */
    addResponseInterceptor(interceptor) {
        this.interceptors.response.push(interceptor);
    }

    /**
     * Make an HTTP request
     * @param {string} endpoint - API endpoint (will be appended to baseUrl)
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param {Object} body - Request body (will be JSON stringified)
     * @param {Object} customHeaders - Additional headers for this request
     * @returns {Promise<Object>} Parsed JSON response
     */
    async request(endpoint, method = 'GET', body = null, customHeaders = {}) {
        // Build full URL
        const url = this._buildUrl(endpoint);

        // Build request config
        let config = {
            method: method.toUpperCase(),
            headers: {
                ...this.defaultHeaders,
                ...customHeaders
            }
        };

        // Add body for non-GET requests
        if (body && method.toUpperCase() !== 'GET') {
            config.body = JSON.stringify(body);
        }

        // Apply request interceptors
        for (const interceptor of this.interceptors.request) {
            config = await interceptor(config) || config;
        }

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            config.signal = controller.signal;

            // Make the request
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Parse response
            let data;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // Build response object
            let result = {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data
            };

            // Apply response interceptors
            for (const interceptor of this.interceptors.response) {
                result = await interceptor(result) || result;
            }

            // Throw error for non-2xx responses
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                error.response = result;
                throw error;
            }

            return result;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            throw error;
        }
    }

    /**
     * GET request shorthand
     * @param {string} endpoint - API endpoint
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint, headers = {}) {
        return this.request(endpoint, 'GET', null, headers);
    }

    /**
     * POST request shorthand
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, body = {}, headers = {}) {
        return this.request(endpoint, 'POST', body, headers);
    }

    /**
     * PUT request shorthand
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async put(endpoint, body = {}, headers = {}) {
        return this.request(endpoint, 'PUT', body, headers);
    }

    /**
     * DELETE request shorthand
     * @param {string} endpoint - API endpoint
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async delete(endpoint, headers = {}) {
        return this.request(endpoint, 'DELETE', null, headers);
    }

    /**
     * PATCH request shorthand
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async patch(endpoint, body = {}, headers = {}) {
        return this.request(endpoint, 'PATCH', body, headers);
    }

    /**
     * Build full URL from endpoint
     * @private
     * @param {string} endpoint - API endpoint
     * @returns {string} Full URL
     */
    _buildUrl(endpoint) {
        // Handle absolute URLs
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return endpoint;
        }

        // Remove trailing slash from baseUrl and leading slash from endpoint
        const base = this.baseUrl.replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');

        return base ? `${base}/${path}` : path;
    }
}

// Create a singleton instance for global usage
export const prabogoClient = new PrabogoClient();

// Default export for convenience
export default PrabogoClient;
