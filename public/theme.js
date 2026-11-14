(function () {
  'use strict';

  var STORAGE_KEY = 'radarlens-theme';

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    var validTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', validTheme);
    updateToggleButtons(validTheme);
  }

  function updateToggleButtons(theme) {
    var buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(function (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        isDark ? 'Switch to bright (light) theme' : 'Switch to dark theme'
      );
      btn.setAttribute(
        'title',
        isDark ? 'Switch to bright (light) theme' : 'Switch to dark theme'
      );

      var textEl = btn.querySelector('.theme-text');
      if (textEl) {
        textEl.textContent = isDark ? 'Dark' : 'Bright';
      }
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    applyTheme(next);
  }

  // Initialize as soon as DOM is ready
  function init() {
    var saved = getSavedTheme();
    var initialTheme = saved || getSystemTheme();
    applyTheme(initialTheme);

    // Attach click listener to any toggle button on the page
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.theme-toggle');
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Listen to system preference changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!getSavedTheme()) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Synchronize across open tabs
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY && e.newValue) {
        applyTheme(e.newValue);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

