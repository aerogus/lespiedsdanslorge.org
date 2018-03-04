module.exports =
  paths:
    watched: ['app']
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
    stylesheets:
      joinTo:
        'css/app.css': /^app\/styles\/app.styl/
  plugins:
    postcss:
      processors: [
        # permet inline() en css
        require('postcss-assets')
        require('autoprefixer')(['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'])
      ]
