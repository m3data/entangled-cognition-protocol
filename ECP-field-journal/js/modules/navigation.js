// js/modules/navigation.js
/**
 * Standardized navigation component loader
 * Ensures consistent navigation across all pages
 */

export async function loadNavigation(targetElement = 'nav-container') {
  const container = document.getElementById(targetElement);
  if (!container) {
    console.warn(`Navigation container #${targetElement} not found`);
    return;
  }

  try {
    const response = await fetch('/components/navigation.html');
    if (response.ok) {
      const html = await response.text();
      container.innerHTML = html;

      // Set active state based on current page
      setActivePage();
    }
  } catch (error) {
    console.error('Failed to load navigation:', error);
  }
}

function setActivePage() {
  const currentPage = window.location.pathname.split('/').pop();

  // Map pages to nav items
  const pageMap = {
    'home.html': 'home',
    '': 'home', // root
    'experiment-entry.html': 'new-entry',
    'reflection-entry.html': 'new-entry',
    'journal-archive.html': 'archive',
    'measurement-dashboard.html': 'insights',
    'about.html': 'resources',
    'onboarding.html': 'resources',
    'workflow-templates.html': 'resources',
    'community-dashboard.html': 'resources'
  };

  const activePage = pageMap[currentPage];
  if (activePage) {
    const activeLink = document.querySelector(`[data-page="${activePage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Auto-load navigation if nav-container exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('nav-container')) {
      loadNavigation();
    }
  });
} else {
  if (document.getElementById('nav-container')) {
    loadNavigation();
  }
}
