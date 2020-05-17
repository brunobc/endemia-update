const express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  router = require('./routes/router'),
  database = require('./lib/database'),
  app = express(),
  port = 5000;

class Server {
  constructor() {
    this.initExpressMiddleWare();
    this.initCustomMiddleware();
    this.initDb();
    this.initRoutes();
    this.start();
  }

  start() {
    app.listen(port, (err) => {
      console.log(
        '[%s] Listening on http://localhost:%d',
        process.env.NODE_ENV,
        port
      );
    });
  }

  initExpressMiddleWare() {
    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(errorhandler());

    process.on('uncaughtException', (err) => {
      if (err) console.log(err, err.stack);
    });
  }

  initCustomMiddleware() {
    if (process.platform === 'win32') {
      require('readline')
        .createInterface({
          input: process.stdin,
          output: process.stdout,
        })
        .on('SIGINT', () => {
          console.log('SIGINT: Closing MongoDB connection');
          database.close();
        });
    }

    process.on('SIGINT', () => {
      console.log('SIGINT: Closing MongoDB connection');
      database.close();
    });
  }

  initDb() {
    database.open(() => {
      console.log('open db');
    });
  }

  initRoutes() {
    router.load(app, './controllers');

    // redirect all others to the index (HTML5 history)
    app.all('/*', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
    });
  }
}

var server = new Server();
