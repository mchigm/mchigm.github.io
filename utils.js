/**
 * Utility functions TypeScript Module
 * Provides common utilities for the website
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ClipboardUtils {
    /**
     * Copy text to clipboard
     * @param text The text to copy
     * @returns Promise that resolves when copy is successful
     */
    static copyToClipboard(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield navigator.clipboard.writeText(text);
                console.log('Copied to clipboard:', text);
            }
            catch (err) {
                console.error('Failed to copy text:', err);
                // Fallback for older browsers
                this.fallbackCopyToClipboard(text);
            }
        });
    }
    /**
     * Fallback method for copying text (for older browsers)
     * @param text The text to copy
     */
    static fallbackCopyToClipboard(text) {
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
        }
        catch (err) {
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
    static copyPhoneNumber() {
        ClipboardUtils.copyToClipboard("0085269981753");
    }
    /**
     * Copy primary email to clipboard
     */
    static copyEmailA() {
        ClipboardUtils.copyToClipboard("yuemingdd@gmail.com");
    }
    /**
     * Copy secondary email to clipboard
     */
    static copyEmailB() {
        ClipboardUtils.copyToClipboard("201806006@stu.pkc.edu.hk");
    }
}
// Make utilities available globally for browser use
window.ClipboardUtils = ClipboardUtils;
window.ContactUtils = ContactUtils;
// Legacy function names for backward compatibility
window.copyDel = ContactUtils.copyPhoneNumber;
window.copyEmaila = ContactUtils.copyEmailA;
window.copyEmailb = ContactUtils.copyEmailB;
