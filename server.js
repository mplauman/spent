import express from 'express';

import config from './config';

const server = express();
server.set('view engine', 'pug');
server.get('/', (req, res) => render(res, 'index'));
server.listen(config.port, () => {
    console.info('express is listening on port ', config.port);
});

const render = (res, pageId) => {
    console.info('rendering', pageId);
    res.render(pageId, { pageId });
};
