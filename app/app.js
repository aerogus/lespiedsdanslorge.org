/* globals $, document */

const db = require('./db.json');

function buildModal(obj) {
  let photo;
  if (obj.type === 'artiste') {
    photo = `/img/artistes/${obj.id}.jpg`;
  } else {
    photo = `/img/village/${obj.id}.jpg`;
  }
  let content = `<div class="clearfix modal-content" id="${obj.id}">
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
  const obj = db.filter(item => (item.id === id))[0];
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
  const artistes = db.filter(obj => (obj.type === 'artiste'));
  // tri alphabétique
  artistes.sort((a, b) => a.name > b.name);
  const list = $('<div class="grid-3-small-2 has-gutter-l"/>');
  artistes.forEach((e) => {
    const div = `<div class="artiste">
      <a data-open="${e.id}">
        <h4 class="button">${e.name}</h4>
        <img src="/img/artistes/${e.id}.jpg"/>
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
 * Charge la section Village
 */
function initVillage() {
  const village = db.filter(obj => (obj.type === 'village'));
  // tri alphabétique
  village.sort((a, b) => a.name > b.name);
  const list = $('<div class="grid-3-small-2 has-gutter-l"/>');
  village.forEach((e) => {
    const div = `<div class="artiste">
      <a data-open="${e.id}">
        <h4 class="button">${e.name}</h4>
        <img src="/img/village/${e.id}.jpg"/>
        <h5 class="button">${e.style}</h5>
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
  initSmoothScroll();
  handleModalControls();
}

module.exports = {
  init,
};
