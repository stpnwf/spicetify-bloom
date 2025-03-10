// credits for the folder images code: harbassan
(function bloom() {
  function waitForElement(els, func, timeout = 100) {
    const queries = els.map((el) => document.querySelector(el));
    if (queries.every((a) => a)) {
      func();
    } else if (timeout > 0) {
      setTimeout(waitForElement, 300, els, func, timeout - 1);
    }
  }

  function updatePlaylistsImages() {
    waitForElement(['.main-rootlist-rootlistItem'], () => {
      const mainRootlistWrapper = document.getElementsByClassName('main-rootlist-wrapper')[0];
      mainRootlistWrapper.style.height = `${mainRootlistWrapper.offsetHeight * 2}px`;
      const cache = new Map();

      async function fetchPlaylistData(url) {
        const response = await Spicetify.CosmosAsync.get(url);
        const { items, next } = response;
        return [...items, ...(next ? await fetchPlaylistData(next) : [])];
      }

      async function addPlaylistIcons() {
        while (!Spicetify || !Spicetify.Platform || !Spicetify.CosmosAsync) {
          // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        async function updatePlaylistList(playlistData) {
          const playlistElements = await new Promise((resolve) => {
            const interval = setInterval(() => {
              const elements = document.querySelectorAll('#spicetify-playlist-list li a');
              if (elements.length > 0) {
                clearInterval(interval);
                resolve(Array.from(elements));
              }
            }, 100);
          });

          for (let i = 0; i < playlistElements.length; i += 1) {
            const [id] = playlistElements[i].href.split('/').slice(-1);
            const [type] = playlistElements[i].href.split('/').slice(-2, -1);
            let icon = cache.get(id);
            if (!icon) {
              switch (type) {
                case 'playlist': {
                  const playlist = playlistData.find((p) => p.id === id);
                  const image = playlist ? playlist.images[0] || {} : {};
                  icon = {
                    src:
                      image.url ||
                      'https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_music_note_2_24_filled.svg',
                    size: 'cover',
                  };
                  if (!image.url) {
                    icon.size = '45px';
                  }
                  cache.set(id, icon);
                  break;
                }

                case 'folder':
                  const base64 = localStorage.getItem('bloom:folder-image:' + id);
                  icon = {
                    src:
                      base64 ||
                      'https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_folder_24_filled.svg',
                    size: 'cover',
                  };
                  if (!base64) {
                    icon.size = '45px';
                  }
                  cache.set(id, icon);
                  break;

                default:
                  break;
              }
            }

            if (icon.src) {
              playlistElements[i].style.backgroundImage = `url('${icon.src}')`;
              playlistElements[i].style.backgroundRepeat = 'no-repeat';
              playlistElements[i].style.backgroundSize = `${icon.size}`;
              playlistElements[i].style.backgroundPosition = 'center';
            }
          }
        }

        const playlistList = await new Promise((resolve) => {
          const interval = setInterval(() => {
            const element = document.getElementById('spicetify-playlist-list');
            if (element) {
              clearInterval(interval);
              resolve(element);
            }
          }, 100);
        });

        const playlistData = await fetchPlaylistData(
          'https://api.spotify.com/v1/me/playlists?limit=50'
        );
        const observer = new MutationObserver(async () => {
          observer.disconnect();
          await updatePlaylistList(playlistData);
          observer.observe(playlistList, { childList: true, subtree: true });
        });
        await updatePlaylistList(playlistData);
        observer.observe(playlistList, { childList: true, subtree: true });
      }

      addPlaylistIcons();
    });
  }
  updatePlaylistsImages();

  waitForElement(['.main-navBar-navBarLink'], () => {
    const navBarItems = document.getElementsByClassName('main-navBar-navBarLink');
    for (let i = 0; i < navBarItems.length; i += 1) {
      const div = document.createElement('div');
      div.classList.add('navBar-navBarLink-accent');
      navBarItems[i].appendChild(div);
    }
  });

  waitForElement(['.main-yourLibraryX-navItem'], () => {
    const navItemsLibraryX = document.getElementsByClassName('main-yourLibraryX-navLink');
    for (let i = 0; i < navItemsLibraryX.length; i += 1) {
      const div = document.createElement('div');
      div.classList.add('main-yourLibraryX-navLink-accent');
      navItemsLibraryX[i].appendChild(div);
    }
  });

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--spice-text');
  if (textColor === ' #000000') {
    document.documentElement.style.setProperty('--filter-brightness', 0);
  }

  const interval = setInterval(() => {
    if (
      typeof Spicetify.Platform === 'undefined' ||
      (typeof Spicetify.Platform.Translations.play === 'undefined' &&
        typeof Spicetify.Platform.Translations.pause === 'undefined')
    )
      return;
    clearInterval(interval);
    const playButtonStyle = document.createElement('style');

    function cleanLabel(label) {
      const cleanedLabel = label.replace(/[{0}{1}«»”“]/g, '').trim();
      return cleanedLabel;
    }

    let playlistPlayLabel = Spicetify.Platform.Translations['playlist.a11y.play'];
    playlistPlayLabel = cleanLabel(playlistPlayLabel);
    let playlistPauseLabel = Spicetify.Platform.Translations['playlist.a11y.pause'];
    playlistPauseLabel = cleanLabel(playlistPauseLabel);

    const tracklistPlayLabel = Spicetify.Platform.Translations['tracklist.a11y.play'];
    let tracklistPlayLabelOne;
    let tracklistPlayLabelTwo;
    // eslint-disable-next-line no-underscore-dangle
    if (['zh-CN', 'zh-TW', 'am', 'fi'].includes(Spicetify.Locale._locale)) {
      [tracklistPlayLabelOne, tracklistPlayLabelTwo] = tracklistPlayLabel.split('{1}');
    } else {
      [tracklistPlayLabelOne, tracklistPlayLabelTwo] = tracklistPlayLabel.split('{0}');
    }
    tracklistPlayLabelOne = cleanLabel(tracklistPlayLabelOne);
    tracklistPlayLabelTwo = cleanLabel(tracklistPlayLabelTwo);

    playButtonStyle.innerHTML = `
      .main-playButton-button[aria-label*="${Spicetify.Platform.Translations.play}"],
      .main-playButton-PlayButton>button[aria-label*="${Spicetify.Platform.Translations.play}"],
      .main-playPauseButton-button[aria-label="${Spicetify.Platform.Translations.play}"],
      .main-playPauseButton-button[aria-label="${Spicetify.Platform.Translations['playback-control.play']}"],
      .main-trackList-rowPlayPauseButton[aria-label*="${Spicetify.Platform.Translations.play}"],
      .main-trackList-rowImagePlayButton[aria-label*="${tracklistPlayLabelOne}"][aria-label*="${tracklistPlayLabelTwo}"],
      .main-playButton-PlayButton>button[aria-label*="${playlistPlayLabel}"] {
        background-color: var(--spice-text) !important;
        -webkit-mask-image: url('https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_play_24_filled.svg') !important;
      }
      .main-playButton-button[aria-label*="${Spicetify.Platform.Translations.pause}"],
      .main-playButton-PlayButton>button[aria-label*="${Spicetify.Platform.Translations.pause}"],
      .main-playPauseButton-button[aria-label*="${Spicetify.Platform.Translations.pause}"],
      .main-playPauseButton-button[aria-label="${Spicetify.Platform.Translations['playback-control.pause']}"],
      .main-trackList-rowPlayPauseButton[aria-label*="${Spicetify.Platform.Translations.pause}"],
      .main-trackList-rowImagePlayButton[aria-label*="${Spicetify.Platform.Translations.pause}"],
      .main-playButton-PlayButton>button[aria-label*="${playlistPauseLabel}"] {
        background-color: var(--spice-text) !important;
        -webkit-mask-image: url('https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_pause_16_filled.svg') !important;
      }`;
    document.getElementsByTagName('head')[0].appendChild(playButtonStyle);

    const libraryXButtonsStyle = document.createElement('style');
    libraryXButtonsStyle.innerHTML = `
      .main-yourLibraryX-button[aria-label*="${Spicetify.Platform.Translations['web-player.your-library-x.enlarge-your-library']}"] span {
        background-color: var(--spice-text) !important;
        -webkit-mask-image: url('https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_arrow_right_24_filled.svg') !important;
        width: 18px;
        height: 18px;
      }
      .main-yourLibraryX-button[aria-label*="${Spicetify.Platform.Translations['web-player.your-library-x.reduce-your-library']}"] span {
        background-color: var(--spice-text) !important;
        -webkit-mask-image: url('https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_arrow_left_24_filled.svg') !important;
        width: 18px;
        height: 18px;
      }
      .main-yourLibraryX-button[aria-label*="${Spicetify.Platform.Translations['web-player.your-library-x.grid-view']}"] span {
        background-color: var(--spice-text) !important;
        -webkit-mask-image: url('https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_table_simple_24_regular.svg') !important;
        width: 18px;
        height: 18px;
      }
      .main-yourLibraryX-button[aria-label*="${Spicetify.Platform.Translations['web-player.your-library-x.list-view']}"] span {
        background-color: var(--spice-text) !important;
        -webkit-mask-image: url('https://cdn.jsdelivr.net/gh/nimsandu/spicetify-bloom@master/assets/fluentui-system-icons/ic_fluent_text_bullet_list_ltr_24_filled.svg') !important;
        width: 18px;
        height: 18px;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(libraryXButtonsStyle);
  }, 10);

  waitForElement(['body'], () => {
    const facScript = document.createElement('script');
    facScript.src = 'https://unpkg.com/fast-average-color/dist/index.browser.min.js';
    facScript.defer = true;
    facScript.type = 'text/javascript';
    document.body.appendChild(facScript);
  });

  const blur = 20;

  function fillBackdrop(backdrop) {
    const context = backdrop.getContext('2d');
    const rootStyles = getComputedStyle(document.documentElement);
    const spiceMain = rootStyles.getPropertyValue('--spice-rgb-main').split(',');
    context.fillStyle = `rgb(
      ${spiceMain[0].trim()},
      ${spiceMain[1]},
      ${spiceMain[2]}
      )`;
    context.fillRect(0, 0, backdrop.width, backdrop.height);
  }

  // fixes container shifting & active line clipping
  function updateLyricsMaxWidth() {
    function detectTextDirection() {
      // 0, 1 - blank lines
      const lyric = document.getElementsByClassName('lyrics-lyricsContent-lyric')[2];
      // https://stackoverflow.com/questions/13731909/how-to-detect-that-text-typed-in-text-area-is-rtl
      const rtl_rx = /[\u0591-\u07FF]/;
      return rtl_rx.test(lyric.innerHTML) ? 'rtl' : 'ltr';
    }

    function setLyricsTransformOrigin(textDirection) {
      const main = document.getElementById('main');
      if (textDirection === 'rtl') {
        main.style.setProperty('--lyrics-text-direction', 'right');
      } else {
        main.style.setProperty('--lyrics-text-direction', 'left');
      }
    }

    function setLyricsMaxWidth() {
      const lyricsContentWrapper = document.getElementsByClassName(
        'lyrics-lyrics-contentWrapper'
      )[0];
      const lyricsContentContainer = document.getElementsByClassName(
        'lyrics-lyrics-contentContainer'
      )[0];

      lyricsContentWrapper.style.maxWidth = '';
      lyricsContentWrapper.style.width = '';

      const textDirection = detectTextDirection();
      setLyricsTransformOrigin(textDirection);
      let offset;
      let maxWidth;

      if (textDirection === 'rtl') {
        offset =
          lyricsContentWrapper.offsetRight +
          parseInt(window.getComputedStyle(lyricsContentWrapper).marginRight, 10);
        maxWidth = Math.round(0.95 * (lyricsContentContainer.clientWidth - offset));
      } else {
        offset =
          lyricsContentWrapper.offsetLeft +
          parseInt(window.getComputedStyle(lyricsContentWrapper).marginLeft, 10);
        maxWidth = Math.round(0.95 * (lyricsContentContainer.clientWidth - offset));
      }

      lyricsContentWrapper.style.setProperty('--lyrics-active-max-width', `${maxWidth}px`);
      const lyricsContentWrapperWidth = lyricsContentWrapper.getBoundingClientRect().width;
      lyricsContentWrapper.style.maxWidth = `${lyricsContentWrapperWidth}px`;
      lyricsContentWrapper.style.width = `${lyricsContentWrapperWidth}px`;
    }

    function lyricsCallback(mutationsList, lyricsObserver) {
      for (let i = 0; i < mutationsList.length; i += 1) {
        for (let a = 0; a < mutationsList[i].addedNodes?.length; a += 1) {
          if (mutationsList[i].addedNodes[a].classList?.contains('lyrics-lyricsContent-provider')) {
            setLyricsMaxWidth();
          }
        }
      }
      lyricsObserver.disconnect;
    }

    waitForElement(['.lyrics-lyricsContent-provider'], () => {
      setLyricsMaxWidth();

      const lyricsContentWrapper = document.getElementsByClassName(
        'lyrics-lyrics-contentWrapper'
      )[0];
      const lyricsObserver = new MutationObserver(lyricsCallback);
      const lyricsObserverConfig = {
        attributes: false,
        childList: true,
        subtree: false,
      };
      lyricsObserver.observe(lyricsContentWrapper, lyricsObserverConfig);
    });
  }

  let previousAlbumUri;

  async function updateLyricsBackdrop() {
    async function calculateBrightnessCoefficient(image) {
      try {
        const fac = new FastAverageColor();
        // ignore colors darker than 50% by HSB, because 0.5 is a brightness threshold
        const averageColor = await fac.getColorAsync(image, {
          ignoredColor: [0, 0, 0, 255, 125],
        });
        fac.destroy();

        // slice(0, 3) - remove alpha channel value
        let brightness = Math.max(...averageColor.value.slice(0, 3));
        brightness = (brightness / 255).toFixed(1);

        return brightness > 0.5 ? 1 - (brightness - 0.5) : 1;
      } catch (error) {
        return 0.65;
      }
    }

    async function calculateSaturationCoefficient(originalImage, canvasImage) {
      function getSaturation(color) {
        const { value } = color;
        const max = Math.max(...value.slice(0, 3));
        const min = Math.min(...value.slice(0, 3));
        const delta = max - min;
        return max !== 0 ? delta / max : 0;
      }

      try {
        const fac = new FastAverageColor();
        const [averageOriginalColor, averageCanvasColor] = await Promise.all([
          // ignore almost black colors
          fac.getColorAsync(originalImage, {
            ignoredColor: [0, 0, 0, 255, 10],
          }),
          fac.getColorAsync(canvasImage),
          { ignoredColor: [0, 0, 0, 255, 10] },
        ]);
        fac.destroy();

        const [averageOriginalSaturation, averageCanvasSaturation] = [
          getSaturation(averageOriginalColor),
          getSaturation(averageCanvasColor),
        ];

        let saturationCoefficient;

        if (averageCanvasSaturation < averageOriginalSaturation) {
          saturationCoefficient = averageOriginalSaturation / averageCanvasSaturation;
        } else {
          // do not change saturation if backdrop is more saturated than the original artwork or equal
          saturationCoefficient = 1;
        }

        const finalSaturation = (averageCanvasSaturation * saturationCoefficient).toFixed(1);

        // try to detect and fix oversaturated backdrop
        if (finalSaturation > 0.8) {
          saturationCoefficient = 1 - (finalSaturation - 0.8);
        }

        // try to detect and fix undersaturated backdrop
        if (finalSaturation < 0.5 && averageOriginalSaturation > 0.05) {
          saturationCoefficient += 0.5 - finalSaturation;
        }

        // coefficient threshold
        if (saturationCoefficient > 1.7) {
          saturationCoefficient = 1.7;
        }

        return saturationCoefficient.toFixed(1);
      } catch (error) {
        return 1.4;
      }
    }

    // necessary because backdrop edges become transparent due to blurring
    async function calculateContextDrawValues(canvas) {
      const drawWidth = canvas.width + blur * 2;
      const drawHeight = canvas.height + blur * 2;
      const drawX = 0 - blur;
      const drawY = 0 - blur;
      return [drawWidth, drawHeight, drawX, drawY];
    }

    async function getImageFromCanvas(canvas) {
      const image = new Image();
      image.src = canvas.toDataURL();
      return image;
    }

    async function updateFilters(canvas, image) {
      const canvasImage = await getImageFromCanvas(canvas);
      const [brightnessCoefficient, saturationCoefficient] = await Promise.all([
        calculateBrightnessCoefficient(canvasImage),
        calculateSaturationCoefficient(image, canvasImage),
      ]);
      // eslint-disable-next-line no-param-reassign
      canvas.style.filter = `saturate(${saturationCoefficient}) brightness(${brightnessCoefficient})`;
    }

    waitForElement(['#lyrics-backdrop'], () => {
      updateLyricsMaxWidth();

      // don't animate backdrop if artwork didn't change
      if (previousAlbumUri === Spicetify.Player.data.track.metadata.album_uri) {
        return;
      }
      previousAlbumUri = Spicetify.Player.data.track.metadata.album_uri;

      const lyricsBackdropPrevious = document.getElementById('lyrics-backdrop');
      const contextPrevious = lyricsBackdropPrevious.getContext('2d');
      contextPrevious.globalCompositeOperation = 'destination-out';
      contextPrevious.filter = `blur(${blur}px)`;

      const lyricsBackdrop = document.createElement('canvas');
      lyricsBackdrop.id = 'lyrics-backdrop';
      fillBackdrop(lyricsBackdrop);
      lyricsBackdropPrevious.insertAdjacentElement('beforebegin', lyricsBackdrop);
      const context = lyricsBackdrop.getContext('2d');
      context.imageSmoothingEnabled = false;
      context.filter = `blur(${blur}px)`;

      const lyricsBackdropImage = new Image();
      lyricsBackdropImage.src = Spicetify.Player.data.track.metadata.image_xlarge_url;

      lyricsBackdropImage.onload = async () => {
        const [drawWidth, drawHeight, drawX, drawY] = await calculateContextDrawValues(
          lyricsBackdrop
        );
        context.drawImage(lyricsBackdropImage, drawX, drawY, drawWidth, drawHeight);
        updateFilters(lyricsBackdrop, lyricsBackdropImage);

        const maxRadius = Math.ceil(
          Math.sqrt(lyricsBackdropPrevious.width ** 2 + lyricsBackdropPrevious.height ** 2) / 2
        );
        const centerX = lyricsBackdropPrevious.width / 2;
        const centerY = lyricsBackdropPrevious.height / 2;
        let radius = 5;

        function animate() {
          if (radius >= maxRadius) {
            lyricsBackdropPrevious.remove();
            return;
          }

          contextPrevious.beginPath();
          contextPrevious.arc(centerX, centerY, radius, 0, Math.PI * 2);
          contextPrevious.closePath();
          contextPrevious.fill();

          radius += 5;
          requestAnimationFrame(animate);
        }
        animate();
      };
    });
  }
  Spicetify.Player.addEventListener('songchange', updateLyricsBackdrop);

  function initLyricsBackdrop() {
    waitForElement(['.under-main-view'], () => {
      const underMainView = document.querySelector('.under-main-view');
      const lyricsBackdropContainer = document.createElement('div');
      lyricsBackdropContainer.id = 'lyrics-backdrop-container';
      underMainView.prepend(lyricsBackdropContainer);

      const lyricsBackdrop = document.createElement('canvas');
      lyricsBackdrop.id = 'lyrics-backdrop';
      lyricsBackdropContainer.appendChild(lyricsBackdrop);

      fillBackdrop(lyricsBackdrop);
      updateLyricsBackdrop();
    });
  }

  function addCategoryCardBackdrop() {
    waitForElement(['.x-categoryCard-image'], () => {
      const cards = document.getElementsByClassName('x-categoryCard-CategoryCard');
      const cardImages = document.getElementsByClassName('x-categoryCard-image');
      for (let i = 0; i < cards.length; i += 1) {
        let cardBackdrop = cardImages[i].previousSibling;
        if (cardBackdrop == null) {
          cardBackdrop = document.createElement('div');
          cardBackdrop.classList.add('x-categoryCard-backdrop');
          cardBackdrop.style.backgroundImage = `url(${cardImages[i].src})`;
          cardBackdrop.style.backgroundColor = `${cards[i].style.backgroundColor}`;
          cardImages[i].parentNode.insertBefore(cardBackdrop, cardImages[i]);
        }
      }
    });
  }

  function onPageChange() {
    const lyricsBackdropContainer = document.getElementById('lyrics-backdrop-container');

    if (Spicetify.Platform.History.location.pathname.includes('lyrics')) {
      if (lyricsBackdropContainer == null) {
        initLyricsBackdrop();
      } else {
        lyricsBackdropContainer.style.display = 'unset';
        updateLyricsMaxWidth();
      }
    } else {
      if (lyricsBackdropContainer != null) {
        lyricsBackdropContainer.style.display = 'none';
      }
      if (Spicetify.Platform.History.location.pathname === '/search') {
        addCategoryCardBackdrop();
      }
    }
  }

  function lyricsCinemaCallback(mutationsList) {
    const lyricsBackdropContainer = document.getElementById('lyrics-backdrop-container');
    const lyricsCinema = mutationsList[0].target;

    if (lyricsCinema.classList.contains('main-lyricsCinema-lyricsCinemaVisible')) {
      if (lyricsBackdropContainer == null) {
        initLyricsBackdrop();
      } else {
        lyricsBackdropContainer.style.display = 'unset';
        updateLyricsMaxWidth();
      }
    } else if (
      lyricsBackdropContainer != null &&
      !Spicetify.Platform.History.location.pathname.includes('lyrics')
    ) {
      lyricsBackdropContainer.style.display = 'none';
    }
  }

  function waitForHistoryAPI(func, timeout = 100) {
    if (Spicetify.Platform?.History) {
      func();
    } else if (timeout > 0) {
      setTimeout(waitForHistoryAPI, 100, func, timeout - 1);
    }
  }

  waitForHistoryAPI(() => {
    Spicetify.Platform.History.listen(onPageChange);
    onPageChange();

    waitForElement(['.Root__lyrics-cinema'], () => {
      const lyricsCinema = document.getElementsByClassName('Root__lyrics-cinema')[0];
      const lyricsCinemaObserver = new MutationObserver(lyricsCinemaCallback);
      const lyricsCinemaObserverConfig = {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        subtree: false,
      };
      lyricsCinemaObserver.observe(lyricsCinema, lyricsCinemaObserverConfig);
    });
  });

  function centerTopbar() {
    waitForElement(['.main-topBar-topbarContentWrapper'], () => {
      const topBarContentWrapper = document.getElementsByClassName(
        'main-topBar-topbarContentWrapper'
      )[0];

      const left = topBarContentWrapper.offsetLeft;
      const right = window.innerWidth - (left + topBarContentWrapper.offsetWidth);

      max = window.innerWidth / 2;
      if (left <= 0 || right <= 0 || left > max || right > max) {
        return;
      }

      let diff;
      if (topBarContentWrapper.style.marginLeft !== '') {
        diff = right - left + parseInt(topBarContentWrapper.style.marginLeft);
      } else {
        diff = right - left;
      }

      diff !== 0 ? (topBarContentWrapper.style.marginLeft = diff + 'px') : null;
    });
  }
  window.addEventListener('load', centerTopbar);

  async function onResize() {
    centerTopbar();
    updateLyricsMaxWidth();
  }
  window.onresize = onResize;

  // filepicker for custom folder images
  const filePickerForm = document.createElement('form');
  filePickerForm.setAttribute('aria-hidden', true);
  filePickerForm.innerHTML = '<input type="file" class="hidden-visually" />';
  document.body.appendChild(filePickerForm);
  /** @type {HTMLInputElement} */
  const filePickerInput = filePickerForm.childNodes[0];
  filePickerInput.accept = [
    'image/jpeg',
    'image/apng',
    'image/avif',
    'image/gif',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ].join(',');

  filePickerInput.onchange = () => {
    if (!filePickerInput.files.length) return;

    const file = filePickerInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      const id = Spicetify.URI.from(filePickerInput.uri).id;
      try {
        localStorage.setItem('bloom:folder-image:' + id, result);
      } catch {
        Spicetify.showNotification('File is too large');
      }
      updatePlaylistsImages();
    };
    reader.readAsDataURL(file);
  };

  // context menu items for custom folder images
  new Spicetify.ContextMenu.Item(
    'Remove folder image',
    ([uri]) => {
      const id = Spicetify.URI.from(uri).id;
      localStorage.removeItem('bloom:folder-image:' + id);
      updatePlaylistsImages();
    },
    ([uri]) => Spicetify.URI.isFolder(uri),
    'x'
  ).register();
  new Spicetify.ContextMenu.Item(
    'Choose folder image',
    ([uri]) => {
      filePickerInput.uri = uri;
      filePickerForm.reset();
      filePickerInput.click();
    },
    ([uri]) => Spicetify.URI.isFolder(uri),
    'edit'
  ).register();

  // fix backdrop-filter for some flyouts and menus
  // see https://github.com/nimsandu/spicetify-bloom/issues/220#issuecomment-1555071865
  function bodyCallback(mutationsList) {
    for (let i = 0; i < mutationsList.length; i += 1) {
      if (mutationsList[i].addedNodes[0]?.id?.includes('tippy')) {
        const tippy = mutationsList[i].addedNodes[0];
        const body = document.querySelector('body');
        const parentNode = tippy.parentNode;
        if (
          parentNode !== body &&
          !parentNode.classList?.contains('lyrics-tooltip-wrapper') &&
          !parentNode.classList?.contains('main-contextMenu-menuItem')
        ) {
          // inherit colors
          tippy.classList.add('encore-dark-theme');
          body.appendChild(tippy);
          // trigger element postition correction
          window.dispatchEvent(new Event('resize'));
        }
      }
    }
  }

  waitForElement(['body'], () => {
    const body = document.querySelector('body');
    const bodyObserver = new MutationObserver(bodyCallback);
    const bodyObserverConfig = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    bodyObserver.observe(body, bodyObserverConfig);
  });
})();
