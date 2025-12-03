/**
 * Utility functions for the MCHIGM platform
 */

/**
 * Format date to localized string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format datetime to localized string
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calculate relative time (e.g., "3天前")
 */
export function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return diffMinutes <= 1 ? '刚刚' : `${diffMinutes}分钟前`;
        }
        return `${diffHours}小时前`;
    } else if (diffDays === 1) {
        return '昨天';
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}周前`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months}个月前`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years}年前`;
    }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get status display text
 */
export function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        'open': '开放中',
        'in_progress': '进行中',
        'completed': '已完成',
        'closed': '已关闭',
        'available': '可用',
        'reserved': '已预约',
        'unavailable': '不可用'
    };
    return statusMap[status] || status;
}

/**
 * Get status CSS class
 */
export function getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
        'open': 'status-open',
        'in_progress': 'status-progress',
        'completed': 'status-completed',
        'closed': 'status-closed',
        'available': 'status-available',
        'reserved': 'status-reserved',
        'unavailable': 'status-unavailable'
    };
    return classMap[status] || 'status-default';
}

/**
 * Generate unique ID
 * Note: Uses crypto.randomUUID for secure ID generation
 */
export function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Storage helper functions
 */
export const storage = {
    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            console.error('Failed to save to localStorage');
        }
    },

    remove(key: string): void {
        localStorage.removeItem(key);
    }
};

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Filter and search helper
 */
export function filterByKeyword<T extends object>(
    items: T[],
    keyword: string,
    fields: (keyof T)[]
): T[] {
    if (!keyword.trim()) {
        return items;
    }
    
    const lowerKeyword = keyword.toLowerCase();
    return items.filter(item => {
        return fields.some(field => {
            const value = item[field];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(lowerKeyword);
            }
            if (Array.isArray(value)) {
                return value.some(v => 
                    typeof v === 'string' && v.toLowerCase().includes(lowerKeyword)
                );
            }
            return false;
        });
    });
}
