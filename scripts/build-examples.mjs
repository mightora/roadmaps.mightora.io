import fs from 'node:fs';
import {validateRoadmap,validateReadiness,scheduleConflicts} from '../dist/model.mjs';
const files=fs.readdirSync('examples').filter(f=>f.endsWith('.json')).sort();
if(!files.length)throw Error('At least one example is required');
const seen=new Set(),examples=[];
for(const file of files){
 const e=JSON.parse(fs.readFileSync(`examples/${file}`,'utf8'));
 const fields=['id','name','title','description','roadmap'];
 if(!e||Object.keys(e).some(k=>!fields.includes(k)))throw Error(`${file}: unsupported fields`);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.id)||file!==`${e.id}.json`||seen.has(e.id))throw Error(`${file}: use a unique lowercase slug matching the filename`);
 seen.add(e.id);
 for(const [key,max] of [['name',80],['title',120],['description',400]])if(typeof e[key]!=='string'||!e[key].trim()||e[key].length>max)throw Error(`${file}: invalid ${key}`);
 validateReadiness(validateRoadmap(e.roadmap));
 if(e.title!==e.roadmap.title)throw Error(`${file}: title must match roadmap.title`);
 if(e.roadmap.activities.some(a=>a.status!=='Planned'))throw Error(`${file}: examples must start with Planned activities`);
 if(e.roadmap.activities.some(a=>scheduleConflicts(a,e.roadmap).length))throw Error(`${file}: fix prerequisite date overlaps`);
 examples.push(e);
}
const serialized=JSON.stringify(examples,null,2).replace(/</g,'\\u003c');
fs.writeFileSync('dist/examples.mjs',`// Generated from examples/*.json. Edit the source JSON files.\nconst examples=${serialized};\nexport const EXAMPLES=examples.map(({roadmap,...info})=>info);\nexport function exampleRoadmap(id){const e=examples.find(e=>e.id===id);if(!e)throw new Error('Choose a supported industry example.');return structuredClone(e.roadmap);}\n`);
console.log(`Validated and generated ${examples.length} community examples.`);
