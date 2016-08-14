module.exports =
  paths:
    watched: ['app']
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(?!app)/
    stylesheets:
      joinTo:
        'css/_app.css': /^app\/styles\/app.styl/
        'css/app.css': /^app\/styles\/app.scss/
        'css/vendor.css': /^(?!app)/
  plugins:
    sass:
      options:
        includePaths: [
          'bower_components/foundation-sites/scss'
        ]
    postcss:
      processors: [
        # permet inline() en css
        require('postcss-assets')
        require('autoprefixer')(['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'])
      ]
