hexo.extend.filter.register('after_render:html', function(str) {
  str = str.replace('</head>', '<link rel="stylesheet" href="/css/custom.css"></head>');
  str = str.replace('</body>', '<script src="/js/tag-toggle.js" defer></script></body>');
  return str;
});
