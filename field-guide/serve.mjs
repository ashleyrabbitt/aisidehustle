import { createServer } from 'node:http';
import { serveStudio } from './handler.mjs';

const option = name => {
  const i=process.argv.indexOf(name);
  return i>=0 ? process.argv[i+1] : undefined;
};
const port=Number(option('--port') || process.env.PORT || 3000);
const host=option('--host') || '0.0.0.0';
createServer((req,res)=>serveStudio(req,res,()=>{
  res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
  res.end('Page not found');
})).listen(port,host,()=>console.info('AI Side Hustle field guide listening on '+port));
