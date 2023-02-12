var express = require("express");
var router = express.Router();
const { getAPOD, formatDate } = require('../apodutils');

router.get('/', async (req, res, nex) => {
  let date = req.query.date ? new Date(req.query.date) : new Date();
  let apod = await getAPOD(date);
  apod["copyright"] = apod.copyright ?? "(none)"
  res.locals.type = apod.hdurl ? 'img' : 'iframe'
  res.locals.url = apod.hdurl || apod.url
  console.log(apod);
  res.render('astropix', apod);
});

module.exports = router