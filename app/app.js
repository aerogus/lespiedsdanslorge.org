/* globals $, google, document */

const dbArtistes = require('./artistes');
// const dbExposants = require('./exposants');

const gmap =
{
  api_key: 'AIzaSyBW8wt3QH0k1e_oV9ue_jE8-5AOUX9OnOY',
  callback: 'app.gmapCallback',
  lat: 48.66943944555655,
  lng: 2.3234067073791653,
};

/**
 * @param {string} id
 */
function showModal(id) {
  if (!id) return;
  $('.modal').show(); // affiche le fond
  $('.modal-content').hide(); // ferme les autres
  $(`#${id}`).show();
}

/**
 * @param {string} id
 */
function hideModal(id) {
  if (id) $(`#${id}`).hide();
  $('.modal').hide();
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
  // filtre grande scène ou petite scène
  const artistes = dbArtistes.filter(obj => (obj.scene === 'grande' || obj.scene === 'petite'));
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
 * Tableau des horaires
 */
function initPlanning() {
  // filtre grande scène ou petite scène
  const artistes = dbArtistes.filter(obj => obj.scene === 'grande' || obj.scene === 'petite');
  // tri chronologique
  artistes.sort((a, b) => a.horaire > b.horaire);
  const table = $('#planning-table');
  const tbody = $('<tbody/>');
  artistes.forEach((artiste) => {
    const tr = $('<tr/>');
    tr.append($('<th/>', {
      text: artiste.horaire,
    }))
      .append($('<td/>', {
        html: artiste.scene === 'petite' ? `<a data-open="${artiste.id}">${artiste.name}</a>` : '',
      }))
      .append($('<td/>', {
        html: artiste.scene === 'grande' ? `<a data-open="${artiste.id}">${artiste.name}</a>` : '',
      }));
    tbody.append(tr);
  });
  table.append(tbody);
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
 * génération des fiches artistes
 */
function initFichesArtistes() {
  dbArtistes.forEach((obj) => {
    let content = `<div class="clearfix modal-content" id="${obj.id}">
      <img src="${obj.photo}" width="480" height="360" style="float:left;padding-right:10px;padding-bottom:10px">
      <h4>${obj.name}</h4>
      <p><strong>${obj.style}</strong></p>
      <p>Scène: <strong>${obj.scene}</strong> - Horaire: <strong>${obj.horaire}</strong></p>`;

    if (obj.facebook) {
      content += `<a class="badge social facebook" href="${obj.facebook}"><img src="/img/social/facebook.svg"/></a>`;
    }
    if (obj.twitter) {
      content += `<a class="badge social twitter" href="${obj.twitter}"><img src="/img/social/twitter.svg"/></a>`;
    }
    if (obj.youtube) {
      content += `<a class="badge social youtube" href="${obj.youtube}"><img src="/img/social/youtube.svg"/></a>`;
    }
    if (obj.instagram) {
      content += `<a class="badge social instagram" href="${obj.instagram}"><img src="/img/social/instagram.svg"/></a>`;
    }
    if (obj.bandcamp) {
      content += `<a class="badge social bandcamp" href="${obj.bandcamp}"><img src="/img/social/bandcamp.svg"/></a>`;
    }

    content += `<p>${obj.description.replace('\n', '<br>')}</p>
      <button class="close-button">X</button>`;

    if (obj.video) {
      content += `<div class="fluid-video">
        <iframe width="1280" height="720" src="${obj.video}" frameborder="0" allowfullscreen></iframe>
      </div>`;
    }

    content += '</div>';
    $('#artiste-content').append(content);
  });

  $('.close-button').click(e => hideModal(e.currentTarget.parentNode.id));
}

function handleModalControls() {
  // echap ferme la modale
  $(document).keyup((e) => { if (e.keyCode === 27) hideModal(); });
  // click à l'extérieur ferme la modale
  $('.modal').click(() => hideModal());
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
  initFichesArtistes();
  initPlanning();
  initMap();
  initSmoothScroll();
  handleModalControls();
}

module.exports = {
  init,
  gmapCallback,
};
