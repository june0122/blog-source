hexo.extend.filter.register('after_render:html', function(str) {
  return str.replace('</head>', '<link rel="stylesheet" href="/css/custom.css"></head>');
});
