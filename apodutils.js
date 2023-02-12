var fs = require("fs");
var https = require("https");
var fetch = require("node-fetch");

const API_KEY = fs.readFileSync('API_KEY', { encoding: 'utf-8', flag: 'r' });
const APOD_URL = `https://api.nasa.gov/planetary/apod`

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0]
}

async function getAPOD(date=new Date()) {
  let dateISO = formatDate(date)
  const res = await fetch(`${APOD_URL}?api_key=${API_KEY}&date=${dateISO}`);
  const apod = await res.json();
  return apod
}

module.exports = { getAPOD, formatDate }