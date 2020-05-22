/* globals $, document */

var db = {};

/**
 * Construit la fenêtre modale
 */
function buildModal(obj) {
  var photo;
  if (obj.type === 'artiste') {
    photo = `/img/artistes/${obj.id}.jpg`;
  } else {
    photo = `/img/village/${obj.id}.jpg`;
  }
  var content = `<div class="clearfix modal-content" id="${obj.id}">
  <div class="bfc">
  <img src="${photo}" width="480" height="270" style="float:left;padding-right:10px;padding-bottom:10px">
  <h4>${obj.name}</h4>
  <p><strong>${obj.style}</strong></p>`;

  Object.keys(obj.links).forEach((key) => {
    content += `<a class="badge social ${key}" href="${obj.links[key]}" target="_blank" title="lien vers ${key}"><img src="/img/social/${key}.svg" alt=""/></a>`;
  });

  content += `<p>${obj.description.replace('\n', '<br>')}</p></div>
    <button class="close-button">X</button>`;

  if (obj.video) {
    content += `<div class="fluid-video">
      <iframe width="1280" height="720" src="${obj.video}" frameborder="0" allowfullscreen></iframe>
    </div>`;
  }

  content += '</div>';
  $('#artiste-content').append(content);
}

/**
 * @param {string} id
 */
function hideModal(id) {
  if (id) $(`#${id}`).hide();
  $('.modal').empty();
  $('.modal').hide();
}

function handleModalControls() {
  // echap ferme la modale
  $(document).keyup((e) => { if (e.keyCode === 27) hideModal(); });

  // click à l'extérieur ferme la modale
  $('.modal').click((e) => { if (e.target.id === 'artiste-content') hideModal(); });

  // click bouton X
  $('.close-button').click(e => hideModal(e.currentTarget.parentNode.id));
}

/**
 * @param {string} id
 */
function showModal(id) {
  if (!id) return;
  var obj = db.filter(item => (item.id === id))[0];
  buildModal(obj);
  handleModalControls();
  $('.modal').show(); // affiche le fond
  $('.modal-content').hide(); // ferme les autres
  $(`#${id}`).show();
}

function initResponsiveMenu() {
  var menuOpened = false;
  $('#btn-burger').click((e) => {
    if (!menuOpened) {
      $(e.currentTarget).addClass('selected');
      $('.top-menu').addClass('selected');
      menuOpened = true;
    } else {
      $(e.currentTarget).removeClass('selected');
      $('.top-menu').removeClass('selected');
      menuOpened = false;
    }
  });
}

/**
 * Charge la section Artistes
 */
function initArtistes() {
  var artistes = db.filter(obj => (obj.type === 'artiste'));
  // tri alphabétique
  // artistes.sort((a, b) => a.name > b.name);
  var list = $('<div class="grid-4-small-2 has-gutter-l"/>');
  artistes.forEach((e) => {
    var div = `<div class="artiste">
      <a data-open="${e.id}">
        <h4 class="button">${e.name}</h4>
        <img src="/img/artistes/${e.id}.jpg" width="400" height="400"/>
        <h5 class="button">${e.style}</h5>
      </a>
    </div>`;
    list.append(div);
  });
  $('#artistes-content').append(list);
  $('.artiste a').click((e) => {
    e.preventDefault();
    showModal(e.currentTarget.dataset.open);
  });
}

/**
 * gestion du scrolling doux
 */
function initSmoothScroll() {
  // lien vers les ancres internes
  $('a[href^="#"]').on('click', (e) => {
    e.preventDefault();
    $('html,body').animate({ scrollTop: $(e.currentTarget.hash).offset().top - 40 }, 'fast');
  });
}

function initHlsPlayer() {
  var video = document.getElementById('live-video');
  var videoSrc = 'https://live.adhocmusic.com/hls/onair.m3u8';
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', function() {
      video.play();
    });
  }
}

function init() {
  initResponsiveMenu();
  initSmoothScroll();
  handleModalControls();
  $.getJSON('/js/db.json', (json) => {
    db = json;
    initArtistes();
  });
  initHlsPlayer();
}

