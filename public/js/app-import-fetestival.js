/* globals $, document */

let db = {};

/**
 * Construit la fenêtre modale
 */
function buildModal(year, obj) {
  let photo;
  if (obj.type === 'artiste') {
    photo = `/img/artiste/${year}/${obj.id}.jpg`;
  } else {
    photo = `/img/village/${year}/${obj.id}.jpg`;
  }
  let content = `
  <img class="main-picture" src="${photo}" width="480" height="270" alt="">
  <div class="row">
    <div class="col py-3 text-start">
      <span class="style">${obj.style}</span>
    </div>
    <div class="col py-3 text-end">
  <ul class="list-inline mb-0">`;

  Object.keys(obj.links).forEach((key) => {
    content += `<li class="list-inline-item"><a class="badge social ${key}" href="${obj.links[key]}" target="_blank" title="lien vers ${key}"><img src="/img/social/${key}.svg" alt=""/></a></li>`;
  });

  content += `</ul></div>`;
  content += `<p>${obj.description.replace('\n', '<br>')}</p>`;

  if (obj.video) {
    content += `<div class="fluid-video-player ratio-16-9">
      <iframe width="1280" height="720" src="${obj.video}" frameborder="0" allowfullscreen></iframe>
    </div>`;
  }

  $('.modal-title').empty().text(obj.name);
  $('.modal-body').empty().append(content);
}

function getObj(type, id) {
  return db.filter(obj => (obj.type === type) && (obj.id === id));
}

function initFlyer(year) {
  console.log('initFlyer ' + year);
  let flyer_recto = document.getElementById('flyer-recto');
  flyer_recto.src = '/img/affiches/' + year + '/affiche-recto.jpg';
  flyer_recto.alt = "Flyer recto Fet’Estival " + year;
  flyer_recto.classList.remove('visually-hidden');
  if (year != 2024) {
    let flyer_verso = document.getElementById('flyer-verso');
    flyer_verso.src = '/img/affiches/' + year + '/affiche-verso.jpg';
    flyer_verso.alt = "Flyer verso Fet’Estival " + year;
    flyer_verso.classList.remove('visually-hidden');
  }
}

/**
 * Charge la section Artistes
 */
function initBlocks(year, type) {
  let blocks = db.filter(obj => (obj.type === type));
  if (year === 2023 || year == 2024) {
    blocks = blocks.filter(obj => (obj.display === true));
  }
  // tri alphabétique
  // block.sort((a, b) => a.name > b.name);
  let list = $('<div/>');
  blocks.forEach((e) => {
    let div = `<div class="artiste">
      <a data-id="${e.id}" data-bs-toggle="modal" data-bs-target="#modal">
        <h4 class="button">${e.name}</h4>
        <img src="/img/${type}/${year}/${e.id}.jpg" width="480" height="270"/>
        <h5 class="button">${e.style}</h5>
      </a>
    </div>`;
    list.append(div);
  });
  $('#' + type + '-content').empty().append(list);
  $('.artiste a').click((e) => {
    let id = e.currentTarget.dataset.id;
    let obj = db.filter(obj => (obj.id === id))[0];
    buildModal(year, obj);
    e.preventDefault();
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
  let params = new URLSearchParams(document.location.search);
  let year = params.get("year");
  if (year === null) {
    year = 2024;
  }
  console.log(year);
  initSmoothScroll();
  $.getJSON(`/db/${year}.json?20240318`, (json) => {
    db = json;
    console.log(db);
    initFlyer(year);
    initBlocks(year, 'artiste');
    if (year == 2018 || year == 2019) {
      initBlocks(year, 'village');
    }
  });
}
