"use strict";

module.exports = {

  gmap: {
    api_key: 'AIzaSyBW8wt3QH0k1e_oV9ue_jE8-5AOUX9OnOY',
    callback: 'app.gmap_cb',
    lat: 48.66943944555655,
    lng: 2.3234067073791653
  },

  init: function () {
    this.init_responsive_menu();
    this.init_artistes();
    this.init_fiches_artistes();
    this.init_planning();
    this.init_map();
    this.init_smooth_scroll();
  },

  init_responsive_menu: function () {
    let menuSelected = false;
    $('#btn-burger').click(function() {
      if (!menuSelected) {
        $(this).addClass('selected');
        $('.top-menu').addClass('selected');
        menuSelected = true;
      } else {
        $(this).removeClass('selected')
        $('.top-menu').removeClass('selected');
        menuSelected = false;
      }
    });
  },

  /**
   * Charge la section Artistes
   */
  init_artistes: function () {
    let artistes = require('artistes');

    // filtre grande scène ou petite scène
    artistes = artistes.filter(obj => (obj.scene === 'grande' || obj.scene === 'petite'));

    // tri alphabétique
    artistes.sort((a, b) => a.name > b.name);

    let list = $('<div class="grid-3-small-2 has-gutter-l"/>');
    artistes.forEach(e => {
      let div = '<div class="artiste">\
        <a data-open="' + e.id + '">\
          <img src="' + e.photo + '"/>\
          <h4 class="button">' + e.name + '</h4>\
        </a>\
      </div>';
      list.append(div);
    });

    $('#artistes-content').append(list);

    $('.artiste a').click(e => {
      e.preventDefault();
      console.log('clic sur ' + $(e.currentTarget).data('open'));
      $('.modal').hide();
      $('#' + $(e.currentTarget).data('open')).show();
    })
  },

  /**
   * Tableau des horaires
   */
  init_planning: function () {
    let artistes = require('artistes');

    // filtre grande scène ou petite scène
    artistes = artistes.filter(obj => obj.scene === 'grande' || obj.scene === 'petite');

    // tri chronologique
    artistes.sort((a, b) => a.horaire > b.horaire);

    let table = $('#planning-table');
    let tbody = $('<tbody/>');
    artistes.forEach(artiste => {
      let tr = $('<tr/>');
      tr.append($('<th/>', {
        text: artiste.horaire
      }))
      .append($('<td/>', {
        html: artiste.scene === 'petite' ? '<a data-open="' + artiste.id + '">' + artiste.name + '</a>' : ''
      }))
      .append($('<td/>', {
        html: artiste.scene === 'grande' ? '<a data-open="' + artiste.id + '">' + artiste.name + '</a>' : ''
      }));
      tbody.append(tr);
    });

    table.append(tbody);
  },

  /**
   * insertion du script Google Maps
   */
  init_map: function () {
    let s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.gmap.api_key + '&callback=' + this.gmap.callback;
    document.head.appendChild(s);
  },

  /**
   * Callbacl d'initialisation de la Google Map
   */
  gmap_cb: function () {
    let parking = new google.maps.LatLng(this.gmap.lat, this.gmap.lng);
    let options = {
      zoom: 16,
      center: parking,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      scrollwheel: false
    };
    let map = new google.maps.Map(document.getElementById('map'), options);
    let marker = new google.maps.Marker({
      map: map,
      position: parking
    });
  },

  /**
   * génération des fiches artistes
   */
  init_fiches_artistes: function () {
    let artistes = require('artistes');
    artistes.forEach(obj => {
      let content = '<div class="modal" id="' + obj.id + '">\
        <img src="' + obj.photo + '" width="480" height="360" style="float: left; padding-right: 10px; padding-bottom: 10px">\
        <h4>' + obj.name + '</h4>\
        <p><strong>' + obj.style + '</strong></p>\
        <p>Scène: <strong>' + obj.scene + '</strong> - Horaire: <strong>' + obj.horaire + '</strong></p>';

      if (obj.facebook) {
        content += '<a class="badge social facebook" href="' + obj.facebook + '"><img src="/img/social/facebook.svg"/></a>';
      }

      if (obj.twitter) {
        content += '<a class="badge social twitter" href="' + obj.twitter + '"><img src="/img/social/twitter.svg"/></a>';
      }

      content += '<p>' + obj.description.replace('\n', '<br>') + '</p>\
        <button class="close-button">Fermer</button>';
/*
      if (obj.video) {
        content += '<div class="fluid-video">\
          <iframe width="1280" height="720" src="' + obj.video + '" frameborder="0" allowfullscreen></iframe>\
        </div>';
      }
*/
      content += '</div>';
      $('#artiste-content').append(content);
    });

    $('.close-button').click(e => {
      $(e.currentTarget).parent().hide();
    })

  },

  show_modal: function (id) {
    $(id).show();
  },

  hide_modal: function (id) {
    $(id).hide();
  },

  /**
   * gestion du scrolling doux
   */
  init_smooth_scroll: function () {
    // lien vers les ancres internes
    $('a[href^="#"]').on('click', e => {
      e.preventDefault();
      $('html,body').animate({ scrollTop: $(e.currentTarget.hash).offset().top - 40 }, 'fast');
    });
  }

};
