import {readFile,mkdir,writeFile} from 'node:fs/promises';
const files=JSON.parse(await readFile(new URL('./app-source.json',import.meta.url),'utf8'));
for(const [name,content] of Object.entries(files)){
 if(!/^(src|public)\/[a-zA-Z0-9._-]+$/.test(name))throw Error('Invalid source path');
 const target=new URL('./'+name,import.meta.url);
 await mkdir(new URL('./'+name.split('/')[0]+'/',import.meta.url),{recursive:true});await writeFile(target,content,'utf8');
}
await import('./src/server.js');
