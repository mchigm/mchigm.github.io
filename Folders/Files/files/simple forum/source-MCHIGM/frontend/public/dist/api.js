const API_BASE_URL = 'http://localhost:8000/api';
class ApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || `HTTP Error: ${response.status} ${response.statusText}`);
                console.error('API request failed:', error);
                throw error;
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}
const api = new ApiClient();
export const demandApi = {
    async list(page = 1, limit = 20) {
        return api.get(`/demands?page=${page}&limit=${limit}`);
    },
    async get(id) {
        return api.get(`/demands/${id}`);
    },
    async create(demand) {
        return api.post('/demands', demand);
    },
    async update(id, demand) {
        return api.put(`/demands/${id}`, demand);
    },
    async delete(id) {
        return api.delete(`/demands/${id}`);
    },
};
export const resourceApi = {
    async list(page = 1, limit = 20) {
        return api.get(`/resources?page=${page}&limit=${limit}`);
    },
    async get(id) {
        return api.get(`/resources/${id}`);
    },
    async create(resource) {
        return api.post('/resources', resource);
    },
    async update(id, resource) {
        return api.put(`/resources/${id}`, resource);
    },
    async delete(id) {
        return api.delete(`/resources/${id}`);
    },
};
export const userApi = {
    async getProfile(id) {
        return api.get(`/users/${id}`);
    },
    async updateProfile(id, profile) {
        return api.put(`/users/${id}`, profile);
    },
};
export const progressApi = {
    async list(demandId) {
        return api.get(`/progress/${demandId}`);
    },
    async create(log) {
        return api.post('/progress', log);
    },
};
export const groupApi = {
    async list() {
        return api.get('/groups');
    },
    async create(group) {
        return api.post('/groups', group);
    },
};
export const notificationApi = {
    async list() {
        return api.get('/notifications');
    },
    async markRead(id) {
        return api.put(`/notifications/${id}/read`, {});
    },
};
export { api, ApiClient };
//# sourceMappingURL=api.js.map