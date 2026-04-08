document.addEventListener('DOMContentLoaded', function () {
  var tagWidget = document.querySelector('.card[data-type="tags"]');
  if (!tagWidget) return;

  var cardContent = tagWidget.querySelector('.card-content');
  var tagGroup = tagWidget.querySelector('.is-grouped-multiline');
  if (!tagGroup) return;

  var btn = document.createElement('button');
  btn.className = 'tag-toggle-btn';
  btn.textContent = '\ubaa8\ub4e0 \ud0dc\uadf8 \ubcf4\uae30 \u25bc';
  cardContent.appendChild(btn);

  btn.addEventListener('click', function () {
    var expanded = tagGroup.classList.toggle('is-expanded');
    cardContent.classList.toggle('is-expanded');
    btn.textContent = expanded ? '\uc811\uae30 \u25b2' : '\ubaa8\ub4e0 \ud0dc\uadf8 \ubcf4\uae30 \u25bc';
  });
});
