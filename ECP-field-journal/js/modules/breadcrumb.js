// js/modules/breadcrumb.js
/**
 * Minimal breadcrumb navigation loader for focused task pages
 */

export async function loadBreadcrumb(targetElement = 'nav-container') {
  const container = document.getElementById(targetElement);
  if (!container) {
    console.warn(`Breadcrumb container #${targetElement} not found`);
    return;
  }

  try {
    const response = await fetch('/components/breadcrumb-nav.html');
    if (response.ok) {
      const html = await response.text();
      container.innerHTML = html;
    }
  } catch (error) {
    console.error('Failed to load breadcrumb:', error);
  }
}

// Auto-load breadcrumb if nav-container exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('nav-container')) {
      loadBreadcrumb();
    }
  });
} else {
  if (document.getElementById('nav-container')) {
    loadBreadcrumb();
  }
}
