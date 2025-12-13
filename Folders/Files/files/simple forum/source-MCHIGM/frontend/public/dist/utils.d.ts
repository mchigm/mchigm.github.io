export declare function formatDate(dateString: string): string;
export declare function formatDateTime(dateString: string): string;
export declare function getRelativeTime(dateString: string): string;
export declare function truncateText(text: string, maxLength: number): string;
export declare function getStatusText(status: string): string;
export declare function getStatusClass(status: string): string;
export declare function generateId(): string;
export declare function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number): (...args: Parameters<T>) => void;
export declare const storage: {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
};
export declare function isValidEmail(email: string): boolean;
export declare function filterByKeyword<T extends object>(items: T[], keyword: string, fields: (keyof T)[]): T[];
//# sourceMappingURL=utils.d.ts.map