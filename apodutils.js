var fs = require("fs");
var https = require("https");
var fetch = require("node-fetch");

const API_KEY = fs.readFileSync('API_KEY', { encoding: 'utf-8', flag: 'r' });
const APOD_URL = `https://api.nasa.gov/planetary/apod`
const ARCHIVE_DIR = '/tmp/apod-cache/'
if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR)

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0]
}

function cacheAPOD(apod) {
	apodString = JSON.stringify(apod, null, 2)
	filename = ARCHIVE_DIR + apod.date + '.json'
	if (!fs.existsSync(filename)) fs.writeFileSync(filename, apodString)
	return filename
}

async function getAPOD(date=new Date()) {
  let dateISO = formatDate(date)
  let apod = {}
  console.log(dateISO)
  if (fs.existsSync(ARCHIVE_DIR + dateISO + '.json')) {
  	let apodString = fs.readFileSync(ARCHIVE_DIR + dateISO + '.json',
  									{ encoding: 'utf-8', flag: 'r' })
  	apod = JSON.parse(apodString)
  } else {
  	let res = await fetch(`${APOD_URL}?api_key=${API_KEY}&date=${dateISO}`);
	apod = await res.json();
	cacheAPOD(apod);
  }
  if (!apod) { // if apod is empty or not available yet (early morning hours)
  	date.setDate(date.getDate() - 1);
  	apod = await getAPOD(date);
  }
  return apod
}

module.exports = { getAPOD, formatDate }
