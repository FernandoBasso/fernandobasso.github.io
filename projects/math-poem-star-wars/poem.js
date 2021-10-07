(function () {
  /**
   * Shorter name for ‘querySelector()’.
   *
   * @param {string} selector A CSS-like selector.
   * @param {HTMLElement} [elem] A DOM Element.
   * @return {HTMLElement}
   */
  function qs(selector, elem) {
    elem = elem || document;

    return elem.querySelector(selector);
  }

  /**
   * Shorter name for ‘querySelectorAll()’.
   *
   * @param {string} selector A CSS-like selector.
   * @param {HTMLElement} [elem] A DOM Element.
   * @return {NodeList}
   */
  function qsa(selector, elem) {
    elem = elem || document;

    return elem.querySelectorAll(selector);
  }

  const poemWrp = document.querySelector('.poem-wrp');
  const crawl = qs('.crawl', poemWrp);
  const audio = qs('audio');

  const btnPlayPause = qs('.btn-play-pause', poemWrp);
  const btnRestart = qs('.btn-restart', poemWrp);

  btnPlayPause.addEventListener('click', function onPlayClicked () {
    const isRunning = crawl.classList.contains('running');

    if (isRunning) {
      crawl.classList.remove('running');
      crawl.classList.add('paused');
      audio.pause();
      btnPlayPause.textContent = 'Play';
    } else {
      crawl.classList.remove('paused');
      crawl.classList.add('running');
      audio.play();
      btnPlayPause.textContent = 'Pause';
    }
  }, false);

  btnRestart.addEventListener('click', function onRestartClicked () {
    crawl.classList.remove('crawl', 'paused', 'running');

    //
    // @HACK
    // If we remove and add the classes, the animation will not really
    // restart. Looks like it happens so fast that the browser thinks
    // the animation should not be removed and started all over again
    // from scratch. Adding a bit of interval between the removal and
    // re-addition of the classes seem to resolve the problem.
    //
    setTimeout(function onTimeout () {
      crawl.classList.add('crawl', 'running');
      audio.currentTime = 0;
      audio.play();
    }, 15);
  }, false);

  //
  // Count the number of lines. The number of lines is the number of
  // ‘<p>’ + the number of ‘<br>’.
  //
  const numPs = qsa('p', crawl).length
  const numBrs = qsa('p br').length;

  //
  // Let's make the duration take about 2.1 seconds per line.
  //
  const duration = (numPs + numBrs) * 2.1;

  // Set the default, initial seed.
  crawl.style.animationDuration = `${duration}s`;
}());

/* vim: set tw=72: */
