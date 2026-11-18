import { createServer } from 'node:http';
import { serveSite } from './server.mjs';
createServer(serveSite).listen(Number(process.env.PORT||3000),'0.0.0.0');
