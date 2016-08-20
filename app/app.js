"use strict";

var App = {

  GMAP_KEY: 'AIzaSyBW8wt3QH0k1e_oV9ue_jE8-5AOUX9OnOY',

  init: function () {
    console.log('App.init');

    $(document).foundation();

    var _this = this;

    this.init_artistes();
    this.init_artiste();
    this.init_planning();
    //this.init_grande_scene();
    //this.init_petite_scene();
    this.init_map();

    // smooth scrollTo
    $('a[href^="#"]').click(function (e) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 'fast');
    });

  },

  /**
   * Charge la section Artistes
   */
  init_artistes: function () {
    var artistes = require('artistes');

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
      list.append('<div class="small-6 medium-4 columns artiste">\
        <a data-open="' + e.id + '">\
          <img src="' + e.photo + '"/>\
          <h4 class="button">' + e.name + '</h4>\
        </a>');
    });

    $('#artistes-content').append(list);
  },

  /**
   *
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
   * Charge la section Grande Scène
   */
  init_grande_scene: function () {
    var artistes = require('artistes');

    // filtre grande scène
    artistes = artistes.filter(function (obj) {
      return obj.scene === 'grande';
    });

    // tri chronologique
    artistes = artistes.sort(function (a, b) {
      return a.horaire > b.horaire;
    });

    var list = $('<div class="row"/>');
    artistes.forEach(function (e) {
      list.append('<div class="small-6 medium-4 columns artiste">\
        <a data-open="' + e.id + '">\
          <img src="' + e.photo + '"/>\
          <h4 class="button">' + e.name + ' ' + e.horaire + '</h4>\
        </a>');
    });

    $('#grande-scene-content').append(list);
  },

  /**
   * Charge la section Petite Scène
   */
  init_petite_scene: function () {
    var artistes = require('artistes');

    // filtre petite scène
    artistes = artistes.filter(function (obj) {
      return obj.scene === 'petite';
    });

    // tri chronologique
    artistes = artistes.sort(function (a, b) {
      return a.horaire > b.horaire;
    });

    var list = $('<div class="row"/>');
    artistes.forEach(function (e) {
      list.append('<div class="small-6 medium-4 columns artiste">\
        <a data-open="' + e.id + '">\
          <img src="' + e.photo + '"/>\
          <p><strong>' + e.horaire + '</strong></p>\
          <h4 class="button">' + e.name + '</h4>\
        </a>');
    });

    $('#petite-scene-content').append(list);
  },

  /**
   *
   */
  init_map: function () {
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.GMAP_KEY + '&callback=app.init_gmap';
    document.head.appendChild(s);
  },

  /**
   *
   */
  init_gmap: function () {
    console.log('init gmap');
    var options = {
      zoom: 16,
      center: new google.maps.LatLng(48.66943944555655, 2.3234067073791653),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      scrollwheel: false
    };
    var map = new google.maps.Map(document.getElementById('map'), options);
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(48.66943944555655,2.3234067073791653)
    });
  },

  /**
   * fiches artistes
   */
  init_artiste: function () {
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
        </button>\
        </div>';
        $('#artiste-content').append(content);
        var reveal = new Foundation.Reveal($('#' + obj.id));
    });

  }

};

module.exports = App;
