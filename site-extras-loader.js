(() => {
  const extrasStyle = document.createElement('link');
  extrasStyle.rel = 'stylesheet';
  extrasStyle.href = 'site-extras.css?v=community-news-v2';
  document.head.append(extrasStyle);
  const extrasScript = document.createElement('script');
  extrasScript.src = 'site-extras.js?v=community-news-v2';
  extrasScript.defer = true;
  document.body.append(extrasScript);

  const newsModule = document.createElement('script');
  newsModule.type = 'module';
  newsModule.src = 'news-feed.js';
  document.body.append(newsModule);
})();
