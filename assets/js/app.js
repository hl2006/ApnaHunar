/**
 * app.js - Main Client Application Logic
 * Manages route guards, sidebar rendering, toast notification animations, dynamic overlays and modal popup boxes.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * Initialize application configurations, guards, and DOM events
 */
function initApp() {
  // 1. Authenticate check (Guard)
  routeGuard();

  // 2. Load theme settings
  loadThemePreference();

  // 3. Setup global loader spinner fade out
  hideLoader();

  // 4. Initialize sidebar toggle controls
  initSidebarToggle();

  // 5. Highlight active navigation links
  highlightActiveMenu();

  // 6. Setup general click listener for closing dropdowns/overlays
  setupGlobalClickHandlers();

  // 7. Load header details (User Avatar, Username) if on dashboard-based page
  loadHeaderUserInfo();
}

/**
 * Redirect anonymous sessions attempting to view dashboard subpages
 */
function routeGuard() {
  const currentPath = window.location.pathname.toLowerCase();
  
  // Public pages
  const isPublicPage = currentPath.endsWith('index.html') || 
                       currentPath.endsWith('login.html') || 
                       currentPath.endsWith('register.html') ||
                       currentPath === '/' ||
                       currentPath.endsWith('student%20skill%20tracker/') ||
                       currentPath.endsWith('studentskilltracker/') ||
                       currentPath.endsWith('apna%20hunar/') ||
                       currentPath.endsWith('apnahunar/');
                       
  const email = getCurrentUserEmail();
  
  if (!isPublicPage && !email) {
    window.location.href = 'login.html';
  } else if (isPublicPage && email && (currentPath.endsWith('login.html') || currentPath.endsWith('register.html'))) {
    // If logged in, don't allow accessing login/register. Redirect to dashboard
    window.location.href = 'dashboard.html';
  }
}

/**
 * Load dark/light theme preference from local user settings
 */
function loadThemePreference() {
  const user = getCurrentUser();
  let theme = 'light';
  
  if (user && user.settings && user.settings.theme) {
    theme = user.settings.theme;
  } else {
    // Check fallback general setting
    theme = localStorage.getItem('sst_theme') || 'light';
  }
  
  applyTheme(theme);
}

/**
 * Apply theme to document body
 * @param {string} theme ('light' or 'dark')
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  // Sync state of theme switch toggle button if it exists
  const toggles = document.querySelectorAll('.theme-switch-toggle-btn');
  toggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  });
}

/**
 * Fade out the page preloader overlay
 */
function hideLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 400); // Give a brief pleasant transition
  }
}

/**
 * Toggle side nav menu drawer visibility on mobile/tablet viewports
 */
function initSidebarToggle() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
}

/**
 * Select and match active navigation side/top link targets
 */
function highlightActiveMenu() {
  const currentPath = window.location.pathname.toLowerCase();
  
  // Sidebar items
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href').toLowerCase();
      if (currentPath.endsWith(href)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });
  
  // Landing topnav items
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      // Handle page anchors
      link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        // Hide mobile menu on anchor click
        const mobileMenu = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
    }
  });
}

/**
 * Render user profile summary on dashboard top-headers
 */
function loadHeaderUserInfo() {
  const user = getCurrentUser();
  if (!user) return;
  
  const headerName = document.querySelector('.header-profile-name');
  const headerRole = document.querySelector('.header-profile-role');
  const headerAvatar = document.querySelector('.header-profile-avatar');
  
  if (headerName) headerName.textContent = user.fullName;
  if (headerRole) headerRole.textContent = user.branch ? `${user.branch} | ${user.semester}` : 'Student';
  if (headerAvatar) headerAvatar.src = user.avatar;
}

/**
 * Global general click handlers
 */
function setupGlobalClickHandlers() {
  // Theme switcher trigger button clicks
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-switch-toggle-btn');
    if (themeBtn) {
      toggleTheme();
    }
  });
}

/**
 * Invert and save the current application theme preference
 */
function toggleTheme() {
  const user = getCurrentUser();
  const isDark = document.body.classList.contains('dark-theme');
  const newTheme = isDark ? 'light' : 'dark';
  
  if (user) {
    user.settings.theme = newTheme;
    saveCurrentUser(user);
    addActivity(`Switched app theme to ${newTheme}`);
  } else {
    localStorage.setItem('sst_theme', newTheme);
  }
  
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme} mode!`, 'info');
  
  // Custom event to allow components (like charts) to react to theme alterations
  const themeEvent = new CustomEvent('themechanged', { detail: { theme: newTheme } });
  document.dispatchEvent(themeEvent);
}

/**
 * Show a floating Toast alert notification
 * @param {string} message Text string to display
 * @param {string} [type=info] Severity level ('success'|'danger'|'warning'|'info')
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} glass-card`;
  
  // Icon selector
  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  if (type === 'danger') iconClass = 'fa-solid fa-circle-exclamation';
  if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
  
  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto-remove toast
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3500);
}

/**
 * Display a confirmation popup overlay before destructive actions
 * @param {string} title Popup heading
 * @param {string} message Warning description
 * @param {function} onConfirm Success callback routine
 */
function showConfirmModal(title, message, onConfirm) {
  // Remove existing confirm modal if any
  const existing = document.getElementById('confirm-modal-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'confirm-modal-overlay';
  overlay.className = 'modal-overlay active';
  
  overlay.innerHTML = `
    <div class="modal-container glass-card alert-popup-box">
      <div class="alert-popup-icon">
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>
      <h3 class="modal-title" style="margin-bottom:10px;">${title}</h3>
      <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.95rem;">${message}</p>
      <div class="alert-popup-buttons">
        <button class="btn btn-secondary btn-sm" id="confirm-btn-cancel">Cancel</button>
        <button class="btn btn-danger btn-sm" id="confirm-btn-yes">Yes, Delete</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Event handlers
  const cancelBtn = overlay.querySelector('#confirm-btn-cancel');
  const yesBtn = overlay.querySelector('#confirm-btn-yes');
  
  const closeModal = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  };
  
  cancelBtn.addEventListener('click', closeModal);
  yesBtn.addEventListener('click', () => {
    closeModal();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

/**
 * Modal visibility toggle handlers
 * @param {string} modalId 
 * @param {boolean} show 
 */
function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  if (show) {
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
  }
}
