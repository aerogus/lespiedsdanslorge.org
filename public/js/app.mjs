/* globals $, document */

let db = {};
let version = '20240415'; // cache bust

/**
 * Construit la fenêtre modale
 */
function buildModal(year, obj)
{
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
    content += `<div id="modal-video-player" class="fluid-video-player ratio-16-9">
      <iframe width="1280" height="720" src="${obj.video}" frameborder="0" allowfullscreen></iframe>
    </div>`;
  }

  $('.modal-title').empty().text(obj.name);
  $('.modal-body').empty().append(content);
}

function loadFlyers(year)
{
  let flyer_recto = document.getElementById('flyer-recto');
  flyer_recto.src = '/img/affiches/' + year + '/affiche-recto.jpg?' + version;
  flyer_recto.alt = "Flyer recto " + year;
  flyer_recto.classList.remove('visually-hidden');

  let flyer_verso = document.getElementById('flyer-verso');
  flyer_verso.src = '/img/affiches/' + year + '/affiche-verso.jpg?' + version;
  flyer_verso.alt = "Flyer verso " + year;
  flyer_verso.classList.remove('visually-hidden');
}

/**
 * Charge la section Artistes
 */
function loadBlocks(year, type)
{
  let blocks = db.filter(obj => (obj.type === type));
  blocks = blocks.filter(obj => (obj.display === true));

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

function loadGallery(year)
{
  let galleries = db.filter(obj => (obj.type === 'gallery'));
  galleries = galleries.filter(obj => (obj.display === true));
  let gallery = galleries[0];
  let list = $('<div/>');
  list.classList = 'd-flex flex-wrap';
  gallery.photos.forEach((e) => {
    let img = `<img src="/img/gallery/${year}/${e}" class="w-25 p-2" loading="lazy" alt=""/>`;
    list.append(img);
  });
  $('#gallery-content').empty().append(list);
}

/**
 * gestion du scrolling doux
 */
function initSmoothScroll()
{
  // lien vers les ancres internes
  $('a[href^="#"]').on('click', (e) => {
    e.preventDefault();
    $('html,body').animate({ scrollTop: $(e.currentTarget.hash).offset().top - 40 }, 'fast');
  });
}

function main()
{
  let params = new URLSearchParams(document.location.search);
  let year = params.get("year");
  if (year === null) {
    year = 2024;
  }
  initSmoothScroll();
  $.getJSON(`/db/${year}.json?${version}`, (json) => {
    db = json;
    loadFlyers(year);
    loadBlocks(year, 'artiste');
    loadBlocks(year, 'village');
    loadGallery(year);
  });
}

// À la fermeture de la modale
modal.addEventListener('hide.bs.modal', (e) => {
  // on stoppe l'éventuelle vidéo en lecture
  let mvp = document.querySelector('#modal-video-player iframe');
  if (mvp) {
    mvp.src = '';
  }
});

main();
