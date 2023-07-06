var fs = require("fs");
var https = require("https");
var fetch = require("node-fetch");

const API_KEY = fs.readFileSync('API_KEY', { encoding: 'utf-8', flag: 'r' });
const APOD_URL = `https://api.nasa.gov/planetary/apod`
const ARCHIVE_DIR = __dirname + '/archive/'

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0]
}

function cacheAPOD(apod) {
	apodString = JSON.stringify(apod, null, 2)
	filename = ARCHIVE_DIR + apod.date + '.json'
	fs.writeFileSync(filename, apodString)
}

async function getAPOD(date=new Date()) {
  let dateISO = formatDate(date)
  let apod = {}
  if (fs.existsSync(ARCHIVE_DIR + date)) {
  	let apodString = fs.readFileSync(ARCHIVE_DIR + date,
  									{ encoding: 'utf-8', flag: 'r' })
  	apod = JSON.parse(apodString)
  } else {
  	let res = await fetch(`${APOD_URL}?api_key=${API_KEY}&date=${dateISO}`);
	apod = await res.json();
	cacheAPOD(apod);
  }
  return apod
}

module.exports = { getAPOD, formatDate }
