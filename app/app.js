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
    console.log('get_page ' + name);
    switch (name) {
      case '/':
        return '<p>coucou accueil</p>';
        break;
      case '/artistes/polarpolarpolarpolar':
        var artiste = require('artistes/polarpolarpolarpolar');
        return '<h2>' + artiste.name + '</h2>' + '<p>' + artiste.description.replace('\n', '<br>') + '</p>';
        break;
      case '/artistes/lesdyvettesdenface':
        var artiste = require('artistes/lesdyvettesdenface');
        console.log('require ' + artiste.name);
        return '<p>coucou dyvettes</p>';
        break;
      case '/artistes':
        return 'artistes';
        break;
      case '/partenaires':
        return '<p>Les partenaires</p>';
        break;
      default:
        return '<p>unknown page</p>';
        break;
    }
  }

};

module.exports = App;
