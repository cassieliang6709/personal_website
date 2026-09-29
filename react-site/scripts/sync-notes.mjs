// Copy chapters from the llm-study-notes repo (the source of truth) into src/notes/.
// Usage: npm run sync-notes [-- /path/to/llm-study-notes]
import {cpSync,existsSync,mkdirSync,readdirSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';

const repo=resolve(process.argv[2]??new URL('../../../llm-study-notes',import.meta.url).pathname);
const from=join(repo,'notes'),to=new URL('../src/notes',import.meta.url).pathname;
if(!existsSync(from))throw new Error(`notes not found: ${from}`);
rmSync(to,{recursive:true,force:true});mkdirSync(to,{recursive:true});
const files=readdirSync(from).filter(f=>/^\d{2}-.+\.md$/.test(f)).sort();
for(const f of files)cpSync(join(from,f),join(to,f));
console.log(`synced ${files.length} chapters from ${from}`);
