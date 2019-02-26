require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var request = require('request');
var port = process.env.PORT || 3000;

var config = {
  user: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASSWORD,
  pw: process.env.PW,
  id: Number(process.env.RID),
}

//
//submit_button=Filters&action=ApplyTake&change_action=&submit_type=&blocked_service=&filter_web=&filter_policy=&filter_p2p=0&f_status=1&f_id=3&f_status1=enable&f_name=child-block-all&f_status2=deny&day_all=1&time_all=1&allday=
//submit_button=Filters&action=ApplyTake&change_action=&submit_type=&blocked_service=&filter_web=&filter_policy=&filter_p2p=0&f_status=0&f_id=3&f_status1=disable&f_name=child-block-all&f_status2=deny&day_all=1&time_all=1&allday=
//
function payload(enable) {
  return {
    submit_button: 'Filters',
    action: 'ApplyTake',
    change_action: '',
    submit_type: '',
    blocked_service: '',
    filter_web: '',
    filter_policy: '',
    filter_p2p: 0,
    f_status: enable ? 1 : 0,
    f_id: config.id,
    f_status1: enable ? 'enable' : 'disable',
    f_name: 'child-block-all',
    f_status2: 'deny',
    day_all: 1,
    time_all: 1,
    allday: '',
  };
}

function update(enable) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: `http://${config.user}:${config.password}@10.0.1.1/apply.cgi`,
      form: payload(enable),
    }, (error, response, body) => {
      if (error) reject(error);
      else resolve();
    })
  })
}

app.set('view engine', 'ejs');
app.use(express.urlencoded());

app.get('/', function (req, res) {
  res.render('index', {
    pw: '',
    error: '',
  });
});

app.post('/', async (req, res) => {

  if (req.body.pw !== config.pw) {
    res.render('index', {
      pw: '',
      error: 'error',
    });
    return;
  }
  try {
    const restrict = req.body.internetEnable !== 'enable';
    console.log(restrict ? 'restriciing internet...' : 'enabling internet...')
    update(restrict)
    res.render('index', {
      pw: req.body.pw,
      error: restrict ? "internet disabled" : "internet enabled",
    });
  } catch (e) {
    res.render('index', {
      pw: '',
      error: 'error',
    });
  }

});


http.listen(port, function () { console.log('listening on *:' + port); });

