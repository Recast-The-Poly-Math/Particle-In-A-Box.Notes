const express=require('express');
const {execFile}=require('child_process');
const path=require('path');
const fs=require('fs');
const app=express();
const PORT=process.env.PORT||3000;
const SOURCE=path.join(__dirname,'game.cpp');
const PROGRAM=path.join(__dirname,'game');
app.use(express.json({limit:'4kb'}));
app.use(express.static(path.join(__dirname,'public')));
function compile(cb){execFile('g++',['-std=c++17','-O2',SOURCE,'-o',PROGRAM],{timeout:10000,maxBuffer:1048576},cb);}
app.post('/api/compile',(req,res)=>compile((err,out,stderr)=>err?res.status(500).json({ok:false,output:stderr||err.message}):res.json({ok:true,output:'Compilation successful.'})));
app.post('/api/run',(req,res)=>{
 const input=typeof req.body.input==='string'?req.body.input:'';
 if(!/^\s*[0-3\s]*$/.test(input)||input.length>100)return res.status(400).json({ok:false,output:'Only game choices 0, 1, 2, and 3 are allowed.'});
 const run=()=>{const child=execFile(PROGRAM,[],{timeout:2000,maxBuffer:65536},(err,out,stderr)=>{if(err&&err.killed)return res.status(408).json({ok:false,output:'Program stopped after time limit.\n'+out});if(err&&!out)return res.status(500).json({ok:false,output:stderr||err.message});res.json({ok:true,output:out+(stderr||'')});});child.stdin.end(input+'\n0\n');};
 if(!fs.existsSync(PROGRAM))compile((err,out,stderr)=>err?res.status(500).json({ok:false,output:stderr||err.message}):run());else run();
});
compile((err,out,stderr)=>{if(err)console.error(stderr||err.message);app.listen(PORT,()=>console.log('Rock Paper Scissors server on '+PORT));});
