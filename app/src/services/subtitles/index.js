import Settings from 'services/settings'

const OS 	 = require('opensubtitles-api')
const http = require('http')
const fs 	 = require('fs')

const OpenSubtitles = new OS({
  useragent: 'EasysubsNJ',
  ssl: true,
})

function get(id, filename, fpath, filesize) {
  return OpenSubtitles.search({
    sublanguageid: 'eng',
    path: fpath,
    filename,
    filesize,
    extensions: ['srt'],
  })
  .then(sub => {
    const hasUrl = Object.keys(sub).length
    sub.file = { id, name, path: fpath, hasUrl }
    return sub
  })
}

function getName(videoName) {
  const n = videoName.lastIndexOf('.')
  const videoNameWithoutExtension = n > -1 ? videoName.substr(0, n) : videoName
  const subExt = Settings.get().subExtension.value
  console.log(`${videoNameWithoutExtension}.${subExt}`);
  return `${videoNameWithoutExtension}.${subExt}`
}

function download(id, url, name) {
  // TODO: check if url is duplicated. Sometimes
	// OpenSubtitles is returning wrong sub in a TV Show
  const file = fs.createWriteStream(name)
  return new Promise(resolve => {
    http.get(url, response => {
      response.pipe(file)
      resolve('ready')
    })
  })
}

export default {
  get,
  getName,
  download,
}
