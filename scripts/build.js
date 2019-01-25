const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const marked = require('marked')
const frontMatter = require('front-matter')
const glob = require('glob')
const { DateTime } = require('luxon')

const config = require('../site.config')

const srcPath = './src'
const outPath = config.build.outputPath

fs.emptyDirSync(outPath)
fs.copy(`${srcPath}/assets`, `${outPath}/assets`)

const posts = glob.sync('**/*.md', {cwd: `${srcPath}/posts`})
config.posts = {recent: [], all: []}
posts.reverse().forEach((post, i) => {
  const postFilename = `${srcPath}/posts/${post}`
  const postData = frontMatter(fs.readFileSync(postFilename, 'utf-8'))
  const postDate = path.parse(post).name
  const postObject = {
    body: marked(postData.body),
    date: {
      iso: postDate,
      pretty: DateTime.fromISO(postDate).toLocaleString(DateTime.DATE_FULL)
    },
    ...postData.attributes
  }
  config.posts.all.push(postObject)
  if (i < config.build.recentPosts) {
    config.posts.recent.push(postObject)
  }
  if (i == config.build.recentPosts) {
    config.posts.more = postDate
  }
})

const pages = glob.sync('**/*.@(md|ejs|html)', {cwd: `${srcPath}/pages`})
pages.forEach(page => {
  const pagePath = path.parse(page)
  const destPath = path.join(outPath, pagePath.dir)
  fs.mkdirsSync(destPath)

  const pageFilename = `${srcPath}/pages/${page}`
  const pageData = frontMatter(fs.readFileSync(pageFilename, 'utf-8'))
  const pageConfig = {page: pageData.attributes, ...config}

  let main
  switch (pagePath.ext) {

  case '.md':
    main = marked(pageData.body)
    break

  case '.ejs':
    main = ejs.render(
      pageData.body,
      pageConfig,
      {filename: pageFilename}
    )
    break

  default:
    main = pageData.body
  }

  const layout = pageData.attributes.layout || 'default'
  const layoutFilename = `${srcPath}/layouts/${layout}.ejs`
  const layoutData = fs.readFileSync(layoutFilename, 'utf-8')
  const completePage = ejs.render(
    layoutData,
    {main, ...pageConfig},
    {filename: layoutFilename}
  )

  fs.writeFileSync(`${destPath}/${pagePath.name}.html`, completePage)
})
