/**
 * Pop-up Page Management TypeScript Module
 * Handles the dynamic loading and display of pop-up pages
 */
class PopupManager {
    constructor(pages, listElementId = 'popup-links', noPopupsElementId = 'no-popups') {
        this.popupPages = pages;
        this.listElementId = listElementId;
        this.noPopupsElementId = noPopupsElementId;
    }
    /**
     * Sort popup pages by date (newest first)
     */
    sortByDate() {
        this.popupPages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    /**
     * Render the popup list to the DOM
     */
    renderPopupList() {
        const listElement = document.getElementById(this.listElementId);
        const noPopupsElement = document.getElementById(this.noPopupsElementId);
        if (!listElement || !noPopupsElement) {
            console.error('Required DOM elements not found');
            return;
        }
        if (this.popupPages.length === 0) {
            noPopupsElement.style.display = 'block';
            return;
        }
        this.sortByDate();
        listElement.innerHTML = this.popupPages.map(page => {
            const viewerUrl = `popup-viewer.html?file=${encodeURIComponent(page.file)}`;
            return `
                <li>
                    <a href="${viewerUrl}" target="_blank">${this.escapeHtml(page.title)}</a>
                    <span class="popup-date">(${this.escapeHtml(page.date)})</span>
                </li>
            `;
        }).join('');
    }
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    /**
     * Add a new popup page
     */
    addPopup(page) {
        this.popupPages.push(page);
        this.renderPopupList();
    }
    /**
     * Get all popup pages
     */
    getPopups() {
        return [...this.popupPages];
    }
}
// Make available globally for browser use
window.PopupManager = PopupManager;
