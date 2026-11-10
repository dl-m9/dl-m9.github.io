import{t as e}from"./theme-CNAocXW-.js";import{t}from"./caption-DqABDJfa.js";import{n}from"./runplot-BZsI3Isv.js";var r=[12.14356,12.1432,12.14135,11.98406,11.57917,11.05,10.69993,10.26859,10.18441,9.964737,9.969545,9.774117,9.721378,9.554559,9.688431],i=[12.14356,12.1432,12.14139,11.98417,11.57913,11.05005,10.7,10.26847,10.18425,9.964581,9.968674,9.77368,9.721378,9.554193,9.688913],a={},o=1,s=!0,c=590,l=220,u=42,d=24,f=656,p=Math.max(...r.map((e,t)=>Math.abs(e-i[t])));console.assert(r.length===15&&i.length===15&&p.toFixed(5)===`0.00087`,`aligned parity losses`);function m(a){let o=n({series:[{v:i,color:e.accent,w:2}],xr:[1,15],yr:[9.4,12.3],xticks:[1,5,10,15],yticks:[10,11,12],w:c,h:l,padL:u,gutter:d,xlabel:``,extra:(t,n)=>r.map((r,i)=>`<circle cx="${t(i+1)}" cy="${n(r)}" r="3.5" fill="${e.bg}" stroke="${e.muted}" stroke-width="1.5"/>`).join(``)});a.innerHTML=`<div style="color:${e.ink};font-family:'${e.font}';width:${f}px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:14px">
      <span>Training loss</span>
      <span style="display:flex;gap:24px;align-items:center">
        <span style="color:${e.muted}"><span style="display:inline-block;width:7px;height:7px;border:1.5px solid ${e.muted};border-radius:50%;margin-right:7px"></span>Dense</span>
        <span style="color:${e.accent}"><span style="display:inline-block;width:20px;border-top:2px solid ${e.accent};vertical-align:middle;margin-right:7px"></span>1-expert MoE</span>
      </span>
    </div>
    ${o}
    <div style="text-align:center;font-size:12px;color:${e.muted};margin-top:4px">Steps after the shared checkpoint</div>
    ${t(`Continued from one dense checkpoint, our dense model and its 1-expert MoE copy reach nearly the same training loss at every step.`,f)}
  </div>`}export{o as duration,s as once,a as params,m as render};