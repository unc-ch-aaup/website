const { DateTime } = require('luxon')

const ts = DateTime.local().setZone('America/New_York')

module.exports = {
  site: {
    title: 'UNC Chapel Hill AAUP',
    description: 'UNC Chapel Hill chapter of the AAUP',
    timestamp: {
      iso: ts.toISODate(),
      pretty: ts.toLocaleString(DateTime.DATE_FULL)
    }
  },
  build: {
    outputPath: './site',
    recentPosts: 3
  }
}
