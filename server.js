import express from 'express';

import api from './api';
import config from './config';

const server = express();

server.set('view engine', 'pug');

server.use(express.static('public'));
server.use('/api', api);

server.get('/', (req, res) => {
  res.render('index');
});

server.listen(config.port, config.host, () => {
  console.info('express is listening on port ', config.port);
});
