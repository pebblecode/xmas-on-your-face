var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var ps = require('ps-node');
var rm = require('remove');
var fs = require('fs');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'pebblexmashackyeah',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/nice', function (req, res) {
  res.sendFile(__dirname + '/nice.html');
});

app.get('/naughty', function (req, res) {
  res.sendFile(__dirname + '/naughty.html');
});

app.post('/photo', function(req, res) {
  var photoDir = __dirname + '/public/photos';

  readyCamera(function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    takeAndDownloadPhoto(photoDir, function (err, file) {
      if (err) {
        return res.status(500).send(err);
      }

      req.session.file = file;
      return res.send();
    })
  });
});

app.listen(3000, function () {
  console.log('READY TO ROLL');
  console.log('==============');
  console.log('app running at localhost:3000');
});

function readyCamera(callback) {

  console.log('preparing camera...');

  var spawn = require('child_process').spawn;
  var ps = spawn('ps', ['x']);
  var grep = spawn('grep', ['PTPCamera']);

  var psError = '';
  var grepError = '';

  ps.stdout.on('data', function (data) {
    grep.stdin.write(data);
  });

  ps.stderr.on('data', function (data) {
    psError += data;
  });

  ps.on('close', function (code) {
    if (code !== 0) {
      return callback({process: 'ps', error: psError});
    }
    grep.stdin.end();
  });

  var ptp = '';
  grep.stdout.on('data', function (data) {
    ptp += data;
  });

  grep.stderr.on('data', function (data) {
    console.log('grep stderr', data);
    grepError += data;
  });

  grep.on('error', function (err) {
    console.log(err);
  })

  grep.on('close', function (code) {
    if (code === 1 && grepError === '' && ptp === '') {
      return kill(callback);
    }

    if (code === 0 && ptp.indexOf('/System/Library/Image Capture/Devices/PTPCamera.app') > -1) {
      return kill(callback);
    } else {
      if (code !== 0) {
        return callback({process: 'grep', error: grepError, code: code});
      }

      return callback();
    }
  });
}

function kill(callback) {

  console.log('kill PTPCamera...');

  var spawn = require('child_process').spawn;
  var killall = spawn('killall', ['PTPCamera']);
  var killallError = '';

  killall.stderr.on('data', function (data) {
    killallError += data;
  });
  killall.on('close', function (code) {
    if (code !== 0 && killallError.indexOf('No matching processes belonging to you were found') === -1) {
      return callback({process: 'killall', error: killallError});
    }

    return callback();
  });
}

function takeAndDownloadPhoto(dir, callback) {

  console.log('nearly there...');

  var file = dir + '/capt0000.jpg';
  fs.stat(file, function (err, stats) {

    if (stats && stats.isFile()) {
      console.log('deleting old photo...');

      rm.removeSync(file);
      var spawn = require('child_process').spawnSync;
      var gphoto = spawn('gphoto2', ['--capture-image-and-download', '-F', '1'], {
        cwd: dir,
        detached: true,
        stdio: ['inherit', 'inherit', 'inherit']
      });

      console.log('go go go...');
      return callback(null, file);
    }

    if (!stats && err && err.code === 'ENOENT') {
      var spawn = require('child_process').spawnSync;
      var gphoto = spawn('gphoto2', ['--capture-image-and-download', '-F', '1'], {
        cwd: dir,
        detached: true,
        stdio: ['inherit', 'inherit', 'inherit']
      });

      console.log('go go go...');
      return callback(null, file);
    }

    if (err) {
      return console.log('>', err);
    }
  });
}