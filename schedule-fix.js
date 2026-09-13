// Crossbar Coach 3.6 – date-aware schedule layer
(function(){
  function sameLocalDay(value, ref){
    const a=new Date(value), b=ref||new Date();
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }
  function fmtDate(d){
    if(!d)return 'noch offen';
    return new Intl.DateTimeFormat('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'}).format(d).replace(',','');
  }
  function todayLogs(){
    const now=new Date();
    return (S.logs||[]).filter(l=>sameLocalDay(l.date,now));
  }
  function scheduledDatesFrom(start,count,includeStart){
    const out=[];
    const base=new Date(start.getFullYear(),start.getMonth(),start.getDate(),12,0,0,0);
    for(let i=includeStart?0:1;i<40 && out.length<count;i++){
      const d=new Date(base); d.setDate(base.getDate()+i);
      if((S.settings.days||[]).includes(d.getDay())) out.push(d);
    }
    return out;
  }
  function nextScheduledDate(){
    const doneToday=todayLogs().length>0;
    return scheduledDatesFrom(new Date(),1,!doneToday)[0]||null;
  }

  // Startseite: eine heute bereits gespeicherte Einheit gilt für heute als erledigt.
  today=function(){
    const now=new Date();
    const logsToday=todayLogs();
    const plannedToday=(S.settings.days||[]).includes(now.getDay());
    const n=nextWorkout();
    const nextDate=nextScheduledDate();

    if(logsToday.length){
      const done=logsToday[0].workout||'–';
      todayTitle.textContent='Training erledigt ✓';
      todayText.textContent=`Workout ${done} wurde heute gespeichert. Nächstes geplantes Workout: ${n}${nextDate?' am '+fmtDate(nextDate):''}.`;
      todayBtn.textContent=`Workout ${n} ansehen`;
      todayBtn.onclick=()=>showWorkout(n);
    }else if(plannedToday){
      todayTitle.textContent='Workout '+n;
      todayText.textContent='Heute ist dein geplanter Krafttag. Nächstes Workout: '+n+'.';
      todayBtn.textContent='Workout '+n+' öffnen';
      todayBtn.onclick=()=>showWorkout(n);
    }else{
      todayTitle.textContent='Regeneration';
      todayText.textContent=`Heute ist laut Wochenplan Ruhetag. Nächstes geplantes Workout: ${n}${nextDate?' am '+fmtDate(nextDate):''}.`;
      todayBtn.textContent='Workout '+n+' heute trotzdem trainieren';
      todayBtn.onclick=()=>showWorkout(n);
    }
    dayChip.textContent=(S.settings.days||[]).length+'× Kraft/Woche';
    levelChip.textContent=S.settings.level==='advanced'?'Fortgeschritten · Crossbar neu':'Einsteiger';
  };

  // Fortschritt folgt der tatsächlich in den Einstellungen gewählten Wochenfrequenz.
  stats=function(){
    st1.textContent=S.logs.length;
    st2.textContent=S.logs.reduce((a,l)=>a+(l.duration||0),0)+' min';
    st3.textContent=Object.keys(S.prs||{}).length;
    const goal=Math.max(1,(S.settings.days||[]).length);
    const c=S.logs.filter(l=>l.week===S.week).length;
    wp.style.width=Math.min(100,c/goal*100)+'%';
    wpt.textContent=c+' Einheiten absolviert · Wochenziel '+goal;
    if(typeof reportHint!=='undefined'&&reportHint)reportHint.innerHTML='Aktuell sind <b>'+S.logs.length+'</b> gespeicherte Einheiten für eine Auswertung vorhanden.';
  };

  // Roadmap berücksichtigt Frequenz UND Kalenderdatum statt nur A/B umzuschalten.
  roadmap=function(){
    const goal=Math.max(1,(S.settings.days||[]).length);
    const current=[...S.logs].filter(l=>l.week===S.week).reverse();
    const completed=current.filter(l=>l.workout==='A'||l.workout==='B');
    const doneToday=todayLogs().length>0;
    const remaining=Math.max(0,goal-completed.length);
    const futureDates=scheduledDatesFrom(new Date(),remaining,!doneToday);
    const slots=completed.map((l,i)=>({w:l.workout,done:true,label:'Einheit '+(i+1),date:new Date(l.date)}));
    let n=nextWorkout();
    for(let i=0;i<remaining;i++){
      slots.push({w:n,done:false,label:'Einheit '+(slots.length+1),date:futureDates[i]||null});
      n=n==='A'?'B':'A';
    }
    roadWeek.innerHTML=slots.map((x,i)=>`<div class="routeStep ${x.done?'done':(!x.done&&i===completed.length?'next':'')}"><span class="meta">${x.label}</span><b>${x.w}${x.done?' ✓':''}</b><span class="meta">${x.done?'erledigt '+fmtDate(x.date):(i===completed.length?'als Nächstes · ':'danach · ')+(x.date?fmtDate(x.date):'Termin offen')}</span></div>`).join('');

    const nd=nextScheduledDate();
    if(doneToday){
      roadNow.innerHTML=`<b>Heute erledigt.</b> Nächste Einheit: Workout ${nextWorkout()}${nd?' am '+fmtDate(nd):''}. ${completed.length} von ${goal} geplanten Einheiten in Woche ${S.week} erledigt.`;
    }else{
      roadNow.innerHTML=`<b>Nächste Einheit: Workout ${nextWorkout()}${nd?' am '+fmtDate(nd):''}.</b> ${completed.length} von ${goal} geplanten Einheiten in Woche ${S.week} erledigt.`;
    }

    const phases=[['W1','Kalibrierung'],['W2–4','Aufbau'],['W5–7','Progression'],['W8','Entlastung']];
    const active=S.week===1?0:S.week<=4?1:S.week<=7?2:3;
    phaseRoad.innerHTML=phases.map((x,i)=>`<div class="phaseBox ${i===active?'active':''}"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');

    allWeeks.innerHTML=Array.from({length:8},(_,i)=>{
      const w=i+1;
      const start=((w-1)*goal)%2===0?'A':'B';
      let cur=start, seq=[];
      for(let j=0;j<goal;j++){seq.push(cur);cur=cur==='A'?'B':'A';}
      return `<div class="weekSeq ${w===S.week?'active':''}"><b>Woche ${w}</b>${seq.join(' · ')}</div>`;
    }).join('');
  };

  // Die neuen Funktionen sofort auf den bereits gerenderten Bildschirm anwenden.
  if(typeof render==='function') render();
})();
