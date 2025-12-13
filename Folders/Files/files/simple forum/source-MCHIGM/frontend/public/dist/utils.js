export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
export function getRelativeTime(dateString) {
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
    }
    else if (diffDays === 1) {
        return '昨天';
    }
    else if (diffDays < 7) {
        return `${diffDays}天前`;
    }
    else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}周前`;
    }
    else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months}个月前`;
    }
    else {
        const years = Math.floor(diffDays / 365);
        return `${years}年前`;
    }
}
export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength - 3) + '...';
}
export function getStatusText(status) {
    const statusMap = {
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
export function getStatusClass(status) {
    const classMap = {
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
export function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
export const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            console.error('Failed to save to localStorage');
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function filterByKeyword(items, keyword, fields) {
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
                return value.some(v => typeof v === 'string' && v.toLowerCase().includes(lowerKeyword));
            }
            return false;
        });
    });
}
//# sourceMappingURL=utils.js.map