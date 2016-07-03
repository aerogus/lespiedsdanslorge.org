module.exports =
  paths:
    watched: ['app']
  files:
    javascripts:
      joinTo:
        'js/derfest.js': /^app/
    stylesheets:
      joinTo:
        'css/derfest.css': /^app\/styles\/derfest.styl/
  plugins:
    jaded:
      staticPatterns: /^app\/views\/(.+)\.jade$/
    postcss:
      processors: [
        # permet inline() en css
        require('postcss-assets')
        require('autoprefixer')(['last 8 versions'])
      ]
