(function () {
  'use strict';

  var STORAGE_KEY = (document.body && document.body.getAttribute('data-storage-key')) || 'hat_het_ioc_simple_v2';

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var stageViewport = document.querySelector('.stage-viewport');
  var stageWrapper = document.querySelector('.stage-wrapper');

  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var slideCounter = document.getElementById('slide-counter');
  var progressFill = document.getElementById('progress-fill');
  var timingCue = document.getElementById('timing-cue');

  var btnTimer = document.getElementById('btn-timer');
  var btnNotes = document.getElementById('btn-notes');
  var btnGrid = document.getElementById('btn-grid');
  var btnEdit = document.getElementById('btn-edit');
  var btnResetEdits = document.getElementById('btn-reset-edits');
  var btnFullscreen = document.getElementById('btn-fullscreen');
  var btnPrint = document.getElementById('btn-print');

  var notesDrawer = document.getElementById('notes-drawer');
  var notesDrawerTitle = document.getElementById('notes-drawer-title');
  var notesDrawerBody = document.getElementById('notes-drawer-body');
  var btnCloseNotes = document.getElementById('btn-close-notes');

  var overviewModal = document.getElementById('overview-modal');
  var overviewGrid = document.getElementById('overview-grid');
  var btnCloseOverview = document.getElementById('btn-close-overview');

  var currentIndex = 0;
  var editMode = false;
  var timerSeconds = 0;
  var timerInterval = null;

  // Precompute cumulative and total slide durations dynamically
  var cumulativeTimes = [];
  var runningTotal = 0;
  slides.forEach(function (slide) {
    var sec = parseInt(slide.getAttribute('data-duration') || '0', 10);
    runningTotal += sec;
    cumulativeTimes.push(runningTotal);
  });
  var TOTAL_TARGET_SECONDS = runningTotal || 490;

  function formatMMSS(totalSec) {
    var mins = Math.floor(totalSec / 60);
    var secs = totalSec % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function formatMinSec(totalSec) {
    var mins = Math.floor(totalSec / 60);
    var secs = totalSec % 60;
    return mins + ':' + String(secs).padStart(2, '0');
  }

  function computeScale() {
    if (!stageViewport || !stageWrapper) return;
    var rect = stageViewport.getBoundingClientRect();
    var padW = 24;
    var padH = 16;
    var availW = Math.max(320, rect.width - padW);
    var availH = Math.max(200, rect.height - padH);
    var scale = Math.min(availW / 1280, availH / 720);
    stageWrapper.style.setProperty('--slide-scale', scale.toFixed(4));
  }

  function updateNotesDrawer() {
    var activeSlide = slides[currentIndex];
    if (!activeSlide) return;
    var notesEl = activeSlide.querySelector('aside.speaker-notes');
    var title = activeSlide.getAttribute('data-title') || ('Slide ' + (currentIndex + 1));
    var dur = parseInt(activeSlide.getAttribute('data-duration') || '0', 10);
    var cum = cumulativeTimes[currentIndex] || 0;

    if (notesDrawerTitle) {
      notesDrawerTitle.textContent =
        'Ce să spui — Slide ' + (currentIndex + 1) + ': ' + title +
        ' (' + formatMinSec(dur) + ' • Total până aici: ' + formatMinSec(cum) + ' / ' + formatMinSec(TOTAL_TARGET_SECONDS) + ')';
    }
    if (notesDrawerBody) {
      notesDrawerBody.innerHTML = notesEl ? notesEl.innerHTML : '<p>Nu sunt note pentru acest slide.</p>';
    }
  }

  function updateOverviewCurrent() {
    if (!overviewGrid) return;
    var cards = overviewGrid.querySelectorAll('.ov-card');
    cards.forEach(function (card, idx) {
      card.classList.toggle('current', idx === currentIndex);
    });
  }

  function showSlide(idx, updateHash) {
    if (slides.length === 0) return;
    var target = Math.max(0, Math.min(slides.length - 1, idx));
    currentIndex = target;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === currentIndex);
    });

    var num = currentIndex + 1;
    var total = slides.length;
    if (slideCounter) {
      slideCounter.textContent = num + ' / ' + total;
    }
    if (progressFill) {
      progressFill.style.width = ((num / total) * 100).toFixed(2) + '%';
    }

    var dur = parseInt(slides[currentIndex].getAttribute('data-duration') || '0', 10);
    var cum = cumulativeTimes[currentIndex] || 0;
    if (timingCue) {
      timingCue.textContent =
        'Țintă: ' + formatMinSec(dur) + ' • Total până aici: ' + formatMinSec(cum) + ' / ' + formatMinSec(TOTAL_TARGET_SECONDS);
    }

    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === total - 1;

    if (updateHash !== false) {
      try {
        history.replaceState(null, '', '#slide-' + num);
      } catch (e) {
        // Ignore on restricted file:// histories
      }
    }

    updateNotesDrawer();
    updateOverviewCurrent();
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      showSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      showSlide(currentIndex - 1);
    }
  }

  // Timer controls
  function renderTimer() {
    if (!btnTimer) return;
    var targetStr = formatMMSS(TOTAL_TARGET_SECONDS);
    btnTimer.textContent = '⏱ ' + formatMMSS(timerSeconds) + ' / ' + targetStr;
    btnTimer.classList.remove('running', 'warn', 'over');
    if (timerSeconds > TOTAL_TARGET_SECONDS) {
      btnTimer.classList.add('over');
    } else if (timerSeconds >= Math.max(0, TOTAL_TARGET_SECONDS - 60)) {
      btnTimer.classList.add('warn');
    } else if (timerInterval !== null) {
      btnTimer.classList.add('running');
    }
  }

  function toggleTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    } else {
      timerInterval = setInterval(function () {
        timerSeconds += 1;
        renderTimer();
      }, 1000);
    }
    renderTimer();
  }

  function resetTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerSeconds = 0;
    renderTimer();
  }

  // Speaker Notes drawer
  function toggleNotes(forceState) {
    if (!notesDrawer) return;
    var nextOpen = typeof forceState === 'boolean' ? forceState : !notesDrawer.classList.contains('open');
    notesDrawer.classList.toggle('open', nextOpen);
    if (btnNotes) btnNotes.classList.toggle('active', nextOpen);
    setTimeout(computeScale, 20);
  }

  // Overview grid
  function buildOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';
    slides.forEach(function (slide, idx) {
      var title = slide.getAttribute('data-title') || ('Slide ' + (idx + 1));
      var dur = parseInt(slide.getAttribute('data-duration') || '0', 10);
      var cum = cumulativeTimes[idx] || 0;

      var card = document.createElement('div');
      card.className = 'ov-card' + (idx === currentIndex ? ' current' : '');
      card.innerHTML =
        '<div class="ov-top"><span>Slide ' + (idx + 1) + '</span><span>' + formatMinSec(dur) + ' (Total ' + formatMinSec(cum) + ')</span></div>' +
        '<div class="ov-title">' + title + '</div>';
      card.addEventListener('click', function () {
        showSlide(idx);
        toggleOverview(false);
      });
      overviewGrid.appendChild(card);
    });
  }

  function toggleOverview(forceState) {
    if (!overviewModal) return;
    var nextOpen = typeof forceState === 'boolean' ? forceState : !overviewModal.classList.contains('open');
    overviewModal.classList.toggle('open', nextOpen);
    if (btnGrid) btnGrid.classList.toggle('active', nextOpen);
    if (nextOpen) updateOverviewCurrent();
  }

  // Inline Edit Mode + localStorage persistence
  var editableEls = Array.prototype.slice.call(document.querySelectorAll('[data-editable]'));
  var defaultEdits = {};
  editableEls.forEach(function (el) {
    var key = el.getAttribute('data-editable');
    if (key) defaultEdits[key] = el.innerHTML;
  });

  function loadSavedEdits() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      editableEls.forEach(function (el) {
        var key = el.getAttribute('data-editable');
        if (key && typeof saved[key] === 'string') {
          el.innerHTML = saved[key];
        }
      });
    } catch (e) {
      // Ignore storage errors
    }
  }

  function saveEdits() {
    try {
      var payload = {};
      editableEls.forEach(function (el) {
        var key = el.getAttribute('data-editable');
        if (key) payload[key] = el.innerHTML;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore storage errors
    }
  }

  function setEditMode(enabled) {
    editMode = enabled;
    document.body.classList.toggle('edit-mode', editMode);
    if (btnEdit) {
      btnEdit.classList.toggle('edit-active', editMode);
      btnEdit.textContent = editMode ? '✓ Salvează (E)' : '✏️ Editează (E)';
    }
    editableEls.forEach(function (el) {
      el.setAttribute('contenteditable', editMode ? 'true' : 'false');
    });
  }

  editableEls.forEach(function (el) {
    el.addEventListener('input', saveEdits);
    el.addEventListener('blur', saveEdits);
  });

  function resetEdits() {
    if (!window.confirm('Resetați textele editate la valorile inițiale?')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    editableEls.forEach(function (el) {
      var key = el.getAttribute('data-editable');
      if (key && typeof defaultEdits[key] === 'string') {
        el.innerHTML = defaultEdits[key];
      }
    });
  }

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(function () {});
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  }

  function getInitialSlideIndex() {
    var match = window.location.hash.match(/^#slide-(\d+)$/);
    if (match) {
      var n = parseInt(match[1], 10);
      if (n >= 1 && n <= slides.length) return n - 1;
    }
    return 0;
  }

  // Wire button events
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnTimer) {
    btnTimer.addEventListener('click', toggleTimer);
    btnTimer.addEventListener('dblclick', resetTimer);
  }
  if (btnNotes) btnNotes.addEventListener('click', function () { toggleNotes(); });
  if (btnCloseNotes) btnCloseNotes.addEventListener('click', function () { toggleNotes(false); });
  if (btnGrid) btnGrid.addEventListener('click', function () { toggleOverview(); });
  if (btnCloseOverview) btnCloseOverview.addEventListener('click', function () { toggleOverview(false); });
  if (btnEdit) btnEdit.addEventListener('click', function () { setEditMode(!editMode); });
  if (btnResetEdits) btnResetEdits.addEventListener('click', resetEdits);
  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
  if (btnPrint) btnPrint.addEventListener('click', function () { window.print(); });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    var active = document.activeElement;
    var isTyping = active && (active.isContentEditable || active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

    if (e.key === 'Escape') {
      if (overviewModal && overviewModal.classList.contains('open')) {
        toggleOverview(false);
        return;
      }
      if (isTyping && active.blur) {
        active.blur();
        return;
      }
    }

    if (isTyping) return;

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      showSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      showSlide(slides.length - 1);
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      toggleNotes();
    } else if (e.key === 'g' || e.key === 'G' || e.key === 'o' || e.key === 'O') {
      e.preventDefault();
      toggleOverview();
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      setEditMode(!editMode);
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTimer();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // Touch swipe support
  var touchStartX = null;
  document.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (touchStartX === null || !e.changedTouches || e.changedTouches.length === 0) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 55) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  window.addEventListener('resize', computeScale);
  window.addEventListener('hashchange', function () {
    showSlide(getInitialSlideIndex(), false);
  });

  // Initialize
  loadSavedEdits();
  buildOverview();
  showSlide(getInitialSlideIndex(), false);
  renderTimer();
  computeScale();
})();
