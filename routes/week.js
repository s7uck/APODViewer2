var express = require("express");
var cookieParser = require('cookie-parser');
var router = express.Router();
const { getAPOD, formatDate } = require('../apodutils');

router.get('/', async (req, res, nex) => {
  let date = req.query.date ? new Date(req.query.date) : new Date();
  let week = []
  let types = []
  for (i = 0; i < 7; i++) {
    date.setDate(date.getDate() - i);
    week[i] = await getAPOD(date);
    week[i]["copyright"] = week[i].copyright ?? "(none)"
    types[i] = week[i].hdurl ? 'img' : 'iframe'
  }
  res.locals.url = week[0].hdurl || week[0].url
  res.locals.settings = req.cookies
  res.render('week', { week, types });
});

module.exports = router
