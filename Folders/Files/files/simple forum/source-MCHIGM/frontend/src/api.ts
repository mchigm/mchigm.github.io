/**
 * API client for the MCHIGM platform
 */

import type { 
    ApiResponse, 
    PaginatedResponse, 
    Demand, 
    Resource, 
    User,
    ProgressLog,
    Group,
    Notification
} from './types';

// API configuration
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Base API client class
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Make HTTP request
     */
    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            // Check for HTTP error status codes
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(
                    errorData.message || `HTTP Error: ${response.status} ${response.statusText}`
                );
                console.error('API request failed:', error);
                throw error;
            }
            
            const data = await response.json();
            return data as ApiResponse<T>;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Create API client instance
const api = new ApiClient();

/**
 * Demand API functions
 */
export const demandApi = {
    /**
     * Get all demands
     */
    async list(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Demand>>> {
        return api.get<PaginatedResponse<Demand>>(`/demands?page=${page}&limit=${limit}`);
    },

    /**
     * Get demand by ID
     */
    async get(id: string): Promise<ApiResponse<Demand>> {
        return api.get<Demand>(`/demands/${id}`);
    },

    /**
     * Create new demand
     */
    async create(demand: Partial<Demand>): Promise<ApiResponse<Demand>> {
        return api.post<Demand>('/demands', demand);
    },

    /**
     * Update demand
     */
    async update(id: string, demand: Partial<Demand>): Promise<ApiResponse<Demand>> {
        return api.put<Demand>(`/demands/${id}`, demand);
    },

    /**
     * Delete demand
     */
    async delete(id: string): Promise<ApiResponse<null>> {
        return api.delete<null>(`/demands/${id}`);
    },
};

/**
 * Resource API functions
 */
export const resourceApi = {
    /**
     * Get all resources
     */
    async list(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Resource>>> {
        return api.get<PaginatedResponse<Resource>>(`/resources?page=${page}&limit=${limit}`);
    },

    /**
     * Get resource by ID
     */
    async get(id: string): Promise<ApiResponse<Resource>> {
        return api.get<Resource>(`/resources/${id}`);
    },

    /**
     * Create new resource
     */
    async create(resource: Partial<Resource>): Promise<ApiResponse<Resource>> {
        return api.post<Resource>('/resources', resource);
    },

    /**
     * Update resource
     */
    async update(id: string, resource: Partial<Resource>): Promise<ApiResponse<Resource>> {
        return api.put<Resource>(`/resources/${id}`, resource);
    },

    /**
     * Delete resource
     */
    async delete(id: string): Promise<ApiResponse<null>> {
        return api.delete<null>(`/resources/${id}`);
    },
};

/**
 * User API functions
 */
export const userApi = {
    /**
     * Get user profile
     */
    async getProfile(id: string): Promise<ApiResponse<User>> {
        return api.get<User>(`/users/${id}`);
    },

    /**
     * Update user profile
     */
    async updateProfile(id: string, profile: Partial<User>): Promise<ApiResponse<User>> {
        return api.put<User>(`/users/${id}`, profile);
    },
};

/**
 * Progress API functions
 */
export const progressApi = {
    /**
     * Get progress logs for a demand
     */
    async list(demandId: string): Promise<ApiResponse<ProgressLog[]>> {
        return api.get<ProgressLog[]>(`/progress/${demandId}`);
    },

    /**
     * Create progress log
     */
    async create(log: Partial<ProgressLog>): Promise<ApiResponse<ProgressLog>> {
        return api.post<ProgressLog>('/progress', log);
    },
};

/**
 * Group API functions
 */
export const groupApi = {
    /**
     * Get all groups
     */
    async list(): Promise<ApiResponse<Group[]>> {
        return api.get<Group[]>('/groups');
    },

    /**
     * Create group
     */
    async create(group: Partial<Group>): Promise<ApiResponse<Group>> {
        return api.post<Group>('/groups', group);
    },
};

/**
 * Notification API functions
 */
export const notificationApi = {
    /**
     * Get notifications
     */
    async list(): Promise<ApiResponse<Notification[]>> {
        return api.get<Notification[]>('/notifications');
    },

    /**
     * Mark notification as read
     */
    async markRead(id: string): Promise<ApiResponse<null>> {
        return api.put<null>(`/notifications/${id}/read`, {});
    },
};

export { api, ApiClient };
