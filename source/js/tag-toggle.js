(function() {
  function initTagToggle() {
    // Clean up previous state
    document.body.classList.remove('is-tags-page');
    var oldBtn = document.querySelector('.tag-toggle-btn');
    if (oldBtn) oldBtn.remove();

    var tagWidget = document.querySelector('.card[data-type="tags"]');
    if (!tagWidget) return;

    var cardContent = tagWidget.querySelector('.card-content');
    var tagGroup = tagWidget.querySelector('.is-grouped-multiline');
    if (!tagGroup) return;

    // Reset expanded state
    tagGroup.classList.remove('is-expanded');
    cardContent.classList.remove('is-expanded');

    // On /tags/ page: expand everything, no button
    if (window.location.pathname.indexOf('/tags') === 0) {
      document.body.classList.add('is-tags-page');
      return;
    }

    var btn = document.createElement('button');
    btn.className = 'tag-toggle-btn';
    btn.textContent = '\ubaa8\ub4e0 \ud0dc\uadf8 \ubcf4\uae30 \u25bc';
    cardContent.appendChild(btn);

    btn.addEventListener('click', function() {
      var expanded = tagGroup.classList.toggle('is-expanded');
      cardContent.classList.toggle('is-expanded');
      btn.textContent = expanded ? '\uc811\uae30 \u25b2' : '\ubaa8\ub4e0 \ud0dc\uadf8 \ubcf4\uae30 \u25bc';
    });
  }

  // Initial load
  document.addEventListener('DOMContentLoaded', initTagToggle);

  // PJAX navigation
  document.addEventListener('pjax:complete', initTagToggle);
  document.addEventListener('pjax:end', initTagToggle);
})();
