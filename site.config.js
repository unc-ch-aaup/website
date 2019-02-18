const { DateTime } = require('luxon')

const timezone = 'America/New_York'
const ts = DateTime.local().setZone(timezone)

module.exports = {
  site: {
    title: 'UNC Chapel Hill AAUP',
    description: 'UNC Chapel Hill chapter of the American Association of University Professors',
    url: 'https://unc-ch-aaup.org/',
    author: {
      name: 'UNC-CH AAUP',
      email: 'info@unc-ch-aaup.org',
      link: 'https://unc-ch-aaup.org/'
    },
    timestamp: {
      iso: ts.toISODate(),
      pretty: ts.toLocaleString(DateTime.DATE_FULL)
    },
    timezone
  },
  feed: {
    url: 'https://unc-ch-aaup.org/news',
    image: 'favicon-32x32.png',
    favicon: 'favicon.ico',
    atom: 'feed.atom'
  },
  build: {
    outputPath: './site',
    recentPosts: 3,
    feedPosts: 10,
    postHour: 8
  }
}
