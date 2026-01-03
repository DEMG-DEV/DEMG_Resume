
// Window Management System
class DesktopManager {
    zIndex = 100;

    constructor() {
        this.setupDraggables();
    }

    bringToFront(id) {
        const el = document.getElementById(id);
        if (el) {
            this.zIndex++;
            el.style.zIndex = this.zIndex.toString();
        }
    }

    toggleWindow(id) {
        const el = document.getElementById(id);
        if (!el) return;

        const isOpen = el.classList.contains('opacity-100');
        if (isOpen) {
            this.closeWindow(id);
        } else {
            this.openWindow(id);
        }
    }

    openWindow(id) {
        const el = document.getElementById(id);
        if (!el) return;

        // Dynamic Centering Logic
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const width = el.offsetWidth;
        const height = el.offsetHeight;

        // Calculate center position
        const top = Math.max(0, (viewportHeight - height) / 2); // Prevent negative top
        const left = Math.max(0, (viewportWidth - width) / 2);   // Prevent negative left

        // Apply centering
        el.style.top = `${top}px`;
        el.style.left = `${left}px`;

        el.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        el.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
        this.bringToFront(id);
    }

    closeWindow(id) {
        const el = document.getElementById(id);
        if (!el) return;

        el.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        el.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    }

    maximizeWindow(id) {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.style.width === '100%') {
            // Restore
            el.style.width = el.dataset.prevWidth || '800px';
            el.style.height = el.dataset.prevHeight || '600px';
            el.style.top = el.dataset.prevTop || '100px';
            el.style.left = el.dataset.prevLeft || '100px';
        } else {
            // Maximize
            el.dataset.prevWidth = el.style.width;
            el.dataset.prevHeight = el.style.height;
            el.dataset.prevTop = el.style.top;
            el.dataset.prevLeft = el.style.left;

            el.style.width = '100%';
            el.style.height = 'calc(100% - 32px)'; // Minus MenuBar
            el.style.top = '32px';
            el.style.left = '0';
        }
    }

    setupDraggables() {
        document.querySelectorAll('.desktop-window').forEach(win => {
            const header = win.querySelector('.window-header');
            if (!header) return;

            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            header.addEventListener('mousedown', (e) => {
                // Ignore if clicking traffic lights
                if (e.target.closest('button')) return;

                isDragging = true;
                this.bringToFront(win.id);

                startX = e.clientX;
                startY = e.clientY;
                initialLeft = win.offsetLeft;
                initialTop = win.offsetTop;

                header.style.cursor = 'grabbing';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                win.style.left = `${initialLeft + dx}px`;
                win.style.top = `${initialTop + dy}px`;
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
                header.style.cursor = 'default';
            });
        });
    }
}

// Initialize
window.desktop = new DesktopManager();
