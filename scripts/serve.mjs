import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist'),types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json','.xml':'application/xml','.md':'text/markdown','.csv':'text/csv','.txt':'text/plain'};
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const path=resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}const data=await readFile(path);res.writeHead(200,{'Content-Type':(types[extname(path)]||'application/octet-stream')+'; charset=utf-8'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(8080,'127.0.0.1',()=>console.log('Roadmaps: http://localhost:8080'));
