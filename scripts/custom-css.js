hexo.extend.filter.register('after_render:html', function(str) {
  str = str.replace('</head>', '<link rel="stylesheet" href="/css/custom.css"></head>');
  // Remove "Powered by Hexo & Icarus" from footer
  str = str.replace(/\s*Powered by <a[^>]*>Hexo<\/a>\s*&amp;\s*<a[^>]*>Icarus<\/a>/g, '');
  str = str.replace('</body>', '<script src="/js/tag-toggle.js" defer></script></body>');
  return str;
});
