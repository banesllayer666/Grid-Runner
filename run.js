#!/usr/bin/env node
// Headless balance simulator for Grid Runner.
// Usage: node run.js [file] [sessions] [weeks] [difficulty] [all|none] [greedy|safe]
//   node run.js index_v2.html 100 100 normal all greedy
const path=require('path');
const {run,sum}=require(path.join(__dirname,'bot.js'));
const [file='index.html',n='50',weeks='50',diff='normal',rules='none',style='greedy']=process.argv.slice(2);
// v2, v3 and v4 rule names; a file ignores flags it doesn't have
const FEATS=['customs','staged','hq','logi','rivals','vault','sponsors','traits','regs','encount','debt','calls','shark','tiers','intel','drvc','cover','route','nemesis','news','bulk','dev'];
const feat={};
if(rules!=='none')(rules==='all'?FEATS:rules.split(',')).forEach(k=>feat[k]=true);
const target=path.isAbsolute(file)?file:path.join(process.cwd(),file);
sum(run(target,+n,+weeks,diff,feat,style==='greedy'),`${path.basename(file)} ${diff} ${rules} ${style} — ${n} sessions x ${weeks} weeks`);
