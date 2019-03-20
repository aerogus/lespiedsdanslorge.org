/* globals $, google, document */

const dbArtistes = require('./artistes');
const dbVillage = require('./village');

const gmap = {
  api_key: 'AIzaSyBW8wt3QH0k1e_oV9ue_jE8-5AOUX9OnOY',
  callback: 'app.gmapCallback',
  lat: 48.66943944555655,
  lng: 2.3234067073791653,
};

function buildModal(obj) {
  let content = `<div class="clearfix modal-content" id="${obj.id}">
  <div class="bfc">
  <img src="${obj.photo}" width="480" height="360" style="float:left;padding-right:10px;padding-bottom:10px">
  <h4>${obj.name}</h4>
  <p><strong>${obj.style}</strong></p>`;

  if (obj.links.site) {
    content += `<a class="badge social site" href="${obj.links.site}" target="_blank" title="lien vers le site"><img src="/img/social/site.svg" alt=""/></a>`;
  }
  if (obj.links.facebook) {
    content += `<a class="badge social facebook" href="${obj.links.facebook}" target="_blank" title="lien vers le Facebook"><img src="/img/social/facebook.svg"/></a>`;
  }
  if (obj.links.twitter) {
    content += `<a class="badge social twitter" href="${obj.links.twitter}" target="_blank" title="lien vers le Twitter"><img src="/img/social/twitter.svg"/></a>`;
  }
  if (obj.links.youtube) {
    content += `<a class="badge social youtube" href="${obj.links.youtube}" target="_blank" title="lien vers le YouTube"><img src="/img/social/youtube.svg"/></a>`;
  }
  if (obj.links.instagram) {
    content += `<a class="badge social instagram" href="${obj.links.instagram}" target="_blank" title="lien vers le Instagram"><img src="/img/social/instagram.svg"/></a>`;
  }
  if (obj.links.bandcamp) {
    content += `<a class="badge social bandcamp" href="${obj.links.bandcamp}" target="_blank" title="lien vers le bandcamp"><img src="/img/social/bandcamp.svg"/></a>`;
  }
  if (obj.links.soundcloud) {
    content += `<a class="badge social soundcloud" href="${obj.links.soundcloud}" target="_blank" title="lien vers le soundcloud"><img src="/img/social/soundcloud.svg"/></a>`;
  }

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
  const obj = dbArtistes.filter(obj => (obj.id === id))[0] || dbVillage.filter(obj => (obj.id === id))[0];
  buildModal(obj);
  handleModalControls();
  $('.modal').show(); // affiche le fond
  $('.modal-content').hide(); // ferme les autres
  $(`#${id}`).show();
}

function initResponsiveMenu() {
  let menuOpened = false;
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
  const artistes = dbArtistes;
  // tri alphabétique
  artistes.sort((a, b) => a.name > b.name);
  const list = $('<div class="grid-3-small-2 has-gutter-l"/>');
  artistes.forEach((e) => {
    const div = `<div class="artiste">
      <a data-open="${e.id}">
        <img src="${e.photo}"/>
        <h4 class="button">${e.name}</h4>
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
 * Charge la section Village
 */
function initVillage() {
  const village = dbVillage;
  // tri alphabétique
  village.sort((a, b) => a.name > b.name);
  const list = $('<div class="grid-3-small-2 has-gutter-l"/>');
  village.forEach((e) => {
    const div = `<div class="artiste">
      <a data-open="${e.id}">
        <img src="${e.photo}"/>
        <h4 class="button">${e.name}</h4>
      </a>
    </div>`;
    list.append(div);
  });
  $('#village-content').append(list);
  $('.artiste a').click((e) => {
    e.preventDefault();
    showModal(e.currentTarget.dataset.open);
  });
}

/**
 * insertion du script Google Maps
 */
function initMap() {
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${gmap.api_key}&callback=${gmap.callback}`;
  document.head.appendChild(s);
}

/**
 * Callback d'initialisation de la Google Map
 */
function gmapCallback() {
  const parking = new google.maps.LatLng(gmap.lat, gmap.lng);
  const options = {
    zoom: 16,
    center: parking,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    scrollwheel: false,
  };
  const map = new google.maps.Map(document.getElementById('map'), options);
  const marker = new google.maps.Marker({
    map,
    position: parking,
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

function init() {
  initResponsiveMenu();
  initArtistes();
  initVillage();
  initMap();
  initSmoothScroll();
  handleModalControls();
}

module.exports = {
  init,
  gmapCallback,
};
