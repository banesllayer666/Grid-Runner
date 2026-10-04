const fs=require('fs');
function load(file){
  const js=fs.readFileSync(file,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
  const el=()=>new Proxy(function(){},{get:(t,k)=>k==='classList'?{add(){},remove(){},contains:()=>false,toggle(){}}:k==='style'?{}:k==='firstChild'?null:k==='value'?'1':el(),set:()=>true,apply:()=>el()});
  global.__mod=[];
  global.document={getElementById:()=>el(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>el(),addEventListener(){}};
  global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.location={reload(){}};global.confirm=()=>true;global.setTimeout=()=>{};global.URL={createObjectURL:()=>''};
  const api=(0,eval)(js.replace(/^const /gm,'var ').replace(/^let G=/m,'var G=')
   +'\n;({G:(typeof G!=="undefined"?G:undefined),PARTS:(typeof PARTS!=="undefined"?PARTS:undefined),CITIES:(typeof CITIES!=="undefined"?CITIES:undefined),RACES:(typeof RACES!=="undefined"?RACES:undefined),ALLRACES:(typeof ALLRACES!=="undefined"?ALLRACES:undefined),SLOT:(typeof SLOT!=="undefined"?SLOT:undefined),CFG:(typeof CFG!=="undefined"?CFG:undefined),HQB:(typeof HQB!=="undefined"?HQB:undefined),STAFF:(typeof STAFF!=="undefined"?STAFF:undefined),DRIVERS:(typeof DRIVERS!=="undefined"?DRIVERS:undefined),LENDERS:(typeof LENDERS!=="undefined"?LENDERS:undefined),DIFF:(typeof DIFF!=="undefined"?DIFF:undefined),buyPart:(typeof buyPart!=="undefined"?buyPart:undefined),inStock:(typeof inStock!=="undefined"?inStock:undefined),buyBM:(typeof buyBM!=="undefined"?buyBM:undefined),bmOpen:(typeof bmOpen!=="undefined"?bmOpen:undefined),bmPrice:(typeof bmPrice!=="undefined"?bmPrice:undefined),bmCatch:(typeof bmCatch!=="undefined"?bmCatch:undefined),stockQty:(typeof stockQty!=="undefined"?stockQty:undefined),bmQty:(typeof bmQty!=="undefined"?bmQty:undefined),sellStack:(typeof sellStack!=="undefined"?sellStack:undefined),sellWh:(typeof sellWh!=="undefined"?sellWh:undefined),installPart:(typeof installPart!=="undefined"?installPart:undefined),uninstall:(typeof uninstall!=="undefined"?uninstall:undefined),travelTo:(typeof travelTo!=="undefined"?travelTo:undefined),enterRace:(typeof enterRace!=="undefined"?enterRace:undefined),preRace:(typeof preRace!=="undefined"?preRace:undefined),repairPart:(typeof repairPart!=="undefined"?repairPart:undefined),upgradePart:(typeof upgradePart!=="undefined"?upgradePart:undefined),setStaff:(typeof setStaff!=="undefined"?setStaff:undefined),hireDriver:(typeof hireDriver!=="undefined"?hireDriver:undefined),takeLoan:(typeof takeLoan!=="undefined"?takeLoan:undefined),repayLoan:(typeof repayLoan!=="undefined"?repayLoan:undefined),endWeek:(typeof endWeek!=="undefined"?endWeek:undefined),beginGame:(typeof beginGame!=="undefined"?beginGame:undefined),carStats:(typeof carStats!=="undefined"?carStats:undefined),perfScore:(typeof perfScore!=="undefined"?perfScore:undefined),getPrice:(typeof getPrice!=="undefined"?getPrice:undefined),getSell:(typeof getSell!=="undefined"?getSell:undefined),wcap:(typeof wcap!=="undefined"?wcap:undefined),wusd:(typeof wusd!=="undefined"?wusd:undefined),wval:(typeof wval!=="undefined"?wval:undefined),tdebt:(typeof tdebt!=="undefined"?tdebt:undefined),deliverContract:(typeof deliverContract!=="undefined"?deliverContract:undefined),raceRuns:(typeof raceRuns!=="undefined"?raceRuns:undefined),SL:(typeof SL!=="undefined"?SL:undefined),titleNeed:(typeof titleNeed!=="undefined"?titleNeed:undefined),repairCost:(typeof repairCost!=="undefined"?repairCost:undefined),buyHQ:(typeof buyHQ!=="undefined"?buyHQ:undefined),buyTruck:(typeof buyTruck!=="undefined"?buyTruck:undefined),vaultMove:(typeof vaultMove!=="undefined"?vaultMove:undefined),sponsorTier:(typeof sponsorTier!=="undefined"?sponsorTier:undefined),F:(typeof F!=="undefined"?F:undefined),openModal:(typeof openModal!=="undefined"?openModal:undefined),staffWage:(typeof staffWage!=="undefined"?staffWage:undefined),seasonEnd:(typeof seasonEnd!=="undefined"?seasonEnd:undefined),arrivalChecks:(typeof arrivalChecks!=="undefined"?arrivalChecks:undefined),raceFee:(typeof raceFee!=="undefined"?raceFee:undefined),prizeMul:(typeof prizeMul!=="undefined"?prizeMul:undefined),sellAllProfit:(typeof sellAllProfit!=="undefined"?sellAllProfit:undefined),profitStacks:(typeof profitStacks!=="undefined"?profitStacks:undefined),investDev:(typeof investDev!=="undefined"?investDev:undefined),setIns:(typeof setIns!=="undefined"?setIns:undefined)})');
  // auto-resolve modal dialogs (customs bribes, ambushes, race setup)
  globalThis.openModal=function(t,b,acts){
    global.__mod.push(String(t));
    if(acts&&acts.length){const pick=acts[Math.floor(Math.random()*acts.length)];if(pick&&pick.fn)pick.fn();}
  };
  if(!api.F)api.F=()=>false;if(!api.inStock)api.inStock=()=>true;if(!api.stockQty)api.stockQty=()=>Infinity;if(!api.preRace)api.preRace=api.enterRace;if(!api.HQB)api.HQB={};
  return api;
}
function play(a,weeks,cov,greedy){
  const {G,PARTS,CITIES,RACES}=a;
  const S={bankrupt:false,wk:0,races:0,wins:0,dnf:0,pod:0,contracts:0,trades:0,tradeProfit:0,prize:0,apUsed:0,apTot:0,peakDebt:0,minNW:1e9,lowCash:0};
  for(let w=0;w<weeks;w++){
    S.wk=w+1;
    // staff/driver/HQ investment when rich
    if(G.cash>120000&&G.staff.eng<2){a.setStaff('eng',2);cov.staff=1;}
    if(G.cash>120000&&G.staff.mech<2){a.setStaff('mech',2);cov.staff=1;}
    if(G.cash>150000&&G.driver!=='star'){a.hireDriver('star');cov.driver=1;}
    if(a.F('hq'))Object.keys(a.HQB).forEach(k=>{if(!G.hq[k]&&G.cash>a.HQB[k].cost*3){a.buyHQ(k);cov.hq=1;}});
    // v3 folds trucks into HQ (no 'store' building); v2 keeps them under 'logi'
    if((a.F('logi')||(a.F('hq')&&!a.HQB.store))&&G.cash>120000&&(G.truck||0)<3){a.buyTruck();cov.logi=1;}
    if(a.F('vault')&&a.vaultMove&&G.cash>150000){a.vaultMove(50000);cov.vault=1;}
    // v4: insure once there is something worth insuring
    if(a.F('cover')&&a.setIns&&!G.ins&&G.cash>40000){a.setIns(1);cov.ins=1;}
    let plan=null;
    Object.keys(RACES).forEach(cid=>RACES[cid].forEach(r=>{
      if(!a.raceRuns(r))return;const fee=a.raceFee?a.raceFee(r):Math.round(r.prize[0]*a.CFG.raceFeePct),pm=a.prizeMul&&a.F('tiers')?a.prizeMul():1;
      const cost=(cid===G.city?0:CITIES[cid].tc)+fee,pf=a.perfScore(r),edge=pf.score-r.rival;
      const exp=(edge>14?r.prize[0]:edge>4?r.prize[1]:edge>-6?r.prize[2]:r.prize[4])*pm*(1-Math.max(0.02,(100-pf.rel)*0.0045));
      if(exp-cost>0&&G.cash>cost&&(!plan||exp-cost>plan.v))plan={cid,r,v:exp-cost,fee};}));
    let guard=0;
    while(G.ap>0&&guard++<40){
      const b={ap:G.ap,cash:G.cash,city:G.city,inst:G.inst.length};
      const c=G.contracts.find(c=>c.city===G.city&&G.wh.filter(i=>i.pid===c.pid&&i.cond>=c.mc).length>=c.qty);
      if(c){a.deliverContract(c.id);if(G.ap<b.ap){S.contracts++;cov.contract=1;continue;}}
      // v4: one bulk order when two or more stacks are in profit
      if(a.F('bulk')&&a.sellAllProfit&&G.ap>=2&&a.profitStacks().length>=2){const ps=a.profitStacks(),cost=G.wh.filter(i=>ps.includes(i.pid)).reduce((x,i)=>x+i.bp,0);
        a.sellAllProfit();if(G.ap<b.ap){S.trades++;S.tradeProfit+=(G.cash-b.cash)-cost;cov.bulk=1;continue;}}
      const sel=G.wh.filter(i=>a.getSell(G.city,i.pid,i.cond)>i.bp*1.10&&!G.contracts.some(x=>x.pid===i.pid));
      if(sel.length){const pid=sel[0].pid,cost=G.wh.filter(i=>i.pid===pid).reduce((x,i)=>x+i.bp,0);
        a.sellStack(pid);if(G.ap<b.ap){S.trades++;S.tradeProfit+=(G.cash-b.cash)-cost;continue;}}
      const ins=G.wh.find(i=>{const s=a.SLOT[i.pid],cur=G.inst.find(x=>a.SLOT[x.pid]===s);
        return (!cur||PARTS[i.pid].spd+PARTS[i.pid].rel>PARTS[cur.pid].spd+PARTS[cur.pid].rel)&&!G.contracts.some(x=>x.pid===i.pid);});
      if(ins&&G.wh.length>1){const s=a.SLOT[ins.pid],cur=G.inst.find(x=>a.SLOT[x.pid]===s);if(cur){a.uninstall(cur.uid);cov.uninstall=1;}a.installPart(ins.uid);if(G.inst.length!==b.inst)continue;}
      const worn=G.inst.find(i=>i.cond<40&&G.cash>a.repairCost(i)*4);
      if(worn){a.repairPart(worn.uid);if(G.ap<b.ap){cov.repair=1;continue;}}
      const up=G.cash>90000&&G.inst.find(i=>(i.lvl||0)<3);
      if(up){a.upgradePart(up.uid);if(G.ap<b.ap){cov.upgrade=1;continue;}}
      if(a.F('dev')&&a.investDev&&G.cash>100000&&(G.dev||0)<4){a.investDev();if(G.ap<b.ap){cov.dev=1;continue;}}
      if(plan){
        if(G.city!==plan.cid){a.travelTo(plan.cid);if(G.city!==b.city){cov.travel=1;continue;}}
        else if(G.raced<1){const n=G.raceHist.length;a.F('staged')?a.preRace(plan.r):a.enterRace(plan.r);
          if(G.raceHist.length>n){const r=G.raceHist[0];S.races++;cov.race=1;if(r.pos==='DNF')S.dnf++;else{if(r.pos===1){S.wins++;cov.win=1;}if(r.pos<=3)S.pod++;S.prize+=r.prize;}plan=null;continue;}plan=null;}
      }
      // grey market when unlocked and rich
      if(greedy&&G.greyOk&&G.cash>120000&&!G.wh.some(i=>PARTS[i.pid].grey)&&!G.inst.some(i=>PARTS[i.pid].grey)&&CITIES[G.city].grey){
        a.buyPart('grey_aero',1);if(G.cash<b.cash){cov.grey=1;continue;}}
      let got=false;
      for(const ct of G.contracts){const have=G.wh.filter(i=>i.pid===ct.pid&&i.cond>=ct.mc).length;if(have>=ct.qty)continue;
        if(a.inStock(G.city,ct.pid)&&a.getPrice(G.city,ct.pid)*(ct.qty-have)<G.cash*0.6&&a.wusd()+PARTS[ct.pid].sl<=a.wcap()){a.buyPart(ct.pid,1);if(G.cash<b.cash){got=true;break;}}}
      if(got)continue;
      let best=null;
      Object.keys(PARTS).forEach(pid=>{if(PARTS[pid].grey||!a.inStock(G.city,pid))return;const buy=a.getPrice(G.city,pid);
        Object.keys(CITIES).forEach(cid=>{if(cid===G.city)return;const m=(a.getSell(cid,pid,100)-buy)/buy;
          if(m>0.15&&buy<G.cash*0.5&&(!best||m>best.m))best={pid,m,cid};});});
      if(greedy&&a.bmOpen&&a.bmOpen()){const C=a.CFG,ec=(C.bmCond+C.bmCondMax)/2;Object.keys(PARTS).forEach(pid=>{if(PARTS[pid].grey||!a.bmQty(G.city,pid))return;const buy=a.bmPrice(G.city,pid);
        Object.keys(CITIES).forEach(cid=>{const m=(a.getSell(cid,pid,ec)*(1-a.bmCatch(cid)*C.bmFine)-buy)/buy;if(m>0.15&&buy<G.cash*0.5&&(!best||m>best.m))best={pid,m,cid,bm:1};});});}
      if(best&&a.wusd()+PARTS[best.pid].sl<=a.wcap()){const q=Math.min(greedy&&G.cash>200000?3:1,best.bm?a.bmQty(G.city,best.pid):a.stockQty(G.city,best.pid));if(best.bm){a.buyBM(best.pid,q);if(G.cash<b.cash){cov.bm=1;continue;}}else{a.buyPart(best.pid,q);if(G.cash<b.cash){cov.buy=1;continue;}}}
      const tgt=(G.contracts.find(c=>G.wh.filter(i=>i.pid===c.pid&&i.cond>=c.mc).length>=c.qty)||{}).city||(best&&best.cid);
      if(tgt&&tgt!==G.city&&G.cash>CITIES[tgt].tc*2){a.travelTo(tgt);if(G.city!==b.city){cov.travel=1;continue;}}
      break;
    }
    S.apUsed+=5-G.ap;S.apTot+=5;
    if(G.cash<2000){const amt=greedy?40000:20000;
      if(a.tdebt()<80000){a.takeLoan('bank',amt);cov.loan=1;}
      else if(greedy){a.takeLoan('consortium',amt);cov.shark=1;}}
    if(G.cash>250000&&G.loans.bank>0){a.repayLoan('bank',G.loans.bank);cov.repay=1;}
    if(a.F('shark')&&a.prizeMul&&G.loans.consortium>0&&G.cash>G.loans.consortium+20000){a.repayLoan('consortium',G.loans.consortium);cov.repay=1;}
    G.ap=0;a.endWeek();
    const nw=G.cash+(G.vault||0)+a.wval()-a.tdebt();
    S.peakDebt=Math.max(S.peakDebt,a.tdebt());S.minNW=Math.min(S.minNW,nw);if(G.cash<0)S.lowCash++;
    if(G.dead||nw<-50000){S.bankrupt=true;break;}
  }
  (global.__mod||[]).forEach(t=>{if(t.includes('Customs'))cov.customs=1;if(t.includes('ambush'))cov.ambush=1;if(t.includes('Season'))cov.season=1;if(t.includes('Disqual'))cov.fia=1;if(t.includes('🔥')||t.includes('Tax')||t.includes('injured')||t.includes('theft')||t.includes('scandal')||t.includes('recall')||t.includes('Windfall'))cov.disaster=1;if(t.includes('🔧'))cov.staged=1;if(t.includes('📻'))cov.calls=1;if(t.includes('enforcers'))cov.enforcers=1;if(t.includes('📰'))cov.story=1;});
  if(G.tier>0)cov.promote=1;
  if(G.sat&&Object.keys(G.sat).length)cov.route=1;if((G.events||[]).some(e=>e.ccat))cov.copycat=1;if((G.ai||[]).some(x=>x.edge>0))cov.nemesis=1;if(G.devB>0)cov.devpace=1;if(G.goal)cov.ultimatum=1;
  S.finalNW=G.cash+(G.vault||0)+a.wval()-a.tdebt();S.titles=G.titles;S.rep=G.rep;S.need=a.titleNeed(1);
  S.spd=a.carStats().spd;S.rel=a.carStats().rel;S.season=G.season;
  return S;
}
function run(file,n,weeks,diff,feat,greedy){const o=[],cov={};
  for(let i=0;i<n;i++){const a=load(file);
    a.beginGame({mode:'endless',diff,len:Math.min(weeks,40),players:[{name:'Bot',team:'B',perk:['','negotiator','hustler','banker','celebrity','mechanic','lucky'][i%7]}],feat:feat||{}});
    try{o.push(play(a,weeks,cov,greedy));}catch(e){console.log('CRASH',e.message);throw e;}}
  return{o,cov};}
function sum(res,label){const rs=res.o,n=rs.length,avg=f=>rs.reduce((x,r)=>x+f(r),0)/n,med=f=>{const v=rs.map(f).sort((x,y)=>x-y);return v[n>>1];};
  const R=rs.reduce((x,r)=>x+r.races,0),W=rs.reduce((x,r)=>x+r.wins,0),D=rs.reduce((x,r)=>x+r.dnf,0),P=rs.reduce((x,r)=>x+r.pod,0);
  console.log(`\n== ${label} (${n}×${rs[0].wk>0?'':''}) ==`);
  console.log(` BANKRUPT ${(rs.filter(r=>r.bankrupt).length/n*100).toFixed(0)}% | weeks survived med ${med(r=>r.wk)} | min NW med ${Math.round(med(r=>r.minNW)).toLocaleString()} | wks cash<0 ${avg(r=>r.lowCash).toFixed(1)}`);
  console.log(` NW med ${Math.round(med(r=>r.finalNW)).toLocaleString()} p10 ${Math.round(rs.map(r=>r.finalNW).sort((a,b)=>a-b)[Math.floor(n*0.1)]).toLocaleString()} p90 ${Math.round(rs.map(r=>r.finalNW).sort((a,b)=>a-b)[Math.floor(n*0.9)]).toLocaleString()}`);
  console.log(` races ${(R/n).toFixed(1)} win ${(W/R*100||0).toFixed(0)}% pod ${(P/R*100||0).toFixed(0)}% DNF ${(D/R*100||0).toFixed(0)}% | titles ${avg(r=>r.titles).toFixed(1)} seasons ${avg(r=>r.season).toFixed(1)} need ${rs[0].need}`);
  console.log(` prize ${Math.round(avg(r=>r.prize)).toLocaleString()} trade ${Math.round(avg(r=>r.tradeProfit)).toLocaleString()} contracts ${avg(r=>r.contracts).toFixed(1)} peakDebt ${Math.round(avg(r=>r.peakDebt)).toLocaleString()} AP ${(avg(r=>r.apUsed)/avg(r=>r.apTot)*100).toFixed(0)}%`);
  console.log(' coverage:',Object.keys(res.cov).sort().join(','));
  return rs;}
module.exports={run,sum};
