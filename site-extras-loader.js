(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'site-extras.css?v=community-news-v4';
  document.head.append(css);

  const extras = document.createElement('script');
  extras.src = 'site-extras.js?v=community-news-v4';
  extras.onload = () => {
    const newsModule = document.createElement('script');
    newsModule.type = 'module';
    newsModule.src = 'news-feed.js?v=community-news-v4';
    document.body.append(newsModule);
  };
  document.body.append(extras);
})();
