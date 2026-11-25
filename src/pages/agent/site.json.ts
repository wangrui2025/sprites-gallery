import type { APIRoute } from 'astro';
import {readSite} from '../../lib/agent-reader';
export const GET: APIRoute = async () => new Response(JSON.stringify(await readSite(),null,2)+'\n',{headers:{'Content-Type':'application/json; charset=utf-8'}});
