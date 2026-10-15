import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
const jsFiles=['firebase-config.js','cms.js','public.js','admin.js','build.mjs'];
function check(file){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)throw new Error('Syntax check failed: '+file+'\n'+(result.stderr||result.error||''));}
for(const file of jsFiles)check(file);
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'portfolio-check-'));
try{
  for(const name of ['index.html','admin.html']){
    const html=await fs.readFile(name,'utf8');
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    if(new Set(ids).size!==ids.length)throw new Error('Duplicate HTML IDs in '+name);
    const refs=[...html.matchAll(/\bhref="#([^"]+)"/g)].map(m=>m[1]);
    if(refs.some(id=>!ids.includes(id)))throw new Error('Missing local anchor in '+name);
    let number=0;
    for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
      if(!match[2].trim())continue;
      const file=path.join(temp,name+'-'+(number++)+(/type="module"/.test(match[1])?'.mjs':'.cjs'));
      await fs.writeFile(file,match[2]);check(file);
    }
  }
}finally{await fs.rm(temp,{recursive:true,force:true});}
console.log('Source syntax and HTML anchor checks passed. Browser/Firebase behavior still requires testing.');
