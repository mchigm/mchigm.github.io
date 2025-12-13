import type { ApiResponse, PaginatedResponse, Demand, Resource, User, ProgressLog, Group, Notification } from './types';
declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    private request;
    get<T>(endpoint: string): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>>;
    put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>>;
    delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}
declare const api: ApiClient;
export declare const demandApi: {
    list(page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Demand>>>;
    get(id: string): Promise<ApiResponse<Demand>>;
    create(demand: Partial<Demand>): Promise<ApiResponse<Demand>>;
    update(id: string, demand: Partial<Demand>): Promise<ApiResponse<Demand>>;
    delete(id: string): Promise<ApiResponse<null>>;
};
export declare const resourceApi: {
    list(page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Resource>>>;
    get(id: string): Promise<ApiResponse<Resource>>;
    create(resource: Partial<Resource>): Promise<ApiResponse<Resource>>;
    update(id: string, resource: Partial<Resource>): Promise<ApiResponse<Resource>>;
    delete(id: string): Promise<ApiResponse<null>>;
};
export declare const userApi: {
    getProfile(id: string): Promise<ApiResponse<User>>;
    updateProfile(id: string, profile: Partial<User>): Promise<ApiResponse<User>>;
};
export declare const progressApi: {
    list(demandId: string): Promise<ApiResponse<ProgressLog[]>>;
    create(log: Partial<ProgressLog>): Promise<ApiResponse<ProgressLog>>;
};
export declare const groupApi: {
    list(): Promise<ApiResponse<Group[]>>;
    create(group: Partial<Group>): Promise<ApiResponse<Group>>;
};
export declare const notificationApi: {
    list(): Promise<ApiResponse<Notification[]>>;
    markRead(id: string): Promise<ApiResponse<null>>;
};
export { api, ApiClient };
//# sourceMappingURL=api.d.ts.map