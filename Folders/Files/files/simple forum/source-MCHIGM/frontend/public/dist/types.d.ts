export interface User {
    id: string;
    username: string;
    email: string;
    type: 'organization' | 'startup' | 'community' | 'individual';
    verified: boolean;
    profile: UserProfile;
    stats: UserStats;
    created_at: string;
}
export interface UserProfile {
    description: string;
    location: string;
    website: string | null;
}
export interface UserStats {
    demands_posted: number;
    resources_provided: number;
    collaborations: number;
}
export interface Demand {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    status: DemandStatus;
    creator: UserReference;
    deadline: string;
    created_at: string;
    updated_at: string;
}
export type DemandStatus = 'open' | 'in_progress' | 'completed' | 'closed';
export interface Resource {
    id: string;
    title: string;
    description: string;
    type: string;
    quantity: number;
    tags: string[];
    status: ResourceStatus;
    provider: UserReference;
    location: string;
    created_at: string;
    updated_at: string;
}
export type ResourceStatus = 'available' | 'reserved' | 'unavailable';
export interface UserReference {
    user_id: string;
    username: string;
}
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
export interface PaginatedResponse<T> {
    total: number;
    page: number;
    limit: number;
    items: T[];
}
export interface ProgressLog {
    log_id: string;
    demand_id: string;
    title: string;
    content: string;
    status: string;
    created_at: string;
}
export interface Group {
    id: string;
    name: string;
    description: string;
    members: UserReference[];
    created_at: string;
}
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    content: string;
    type: NotificationType;
    read: boolean;
    created_at: string;
}
export type NotificationType = 'system' | 'demand' | 'resource' | 'group' | 'message';
//# sourceMappingURL=types.d.ts.map