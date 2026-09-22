// Comprime (usa .jpg já gerados pelo ffmpeg) e injeta as fotos no form-demo.html
const fs=require('fs'),path=require('path');
const HERE=__dirname, FORM=path.join(HERE,'..','form-demo.html');
const nomes=['rcasa','rarea','rgym','rgourmet'];
const fotos={};
let total=0;
for(const n of nomes){
  const f=path.join(HERE,n+'.jpg');
  if(!fs.existsSync(f)){console.log('FALTA',n);continue}
  const b=fs.readFileSync(f);
  fotos[n]='data:image/jpeg;base64,'+b.toString('base64');
  total+=b.length;
  console.log(n,(b.length/1024|0)+'KB');
}
let s=fs.readFileSync(FORM,'utf8');
const bloco='/*FOTOS_INICIO*/const FOTOS='+JSON.stringify(fotos)+';/*FOTOS_FIM*/';
s=s.replace(/\/\*FOTOS_INICIO\*\/[\s\S]*?\/\*FOTOS_FIM\*\//,bloco);
fs.writeFileSync(FORM,s);
console.log('total fotos:',(total/1024|0)+'KB · html:',(s.length/1024|0)+'KB');
