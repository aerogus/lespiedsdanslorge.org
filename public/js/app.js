/* globals $, document */

var db = {};

/**
 * Construit la fenêtre modale
 */
function buildModal(obj) {
  let photo;
  if (obj.type === 'artiste') {
    photo = `/img/artistes/${year}/${obj.id}.jpg`;
  } else {
    photo = `/img/village/${year}/${obj.id}.jpg`;
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
 * Charge la section Artistes
 */
function initBlocks(year, type) {
  var blocks = db.filter(obj => (obj.type === type));
  // tri alphabétique
  // block.sort((a, b) => a.name > b.name);
  let list = $('<div/>');
  blocks.forEach((e) => {
    let div = `<div class="artiste">
      <a data-open="${e.id}">
        <h4 class="button">${e.name}</h4>
        <img src="/img/${type}/${year}/${e.id}.jpg" width="480" height="270"/>
        <h5 class="button">${e.style}</h5>
      </a>
    </div>`;
    list.append(div);
  });
  $('#' + type + '-content').append(list);
  $('.artiste a').click((e) => {
    e.preventDefault();
    const myModal = new bootstrap.Modal(document.getElementById('modalToggle'));
    const modalToggle = document.getElementById('modalToggle');
    myModal.show(modalToggle);
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

function init(year) {
  initSmoothScroll();
  $.getJSON(`/db/${year}.json`, (json) => {
    db = json;
    initBlocks(year, 'artiste');
    if (year == 2018 || year == 2019) {
      initBlocks(year, 'village');
    }
  });
}

