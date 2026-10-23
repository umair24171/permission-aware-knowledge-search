import {createHash} from 'node:crypto';
export function embed(text:string):number[]{const v=Array<number>(64).fill(0);for(const token of text.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]){const b=createHash('sha256').update(token).digest();v[b.readUInt16LE(0)%64]!+=1;}if(v.every(x=>x===0))v[0]=1;return v;}
export const vectorLiteral=(v:number[])=>'['+v.join(',')+']';
export const tokenHash=(s:string)=>createHash('sha256').update(s).digest('hex');
