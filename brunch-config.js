module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'js/derfest.js': /^app\/scripts/
      }
    },
    stylesheets: {
      joinTo: {
        'css/derfest.css': /^app\/styles\/derfest.styl/
      }
    }
  },
  plugins: {
    jaded: {
      staticPatterns: /^app\/views\/(.+)\.jade$/
    },
    postcss: {
      processors: [
        require('postcss-assets'),
        require('autoprefixer')(['last 8 versions'])
      ]
    }
  }
}
