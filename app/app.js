"use strict";

var App = {

  route: '',

  UI: {
    main: document.getElementById('main-content')
  },

  init: function () {
    var _this = this;
    console.log('App.init');
    this.route = window.location.pathname;
    console.log(this.route);
    this.UI.main.innerHTML = this.get_page(this.route);

    // intercepte les clicks sur les liens
    document.addEventListener('click', function (e) {
      var e = window.e || e;
      if (e.target.tagName !== 'A') {
        return;
      }
      e.preventDefault();
      console.log('click to ' + e.target.href);
      window.history.pushState('', '', e.target.href);
      _this.UI.main.innerHTML = _this.get_page(e.target.href);
    }, false);

  },

  /**
   * @param string name
   * @return string
   */
  get_page: function (name) {
    name.replace('http://localhost:3333', '');
    name.replace('http://derfest.eu', '');
    console.log('get_page ' + name);
    switch (name) {
      case '/':
        return '<p>coucou accueil</p>';
        break;
      case '/artistes/lesdyvettesdenface':
        return this.tpl_artiste('lesdyvettesdenface');
      case '/artistes/oddfiction':
        return this.tpl_artiste('oddfiction');
      case '/artistes/mayavibes':
        return this.tpl_artiste('mayavibes');
      case '/artistes/pandravox':
        return this.tpl_artiste('pandravox');
      case '/artistes/polarpolarpolarpolar':
        return this.tpl_artiste('polarpolarpolarpolar');
      case '/artistes/pricklypearl':
        return this.tpl_artiste('pricklypearl');
      case '/artistes/resonnance':
        return this.tpl_artiste('resonnance');
      case '/artistes/smokeybandits':
        return this.tpl_artiste('smokeybandits');
      case '/artistes/sozik':
        return this.tpl_artiste('sozik');
      case '/artistes':
        return this.tpl_artistes();
      case '/grande-scene':
        return this.tpl_grande_scene();
      case '/petite-scene':
        return this.tpl_petite_scene();
      case '/partenaires':
        return '<p>Les partenaires</p>';
      default:
        return '<p>unknown page</p>';
    }
  },

  /**
   * @param string id
   * @return string
   */
  tpl_artiste: function (id) {
    var data = require('artistes/' + id);
    return '<h2>' + data.name + '</h2>' + '<p>' + data.description.replace('\n', '<br>') + '</p>';
  },

  /**
   * liste des artistes triés par horaire
   */
  tpl_artistes: function () {
    var artistes = require('artistes');
    artistes.sort(function (a, b) {
      return a.horaire < b.horaire;
    });
    return 'artistes';
  },

  /**
   *
   */
  tpl_grande_scene: function () {
    var artistes = require('artistes')
    artistes.filter(function (obj) {
      return obj.scene === 'grande';
    });
    artistes.sort(function (a, b) {
      return a.horaire < b.horaire;
    });
    console.log(artistes);
    return 'grande scene';
  },

  /**
   *
   */
  tpl_petite_scene: function () {
    var artistes = require('artistes');
    artistes.filter(function (obj) {
      return obj.scene === 'petite';
    });
    artistes.sort(function (a, b) {
      return a.horaire < b.horaire;
    });
    console.log(artistes);
    return 'petite scene';
  }

};

module.exports = App;
