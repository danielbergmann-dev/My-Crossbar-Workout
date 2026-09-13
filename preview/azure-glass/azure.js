// Azure Glass test surface. Training data uses its own storage key in app.js.
const $ag = id => document.getElementById(id);
const hero = document.querySelector('.hero');
hero.querySelector('.brand').textContent='CROSSBAR / AZURE GLASS';
hero.querySelector('h1').textContent='Dein Training. Dein Moment.';
hero.querySelector('p').textContent='Schritt für Schritt stärker werden.';
const azureTop = document.createElement('div'); azureTop.className='topline';
hero.prepend(azureTop); azureTop.append(hero.querySelector('.brand'));
azureTop.insertAdjacentHTML('beforeend','<button class="btn s" onclick="openSettings()" aria-label="Einstellungen öffnen">⚙ Einstellungen</button>');
const bar=document.createElement('div');bar.className='testbar';
bar.innerHTML='<span><b>Design-Test</b> · Eigene Trainingsdaten</span><a href="../../">Zur bisherigen App ↗</a>';
hero.before(bar);
const plan=document.createElement('section'); plan.id='plan'; plan.className='section';
plan.innerHTML='<div class="pageintro"><div class="kicker">Dein Weg</div><h2>Dein 8-Wochen-Plan</h2><p>Phasen, Trainingstage und deine nächsten Einheiten.</p></div>';
$ag('home').after(plan);
plan.append($ag('weeks').closest('.card'),$ag('roadWeek').closest('.card'));
const home=$ag('home'),first=home.querySelector('.grid.two'); first.className='home-grid';
first.children[0].classList.add('today-card');
first.children[0].querySelectorAll('.actions button:not(#todayBtn)').forEach(x=>x.remove());
const overview=first.children[1];
overview.insertAdjacentHTML('beforeend','<button class="btn s" onclick="tab(\'plan\')">Gesamten Plan ansehen →</button>');
const counters=$ag('st1').closest('.grid'); $ag('progress').prepend(counters); counters.style.marginTop='0';
const lower=document.createElement('div'); lower.className='home-lower';home.append(lower);
lower.append($ag('ready').closest('.card'),$ag('nextRec').closest('.card'));
const transfer=document.createElement('details');transfer.className='test-import';
transfer.innerHTML='<summary>Trainingsstand in die Testversion übernehmen</summary><p class="muted">Übernimm eine Kopie aus diesem Browser oder importiere dein Laptop-Backup. Änderungen in dieser Testversion bleiben getrennt.</p><div class="actions"><button class="btn s" id="copyOriginal">Stand aus bisheriger App kopieren</button><button class="btn s" onclick="document.getElementById(\'imp\').click()">Backup importieren</button></div><p class="meta" id="transferStatus" role="status"></p>';
home.prepend(transfer);
const nav=document.querySelector('.nav');nav.innerHTML=[['home','⌂','Heute'],['training','▷','Training'],['plan','▦','Plan'],['progress','↗','Verlauf'],['library','☷','Übungen']].map(([id,s,t])=>`<button data-tab="${id}" class="${id==='home'?'on':''}"><span class="navsymbol" aria-hidden="true">${s}</span>${t}</button>`).join('');
nav.querySelectorAll('button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
$ag('library').querySelector('.card').insertAdjacentHTML('beforeend','<button class="btn s" onclick="tab(\'wissen\')">RIR & Bandwissen →</button>');
$ag('wissen').insertAdjacentHTML('afterbegin','<button class="btn s" onclick="tab(\'library\')">← Übungen</button>');
const trainingIntro=$ag('training').querySelector('.card');
trainingIntro.querySelector('p').textContent='Workout wählen, Übung öffnen und deine Sätze eintragen. Technik und Videos findest du direkt bei der Übung.';
trainingIntro.querySelector('h2').textContent='Zeit für dein Training';
const baseCard=card;
card=function(id,w,i,lib=false){
 const holder=document.createElement('div');holder.innerHTML=baseCard(id,w,i,lib);
 const body=holder.querySelector('.body');
 if(!lib){
  const guidance=document.createElement('details');guidance.className='technique';guidance.innerHTML='<summary>Aufbau, Technik & Video</summary><div class="technique-inner"></div>';
  const inner=guidance.lastElementChild;
  Array.from(body.children).filter(el=>!el.matches('.sets,.sethead,hr,.call.ok')).forEach(el=>inner.append(el));
  body.append(guidance);body.querySelector('hr')?.remove();
  holder.querySelectorAll('.set').forEach((row,n)=>{
   row.querySelector('input:not(.check)').setAttribute('aria-label',`${E[id].short}, Satz ${n+1}: Wiederholungen`);
   row.querySelector('input:not(.check)').type='number';row.querySelector('input:not(.check)').min='1';
   row.querySelectorAll('select').forEach((sel,j)=>sel.setAttribute('aria-label',`${E[id].short}, Satz ${n+1}: ${j===0?'Bandkombination':'RIR'}`));
   row.querySelector('.check').setAttribute('aria-label',`${E[id].short}, Satz ${n+1} erledigt`);
  });
 }
 return holder.innerHTML;
};
// Validate imports before replacing test state. Also rejects ChatGPT reports.
function validBackup(d){return d&&Number.isInteger(d.week)&&d.week>=1&&d.week<=8&&Array.isArray(d.logs)&&d.logs.every(l=>l&&['A','B'].includes(l.workout)&&Number.isFinite(Date.parse(l.date))&&l.entries&&typeof l.entries==='object')&&d.settings&&Array.isArray(d.settings.days)&&d.settings.days.length>0&&d.settings.days.every(x=>Number.isInteger(x)&&x>=0&&x<=6)&&d.draft&&typeof d.draft==='object'&&!Array.isArray(d.draft);}
function installTestBackup(d){
 if(!validBackup(d))throw new Error('Bitte ein vollständiges Crossbar-Backup wählen, keinen Auswertungsbericht.');
 if((S.logs.length||Object.keys(S.draft).length)&&!confirm('Vorhandene Testdaten durch dieses Backup ersetzen?'))return false;
 const clean=JSON.parse(JSON.stringify(d));const previous=S;
 try{S=clean;S.prs=S.prs||{};S.ready=S.ready||{energy:3,sleep:3,sore:3};rebuildPrs();save();render();}catch(e){S=previous;save();render();throw e;}
 $ag('transferStatus').textContent=S.logs.length+' Einheit(en) in die Testversion übernommen.';
 return true;
}
$ag('copyOriginal').onclick=()=>{try{const raw=localStorage.getItem('crossbarCoachWeb');if(!raw){$ag('transferStatus').textContent='Hier ist noch kein Stand der bisherigen App vorhanden. Bitte das Laptop-Backup importieren.';return;}installTestBackup(JSON.parse(raw));}catch(e){alert(e.message);}};
imp.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{installTestBackup(JSON.parse(await f.text()));}catch(e){alert(e.message||'Backup konnte nicht gelesen werden.');}finally{e.target.value='';}};
// Escape user-entered values used by the inherited HTML renderer.
const originalSd=sd;
sd=function(k,n,f,v){if(f==='reps'&&v!==''&&(!Number.isInteger(Number(v))||Number(v)<1||Number(v)>999)){alert('Bitte 1 bis 999 Wiederholungen eingeben.');return;}originalSd(k,n,f,v);};
const oldShow=showWorkout;showWorkout=function(w){oldShow(w);const el=$ag('work'+w).querySelector('.exercise:not(.completed)')||$ag('work'+w).querySelector('.exercise');if(el)el.open=true;};
// Saved sessions must not share mutable set objects with the next workout.
confirmFinish=function(){const w=pendingWorkout;if(!w)return;const ids=w==='A'?A:B;
 if(!ids.some(id=>(S.draft[S.week+'-'+w+'-'+id]?.sets||[]).some(doneSet))){alert('Bitte zuerst mindestens einen Satz eintragen und abhaken.');return;}
 const minutes=Number(durationInput.value);if(!Number.isFinite(minutes)||minutes<1||minutes>240){alert('Bitte eine Dauer zwischen 1 und 240 Minuten eingeben.');return;}
 const entries={};ids.forEach(id=>entries[id]=JSON.parse(JSON.stringify(S.draft[S.week+'-'+w+'-'+id]||{})));
 S.logs.unshift({date:new Date().toISOString(),week:S.week,workout:w,entries,duration:minutes,feeling:+feelInput.value||3,readiness:{...S.ready}});
 ids.forEach(id=>delete S.draft[S.week+'-'+w+'-'+id]);rebuildPrs();save();closeFinish();render();tab('home');};
document.querySelectorAll('.modal').forEach(m=>{m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label',({timer:'Satzpause',settings:'Einstellungen',finishModal:'Einheit abschließen'})[m.id]||'Dialog');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTimer();closeSettings();closeFinish();}});
render();
