import express from "express";
import helmet from "helmet";
import { timingSafeEqual } from "node:crypto";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
const app=express(); app.disable("x-powered-by"); app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"12kb"})); app.use(express.static("public"));
const PORT=Number(process.env.PORT||10000), URL=process.env.LIVEKIT_URL||"", KEY=process.env.LIVEKIT_API_KEY||"", SECRET=process.env.LIVEKIT_API_SECRET||"", HOST=process.env.HOST_ACCESS_PASSWORD||"";
const equal=(a,b)=>{const x=Buffer.from(String(a||"")),y=Buffer.from(String(b||""));return x.length>0&&x.length===y.length&&timingSafeEqual(x,y)};
const valid=(x,n=80)=>typeof x==="string"&&x.trim().length>0&&x.trim().length<=n;
app.get("/health",(_,r)=>r.json({ok:true,app:"LOS REYES DEL TRUCO"}));
app.get("/api/status",(_,r)=>r.json({livekitConfigured:!!(URL&&KEY&&SECRET),hostConfigured:!!HOST}));
app.post("/api/token",async(req,res)=>{try{
 if(!URL||!KEY||!SECRET)return res.status(503).json({error:"Falta configurar LiveKit en el servidor."});
 const {room,identity,role}=req.body||{};
 if(!valid(room)||!valid(identity,60)||!["guest","host"].includes(role))return res.status(400).json({error:"Sala, nombre o rol inválido."});
 if(role==="host"&&(!HOST||!equal(req.get("X-Host-Password"),HOST)))return res.status(401).json({error:"Contraseña del anfitrión incorrecta."});
 const t=new AccessToken(KEY,SECRET,{identity:identity.trim(),ttl:"2h",metadata:JSON.stringify({role})});
 t.addGrant({roomJoin:true,room:room.trim(),canSubscribe:true,canPublish:true,canPublishData:true});
 if(role==="host")t.addGrant({roomAdmin:true,roomCreate:true,roomList:true});
 res.set("Cache-Control","no-store").json({token:await t.toJwt(),serverUrl:URL});
 }catch(e){console.error(e?.message||e);res.status(500).json({error:"No se pudo crear el acceso."})}});
app.post("/api/kick",async(req,res)=>{try{
 if(!URL||!KEY||!SECRET)return res.status(503).json({error:"Falta configurar LiveKit."});
 if(!HOST||!equal(req.get("X-Host-Password"),HOST))return res.status(401).json({error:"Autorización del anfitrión inválida."});
 const {room,identity}=req.body||{};if(!valid(room)||!valid(identity,60))return res.status(400).json({error:"Sala o participante inválido."});
 await new RoomServiceClient(URL,KEY,SECRET).removeParticipant(room.trim(),identity.trim());res.json({ok:true,removed:identity.trim()});
 }catch(e){console.error(e?.message||e);res.status(502).json({error:"No se pudo expulsar al participante."})}});
app.listen(PORT,"0.0.0.0",()=>console.log("LOS REYES DEL TRUCO en puerto "+PORT));
