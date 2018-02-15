"use strict";

var App = {

  gmap: {
    api_key: 'AIzaSyBW8wt3QH0k1e_oV9ue_jE8-5AOUX9OnOY',
    callback: 'app.init_gmap'
  },

  init: function () {

    $(document).foundation();

    this.init_artistes();
    this.init_fiches_artistes();
    this.init_planning();
    this.init_map();
    this.init_smooth_scroll();

  },

  /**
   * Charge la section Artistes
   */
  init_artistes: function () {
    let artistes = require('artistes');

    // filtre grande scène ou petite scène
    artistes = artistes.filter(function (obj) {
      return obj.scene === 'grande' || obj.scene === 'petite';
    });

    // tri alphabétique
    artistes.sort(function (a, b) {
      return a.name > b.name;
    });

    var list = $('<div class="row"/>');
    artistes.forEach(function (e) {
      var div = '<div class="small-6 medium-4 columns artiste">\
        <a data-open="' + e.id + '">\
          <img src="' + e.photo + '"/>\
          <h4 class="button">' + e.name + '</h4>\
        </a>\
      </div>';
      list.append(div);
    });

    $('#artistes-content').append(list);
  },

  /**
   * Tableau des horaires
   */
  init_planning: function () {
    var artistes = require('artistes');

    // filtre grande scène ou petite scène
    artistes = artistes.filter(function (obj) {
      return obj.scene === 'grande' || obj.scene === 'petite';
    });

    // tri chronologique
    artistes.sort(function (a, b) {
      return a.horaire > b.horaire;
    });

    var table = $('#planning-table');
    var tbody = $('<tbody/>');
    artistes.forEach(function (artiste) {
      var tr = $('<tr/>');
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
   * Initialisation de la Google Map
   */
  init_gmap: function () {
    var parking = new google.maps.LatLng(48.66943944555655, 2.3234067073791653);
    var options = {
      zoom: 16,
      center: parking,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      scrollwheel: false
    };
    var map = new google.maps.Map(document.getElementById('map'), options);
    var marker = new google.maps.Marker({
      map: map,
      position: parking
    });
  },

  /**
   * génération des fiches artistes
   */
  init_fiches_artistes: function () {
    var artistes = require('artistes');
    artistes.forEach(function (obj) {
      var content = '<div id="' + obj.id + '" class="large reveal" data-reveal>\
        <img src="' + obj.photo + '" width="480" height="360" style="float: left; padding-right: 10px; padding-bottom: 10px">\
        <h4>' + obj.name + '</h4>\
        <p><strong>' + obj.style + '</strong></p>\
        <p>Scène: <strong>' + obj.scene + '</strong> - Horaire: <strong>' + obj.horaire + '</strong></p>\
        <p><a href="' + obj.facebook + '">Facebook</a></p>\
        <p>' + obj.description.replace('\n', '<br>') + '</p>\
        <button class="close-button" data-close aria-label="Close modal" type="button">\
          <span aria-hidden="true">&times;</span>\
        </button>';

      if(obj.video) {
        content += '<div class="flex-video widescreen">\
          <iframe width="1280" height="720" src="' + obj.video + '" frameborder="0" allowfullscreen></iframe>\
        </div>';
      }

      content += '</div>';
      $('#artiste-content').append(content);
      var reveal = new Foundation.Reveal($('#' + obj.id));
    });

  },

  /**
   * gestion du scrolling doux
   */
  init_smooth_scroll: function () {
    // lien vers les ancres internes
    $('a[href^="#"]').click(function (e) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 'fast');
    });
  }

};

module.exports = App;
