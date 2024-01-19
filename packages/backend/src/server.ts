/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import { PORT } from './const';

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default server;
