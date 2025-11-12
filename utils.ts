/**
 * Utility functions TypeScript Module
 * Provides common utilities for the website
 */

class ClipboardUtils {
    /**
     * Copy text to clipboard
     * @param text The text to copy
     * @returns Promise that resolves when copy is successful
     */
    public static async copyToClipboard(text: string): Promise<void> {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard:', text);
        } catch (err) {
            console.error('Failed to copy text:', err);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(text);
        }
    }

    /**
     * Fallback method for copying text (for older browsers)
     * @param text The text to copy
     */
    private static fallbackCopyToClipboard(text: string): void {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log('Fallback: Copied to clipboard');
        } catch (err) {
            console.error('Fallback: Failed to copy', err);
        }
        
        document.body.removeChild(textArea);
    }
}

/**
 * Contact information utilities
 */
class ContactUtils {
    /**
     * Copy phone number to clipboard
     */
    public static copyPhoneNumber(): void {
        ClipboardUtils.copyToClipboard("0085269981753");
    }

    /**
     * Copy primary email to clipboard
     */
    public static copyEmailA(): void {
        ClipboardUtils.copyToClipboard("yuemingdd@gmail.com");
    }

    /**
     * Copy secondary email to clipboard
     */
    public static copyEmailB(): void {
        ClipboardUtils.copyToClipboard("201806006@stu.pkc.edu.hk");
    }
}

// Make utilities available globally for browser use
(window as any).ClipboardUtils = ClipboardUtils;
(window as any).ContactUtils = ContactUtils;

// Legacy function names for backward compatibility
(window as any).copyDel = ContactUtils.copyPhoneNumber;
(window as any).copyEmaila = ContactUtils.copyEmailA;
(window as any).copyEmailb = ContactUtils.copyEmailB;
