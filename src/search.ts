import type {Database} from './db.js';import {embed,vectorLiteral,tokenHash} from './embedding.js';import type {AnswerProvider,Chunk} from './provider.js';
export class KnowledgeSearch{
 constructor(private db:Database,private provider:AnswerProvider){}
 async retrieve(user:string,query:string,limit=3,tokens:string[]=[]):Promise<Chunk[]>{
 if(!user||!query.trim()||query.length>10000||!Number.isInteger(limit)||limit<1||limit>20||tokens.length>20)throw new Error('Invalid retrieval input');
 return this.db.query<Chunk>(`
 WITH RECURSIVE ancestry AS (
   SELECT id AS doc,id,parent,inherit,active,ARRAY[id] AS path, true AS grants_enabled FROM source_nodes
   UNION ALL
   SELECT a.doc,n.id,n.parent,n.inherit,n.active,a.path||n.id,a.grants_enabled AND a.inherit
   FROM ancestry a JOIN source_nodes n ON n.id=a.parent WHERE NOT n.id=ANY(a.path)
 ), allowed AS (
   SELECT n.id FROM source_nodes n WHERE n.active
   AND NOT EXISTS(SELECT 1 FROM ancestry a WHERE a.doc=n.id AND NOT a.active)
   AND (
     EXISTS(SELECT 1 FROM ancestry a JOIN grants g ON g.node=a.id
       WHERE a.doc=n.id AND a.grants_enabled AND ((g.kind='user' AND g.principal=$1)
       OR (g.kind='group' AND EXISTS(SELECT 1 FROM memberships m WHERE m.user_id=$1 AND m.group_id=g.principal))))
     OR (n.link_shared AND EXISTS(SELECT 1 FROM links l WHERE l.node=n.id AND l.token_hash=ANY($2::text[])))
   )
 )
 SELECT c.id,c.node,c.body,(c.embedding <=> $3::vector) AS distance
 FROM chunks c JOIN source_nodes n ON n.id=c.node JOIN allowed a ON a.id=c.node
 WHERE c.version=n.version ORDER BY c.embedding <=> $3::vector,c.id LIMIT $4`,[user,tokens.map(tokenHash),vectorLiteral(embed(query)),limit]);
 }
 async answer(user:string,query:string,tokens:string[]=[]){const chunks=await this.retrieve(user,query,3,tokens);if(!chunks.length)return {text:'No accessible evidence.',chunks};return {text:await this.provider.answer(query,chunks),chunks};}
}
