exports.config =
  paths:
    watched: ['app']
  files:
    stylesheets:
      joinTo:
        'css/derfest.css': /^app\/styles\/derfest.styl/
  plugins:
    postcss:
      processors: [
        # permet inline() en css
        require('postcss-assets')
        require('autoprefixer')(['last 6 versions'])
      ]
