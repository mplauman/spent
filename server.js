import express from 'express';
import bodyparser from 'body-parser';

import api from './api';
import config from './config';

const server = express();

server.set('view engine', 'pug');

server.use(express.static('public'));
server.use(bodyparser.json());
server.use('/api', api);

server.get('/', (req, res) => {
  res.render('index', {
    googleAppId: config.googleAppId,
    linkedinAppId: config.linkedinAppId
  });
});

server.listen(config.port, config.host, () => {
  console.info('express is listening on port ', config.port);
});
