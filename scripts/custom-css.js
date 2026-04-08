hexo.extend.filter.register('after_render:html', function(str) {
  str = str.replace('</head>', '<link rel="stylesheet" href="/css/custom.css"></head>');

  // Rebuild footer: replace the entire footer content
  var footerNew = '<footer class="footer"><div class="container"><div class="level">'
    + '<div class="level-start">'
    + '<a class="footer-logo is-block" href="/"><img src="/img/logo.svg" alt="카미유 테크 블로그" height="28"></a>'
    + '<p class="is-size-7" style="margin:0.25rem 0 0">&copy; 2021 KAMIYU</p>'
    + '<p class="is-size-7" style="margin:0"><span id="busuanzi_container_site_uv"><span id="busuanzi_value_site_uv">0</span>명의 사용자가 방문 함</span></p>'
    + '</div>'
    + '<div class="level-end"><div class="field has-addons">'
    + '<p class="control"><a class="button is-transparent is-large" target="_blank" rel="noopener" title="Creative Commons" href="https://creativecommons.org/"><i class="fab fa-creative-commons"></i></a></p>'
    + '<p class="control"><a class="button is-transparent is-large" target="_blank" rel="noopener" title="Attribution 4.0 International" href="https://creativecommons.org/licenses/by/4.0/"><i class="fab fa-creative-commons-by"></i></a></p>'
    + '<p class="control"><a class="button is-transparent is-large" target="_blank" rel="noopener" title="Download on GitHub" href="https://github.com/june0122"><i class="fab fa-github"></i></a></p>'
    + '</div></div>'
    + '</div></div></footer>';
  str = str.replace(/<footer class="footer">[\s\S]*?<\/footer>/, footerNew);

  str = str.replace('</body>', '<script src="/js/tag-toggle.js" defer></script></body>');
  return str;
});
