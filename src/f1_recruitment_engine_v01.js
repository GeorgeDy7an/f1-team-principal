/* F1 Team Principal — recruitment and driver-world engine V0.1
 * Dynamic 22-seat grid, academy recruitment, retirements, AI replacements and newgens.
 * Potential, development ceilings and special templates never leave the internal world.
 */
(function (root) {
  'use strict';

  const ATTRS = ['pace','racecraft','consistency','tyre'];
  const HIDDEN_KEYS = ['potential','ceiling','legend','shadow','miracle','growthShape','archetype','tendency'];
  const F1_AGE_2026 = {
    'Max Verstappen':28,'Kimi Antonelli':19,'Charles Leclerc':28,'George Russell':28,
    'Lewis Hamilton':41,'Lando Norris':26,'Oscar Piastri':25,'Fernando Alonso':44,
    'Pierre Gasly':30,'Isack Hadjar':21,'Liam Lawson':24,'Carlos Sainz':31,
    'Alexander Albon':30,'Oliver Bearman':21,'Arvid Lindblad':18,'Esteban Ocon':29,
    'Gabriel Bortoleto':21,'Nico Hulkenberg':38,'Franco Colapinto':23,
    'Valtteri Bottas':36,'Sergio Perez':36,'Lance Stroll':27,
  };

  // Curated 21-and-under F2 shortlist. Lower-signal and over-age names are
  // intentionally omitted so the academy desk can mix these seeds with newgens.
  // Ratings are game data, not a public potential forecast.
  const F2_SEEDS = [
    f2('Nikola Tsolov','尼古拉·佐洛夫',19,'Bulgaria','Campos Racing',[82,78,76,73],['F2积分榜前列','多次赢得F2主赛','排位单圈速度受到关注'],[96,91,90,88],'raw_speed','precocious'),
    f2('Gabriele Minì','加布里埃莱·米尼',21,'Italy','MP Motorsport',[80,80,79,76],['F2积分榜前列','F2主赛获胜者','长距离发挥较为完整'],[93,93,92,90],'all_rounder','steady'),
    f2('Rafael Câmara','拉斐尔·卡马拉',21,'Brazil','Invicta Racing',[83,75,74,72],['F2积分榜前列','多场比赛展现强劲排位速度','拥有青年组别冠军履历'],[97,90,89,87],'raw_speed','steady'),
    f2('Alexander Dunne','亚历山大·邓恩',20,'Ireland','Rodin Motorsport',[81,76,70,71],['F2主赛获胜者','进攻性比赛风格鲜明','比赛稳定性仍有提升空间'],[96,91,87,87],'raw_speed','volatile'),
    f2('Noel León','诺埃尔·莱昂',21,'Mexico','Campos Racing',[76,74,72,70],['F2分站冠军','在混战中多次取得积分','缠斗判断是主要优势'],[89,90,88,86],'racecraft','steady'),
    f2('Laurens van Hoepen','劳伦斯·范胡彭',20,'Netherlands','TRIDENT',[74,72,73,71],['多次进入冲刺赛积分区','最近赛季完赛率较高','稳定性仍在持续改善'],[90,88,91,88],'consistent','late'),
    f2('Martinius Stenshorne','马蒂纽斯·斯滕斯霍恩',20,'Norway','Rodin Motorsport',[78,71,67,69],['F2主赛获胜者','排位速度表现突出','发挥具有明显波动性'],[95,88,86,86],'raw_speed','volatile'),
    f2('Tasanapol Inthraphuvasak','塔萨纳波尔·因特拉普瓦萨克',20,'Thailand','ART Grand Prix',[73,72,68,70],['F2多次登上领奖台','获得重要市场支持','后半程表现受到关注'],[89,88,86,88],'commercial','late'),
    f2('Oliver Goethe','奥利弗·歌德',21,'Germany','MP Motorsport',[76,71,68,69],['F2主赛获胜者','单圈速度偶有亮点','仍在寻找稳定的长距离表现'],[92,87,86,85],'raw_speed','volatile'),
    f2('Sebastián Montoya','塞巴斯蒂安·蒙托亚',21,'Colombia','PREMA Racing',[74,73,69,70],['多次从后排追回积分','拥有知名赛车家庭背景','商业关注与赛道评价并存'],[89,89,86,87],'commercial','steady'),
  ];

  const FIRST_NAMES = [
    ['Luca','卢卡'],['Matteo','马泰奥'],['Elias','埃利亚斯'],['Noah','诺亚'],['Hugo','雨果'],['Théo','泰奥'],
    ['Rafael','拉斐尔'],['Gabriel','加布里埃尔'],['Daniel','丹尼尔'],['Kaito','海斗'],['Kenji','健司'],['Arjun','阿琼'],
    ['Oliver','奥利弗'],['Jonas','约纳斯'],['Emil','埃米尔'],['León','莱昂'],['Santiago','圣地亚哥'],['Tomás','托马斯'],
    ['Niko','尼科'],['Felix','费利克斯'],['Mika','米卡'],['Oscar','奥斯卡'],['Tiago','蒂亚戈'],['Louis','路易'],
  ];
  const LAST_NAMES = [
    ['Kern','克恩'],['Moreau','莫罗'],['Valente','瓦伦特'],['Ibarra','伊瓦拉'],['Nakamura','中村'],['Meier','迈尔'],
    ['Lindström','林德斯特伦'],['Costa','科斯塔'],['Petrov','彼得罗夫'],['Novak','诺瓦克'],['Silva','席尔瓦'],['Weber','韦伯'],
    ['Rossi','罗西'],['Fischer','菲舍尔'],['Álvarez','阿尔瓦雷斯'],['Eriksen','埃里克森'],['Laurent','洛朗'],['Tanaka','田中'],
    ['Kapoor','卡普尔'],['Duarte','杜阿尔特'],['Kovács','科瓦奇'],['Nielsen','尼尔森'],['Marin','马林'],['Okafor','奥卡福'],
  ];
  const NATIONALITIES = ['Italy','France','Germany','Brazil','Spain','Japan','United Kingdom','Ireland','Norway','Sweden','Finland','Portugal','Mexico','Argentina','Australia','New Zealand','India','Thailand','Netherlands','Austria'];
  const ARCHETYPES = [
    ['raw_speed',23],['racecraft',18],['consistent',17],['tyre_specialist',14],['all_rounder',20],['commercial',8],
  ];
  const POTENTIAL_BANDS = [['limited',36],['f1_capable',42],['front_runner',18],['elite',4]];
  const GROWTH_SHAPES = [['precocious',23],['steady',48],['late',18],['volatile',11]];

  function f2(name,displayName,age,nationality,team,values,bullets,ceilings,archetype,growthShape) {
    return { name,displayName,zhName:displayName,age,nationality,series:'FIA Formula 2',juniorTeam:team,
      ratings:Object.fromEntries(ATTRS.map((key,index) => [key,values[index]])),bullets,
      developmentSpec:{ceilings:Object.fromEntries(ATTRS.map((key,index) => [key,ceilings[index]])),archetype,growthShape},
    };
  }

  function clamp(value,min,max) { return Math.max(min,Math.min(max,value)); }
  function slug(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function weightedPick(entries,random) {
    let cursor = random() * entries.reduce((sum,item) => sum + item[1],0);
    for (const item of entries) { cursor -= item[1]; if (cursor <= 0) return item[0]; }
    return entries[entries.length - 1][0];
  }
  function overall(ratings) { return ATTRS.reduce((sum,key,index) => sum + ratings[key] * [.5,.25,.15,.1][index],0); }
  function resolveId(state,idOrName) {
    if (!idOrName) return null;
    if (state.drivers[idOrName]) return idOrName;
    const found = Object.values(state.drivers).find(driver => driver.name === idOrName);
    return found ? found.id : null;
  }
  function teamNames(teams) { return teams.map(team => typeof team === 'string' ? team : team.team); }
  function stableHash(value) {
    let hash=2166136261;
    for (const char of String(value)) { hash^=char.charCodeAt(0); hash=Math.imul(hash,16777619); }
    return hash>>>0;
  }
  function generatedDisplayName(name) {
    const parts=String(name||'').split(' '),first=FIRST_NAMES.find(item=>item[0]===parts[0]),last=LAST_NAMES.find(item=>item[0]===parts[1]);
    return first&&last?`${first[1]}·${last[1]}${parts.length>2?' '+parts.slice(2).join(' '):''}`:name;
  }
  function displayNameFor(driver) {
    if (!driver) return '';
    if (driver.displayName||driver.zhName) return driver.displayName||driver.zhName;
    const seed=F2_SEEDS.find(item=>item.name===driver.name);
    if (seed) return seed.displayName;
    return driver.origin==='generated'?generatedDisplayName(driver.name):driver.name;
  }
  function statusFor(state,id) {
    for (const team of state.teams) if ((state.lineups[team] || []).includes(id)) return {role:'f1',team,status:'active'};
    for (const team of state.teams) if (state.academy[team] === id) return {role:'academy',team,status:'academy'};
    if (state.retired.includes(id)) return {role:'retired',team:null,status:'retired'};
    if ((state.departed || []).includes(id)) return {role:'departed',team:null,status:'departed'};
    return {role:'prospect',team:null,status:'available'};
  }

  function deterministicCandidateOrder(state,year,excluded) {
    const blocked=excluded||new Set();
    return (state.available||[]).filter(id=>!blocked.has(id)&&state.drivers[id]&&state.drivers[id].age<=21)
      .sort((a,b)=>{
        const da=state.drivers[a],db=state.drivers[b];
        const scoreA=overall(da.ratings)+(stableHash(`${year}:${a}`)%1700)/100;
        const scoreB=overall(db.ratings)+(stableHash(`${year}:${b}`)%1700)/100;
        return scoreB-scoreA||a.localeCompare(b);
      });
  }

  function migratePendingCandidates(state,pending) {
    if (!pending||!Number.isFinite(Number(pending.year))) return;
    const year=Number(pending.year),eligible=id=>state.drivers[id]&&(state.available||[]).includes(id)&&state.drivers[id].age<=21;
    const uniqueValid=list=>[...new Set(Array.isArray(list)?list:[])].filter(eligible);
    const stored=Array.isArray(pending.candidateBatches)?pending.candidateBatches:[];
    let first=uniqueValid(stored[0]||pending.candidateIds).slice(0,3);
    const firstBlocked=new Set(first);
    deterministicCandidateOrder(state,year,firstBlocked).some(id=>{if(first.length>=3)return true;first.push(id);firstBlocked.add(id);return false});
    let second=uniqueValid(stored[1]).filter(id=>!firstBlocked.has(id)).slice(0,3);
    const allBlocked=new Set([...first,...second]);
    deterministicCandidateOrder(state,year,allBlocked).some(id=>{if(second.length>=3)return true;second.push(id);allBlocked.add(id);return false});
    pending.candidateBatches=[first,second];
    pending.refreshUsed=!!pending.refreshUsed;
    pending.candidateBatchIndex=pending.refreshUsed&&second.length===3?1:0;
    pending.candidateIds=[...(pending.candidateBatchIndex===1?second:first)];
  }

  function migrateWorld(state) {
    if (!state||typeof state!=='object') return state;
    state.version=2;
    state.drivers=state.drivers||{};state.lineups=state.lineups||{};state.academy=state.academy||{};
    state.available=Array.isArray(state.available)?state.available:[];state.retired=Array.isArray(state.retired)?state.retired:[];
    state.departed=Array.isArray(state.departed)?state.departed:[];state.shortlist=Array.isArray(state.shortlist)?state.shortlist:[];
    state.transactions=Array.isArray(state.transactions)?state.transactions:[];state.processedOffseasons=state.processedOffseasons||{};
    state.generatedByYear=state.generatedByYear||{};state.nextGeneratedId=Math.max(1,Number(state.nextGeneratedId)||1);
    state.worldSecrets=state.worldSecrets||{};state.worldSecrets.profiles=state.worldSecrets.profiles||{};
    state.worldSecrets.generatedSerial=Math.max(0,Number(state.worldSecrets.generatedSerial)||0);
    Object.values(state.drivers).forEach(driver=>{driver.displayName=displayNameFor(driver);driver.zhName=driver.zhName||driver.displayName});
    migratePendingCandidates(state,state.pendingOffseason);
    return state;
  }

  function newWorld(f1Drivers,teams,random,startYear,options) {
    const year = startYear || 2026;
    const names = teamNames(teams);
    const state = {
      version:2,startYear:year,currentYear:year,ageYear:year,teams:names,
      drivers:{},lineups:Object.fromEntries(names.map(team => [team,[]])),academy:Object.fromEntries(names.map(team => [team,null])),
      available:[],retired:[],departed:[],shortlist:[],transactions:[],pendingOffseason:null,
      processedOffseasons:{},generatedByYear:{},nextGeneratedId:1,
      worldSecrets:{profiles:{},generatedSerial:0,legendSerial:8 + Math.floor(random() * 17)},
    };
    (f1Drivers || []).forEach(driver => {
      const id = driver.id || `f1:${slug(driver.name)}`;
      const age = driver.age == null ? (F1_AGE_2026[driver.name] == null ? 25 : F1_AGE_2026[driver.name] + (year - 2026)) : driver.age;
      const ratings = Object.fromEntries(ATTRS.map(key => [key,Math.round(driver[key]) ]));
      state.drivers[id] = {id,name:driver.name,displayName:driver.displayName||driver.zhName||driver.name,zhName:driver.zhName||driver.displayName||driver.name,age,nationality:driver.nationality || '',series:'Formula 1',origin:'f1_2026',createdYear:year,ratings,bullets:[`${year} Formula 1 正赛车手`],retiredYear:null};
      state.worldSecrets.profiles[id] = {ceilings:{...ratings},archetype:'established',growthShape:'steady',miracle:false};
      if (!state.lineups[driver.team]) state.lineups[driver.team] = [];
      state.lineups[driver.team].push(id);
    });
    const seeds = options && options.prospectSeeds || F2_SEEDS;
    seeds.forEach(seed => addSeedProspect(state,seed,year));
    const check = validateWorld(state);
    if (!check.ok) throw new Error('Invalid initial driver world: ' + check.errors.join('; '));
    return state;
  }

  function addSeedProspect(state,seed,year) {
    let id = `f2:${slug(seed.name)}`, suffix = 2;
    while (state.drivers[id]) id = `f2:${slug(seed.name)}-${suffix++}`;
    state.drivers[id] = {id,name:seed.name,displayName:seed.displayName||seed.zhName||seed.name,zhName:seed.zhName||seed.displayName||seed.name,age:seed.age + (year - 2026),nationality:seed.nationality,series:seed.series || 'FIA Formula 2',origin:'f2_seed',createdYear:year,ratings:{...seed.ratings},bullets:[...seed.bullets].slice(0,6),retiredYear:null};
    state.worldSecrets.profiles[id] = clone(seed.developmentSpec || {});
    state.available.push(id);
  }

  function publicMeta(state,idOrName) {
    migrateWorld(state);
    const id = resolveId(state,idOrName);
    if (!id) return null;
    const driver = state.drivers[id], placement = statusFor(state,id);
    return {id:driver.id,name:driver.name,displayName:displayNameFor(driver),zhName:displayNameFor(driver),age:driver.age,nationality:driver.nationality,series:driver.series,origin:driver.origin,
      role:placement.role,status:placement.status,team:placement.team,ratings:{...driver.ratings},bullets:[...(driver.bullets || [])]};
  }

  function activeDrivers(state) {
    const rows = [];
    state.teams.forEach(team => (state.lineups[team] || []).forEach(id => {
      const driver = publicMeta(state,id);
      if (driver) rows.push({...driver,team,role:'f1',status:'active'});
    }));
    return rows;
  }

  function lineupFor(state,team) { return (state.lineups[team] || []).map(id => publicMeta(state,id)).filter(Boolean); }
  function academyFor(state,team) { return state.academy[team] ? publicMeta(state,state.academy[team]) : null; }

  function publicMarket(state,playerTeam) {
    migrateWorld(state);
    const pending = state.pendingOffseason;
    return {
      year:pending ? pending.year : state.currentYear,
      academy:playerTeam ? academyFor(state,playerTeam) : null,
      available:state.available.map(id => publicMeta(state,id)).filter(Boolean),
      candidates:pending ? pending.candidateIds.map(id => publicMeta(state,id)).filter(Boolean) : [],
      shortlist:state.shortlist.map(id => publicMeta(state,id)).filter(Boolean),
      retiring:pending ? pending.retirementIds.map(id => publicMeta(state,id)).filter(Boolean) : [],
      refreshUsed:pending ? !!pending.refreshUsed : false,
      canRefresh:!!(pending&&!pending.refreshUsed&&pending.candidateBatches&&pending.candidateBatches[1]&&pending.candidateBatches[1].length===3),
    };
  }

  function toggleShortlist(state,idOrName) {
    migrateWorld(state);
    const id = resolveId(state,idOrName);
    if (!id || !state.available.includes(id)) return false;
    const index = state.shortlist.indexOf(id);
    if (index >= 0) state.shortlist.splice(index,1); else state.shortlist.push(id);
    return index < 0;
  }

  function careerRegistration(state,idOrName) {
    const id = resolveId(state,idOrName);
    if (!id) return null;
    const driver = state.drivers[id], placement = statusFor(state,id), secret = state.worldSecrets.profiles[id] || {};
    return {id,name:driver.name,age:driver.age,team:placement.team,role:placement.role,ratings:{...driver.ratings},initialBullets:[...(driver.bullets || [])],developmentSpec:clone(secret)};
  }
  function syncCareerState(state,careerEngine,careerState,random,year) {
    if(!careerEngine||typeof careerEngine.registerDriver!=='function'||typeof careerEngine.setDriverRole!=='function'||!careerState||!careerState.records)throw new Error('Career bridge is incomplete');
    let registered=0;Object.keys(state.drivers||{}).forEach(id=>{const row=careerRegistration(state,id);if(!careerState.records[row.name]){careerEngine.registerDriver(careerState,row,random,year);registered+=1}careerEngine.setDriverRole(careerState,row.name,row.role,row.team)});return {registered,total:Object.keys(state.drivers||{}).length};
  }

  function syncRatings(state,rows,ageYear) {
    const list = Array.isArray(rows) ? rows : Object.values(rows || {});
    list.forEach(row => {
      const id = resolveId(state,row.id || row.name);
      if (!id) return;
      const ratings = row.ratings || row;
      ATTRS.forEach(key => { if (Number.isFinite(Number(ratings[key]))) state.drivers[id].ratings[key] = clamp(Math.round(Number(ratings[key])),45,99); });
      if (Number.isFinite(Number(row.age))) state.drivers[id].age = clamp(Math.round(Number(row.age)),16,60);
    });
    if (Number.isFinite(Number(ageYear))) state.ageYear = Math.max(state.ageYear,Math.round(Number(ageYear)));
    return true;
  }

  function chooseCandidateBatches(state,year,random) {
    const eligible=(state.available||[]).filter(id=>state.drivers[id]&&state.drivers[id].age<=21);
    if (eligible.length<6) throw new Error('The academy market needs at least six eligible young drivers');
    const annual=new Set((state.generatedByYear[String(year)]||[]).filter(id=>eligible.includes(id)));
    const jitter=Object.fromEntries(eligible.map(id=>[id,random()*18]));
    const used=new Set();
    function pick(batch,pool) {
      const archetypes=new Set(batch.map(id=>(state.worldSecrets.profiles[id]||{}).archetype));
      const ranked=pool.filter(id=>!used.has(id)).map(id=>{
        const archetype=(state.worldSecrets.profiles[id]||{}).archetype;
        return {id,score:overall(state.drivers[id].ratings)+jitter[id]+(archetype&&!archetypes.has(archetype)?4:0)+(state.shortlist.includes(id)?1.2:0)};
      }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
      if (!ranked.length) return false;
      batch.push(ranked[0].id);used.add(ranked[0].id);return true;
    }
    function buildBatch() {
      const batch=[],annualPool=eligible.filter(id=>annual.has(id)),otherPool=eligible.filter(id=>!annual.has(id));
      pick(batch,annualPool);pick(batch,annualPool);
      if (!pick(batch,otherPool)) pick(batch,eligible);
      while (batch.length<3&&pick(batch,eligible)) {}
      return batch;
    }
    const first=buildBatch(),second=buildBatch();
    if (first.length!==3||second.length!==3) throw new Error('The academy candidate batches could not be completed');
    return [first,second];
  }

  function publicOffseason(state) {
    const pending=state.pendingOffseason;
    if (!pending) return null;
    return {year:pending.year,playerTeam:pending.playerTeam,initial:!!pending.initial,
      retirementIds:[...(pending.retirementIds||[])],aiOutgoingIds:[...(pending.aiOutgoingIds||[])],candidateIds:[...(pending.candidateIds||[])],
      refreshUsed:!!pending.refreshUsed,canRefresh:!!(!pending.refreshUsed&&pending.candidateBatches&&pending.candidateBatches[1]&&pending.candidateBatches[1].length===3),created:!!pending.created};
  }

  function prepareOffseason(state,context,random) {
    migrateWorld(state);
    const ctx = context || {}, year = ctx.year || state.currentYear;
    if (state.processedOffseasons[String(year)]) return clone(state.processedOffseasons[String(year)]);
    if (state.pendingOffseason && state.pendingOffseason.year === year) return clone(publicOffseason(state));
    if (state.pendingOffseason && state.pendingOffseason.year !== year) throw new Error('A different offseason is still pending');
    if (!ctx.initial) {
      const delta = Math.max(0,year - state.ageYear);
      if (delta) Object.values(state.drivers).forEach(driver => { if (!driver.retiredYear && !(state.departed || []).includes(driver.id)) driver.age += delta; });
      state.ageYear = year;
    }
    generateCohort(state,year,random);
    trimAvailable(state,year);
    const active = activeDrivers(state), forced = new Set((ctx.forceRetirements || []).map(value => resolveId(state,value)).filter(Boolean));
    const retirementIds = ctx.initial ? [] : active.filter(driver => forced.has(driver.id) || random() < retirementChance(driver.age)).map(driver => driver.id);
    const suppliedOutgoing = Array.isArray(ctx.aiOutgoingIds) ? ctx.aiOutgoingIds.map(value => resolveId(state,value)).filter(Boolean) : null;
    const desiredChanges = ctx.initial ? 0 : weightedPick([[2,10],[3,34],[4,38],[5,18]],random);
    const aiOutgoingIds = suppliedOutgoing ? [...new Set(suppliedOutgoing)].filter(id => {
      const placement=statusFor(state,id);
      return placement.role==='f1'&&placement.team!==ctx.playerTeam&&!retirementIds.includes(id);
    }) : [];
    if (!suppliedOutgoing) {
      const eligibleTeams = state.teams.filter(team => team !== ctx.playerTeam).sort(() => random() - .5);
      const needed = Math.max(0,desiredChanges - retirementIds.length);
      for (const team of eligibleTeams) {
        if (aiOutgoingIds.length >= needed) break;
        const drivers = lineupFor(state,team).filter(driver => !retirementIds.includes(driver.id));
        if (!drivers.length || random() > .64) continue;
        drivers.sort((a,b) => overall(a.ratings) - overall(b.ratings));
        aiOutgoingIds.push(drivers[0].id);
      }
    }
    const candidateBatches=chooseCandidateBatches(state,year,random),candidateIds=[...candidateBatches[0]];
    state.pendingOffseason = {year,playerTeam:ctx.playerTeam || null,initial:!!ctx.initial,retirementIds,aiOutgoingIds,candidateIds,candidateBatches,candidateBatchIndex:0,refreshUsed:false,created:true};
    return clone(publicOffseason(state));
  }

  function refreshCandidates(state,draft) {
    migrateWorld(state);
    const pending=state.pendingOffseason;
    if (!pending) throw new Error('当前没有可刷新的新人名单');
    if (pending.refreshUsed) return {ok:false,refreshUsed:true,canRefresh:false,candidateIds:[...pending.candidateIds],candidates:pending.candidateIds.map(id=>publicMeta(state,id)),message:'本赛季已经换过一批新人'};
    const next=pending.candidateBatches&&pending.candidateBatches[1]||[];
    if (next.length!==3) return {ok:false,refreshUsed:false,canRefresh:false,candidateIds:[...pending.candidateIds],candidates:pending.candidateIds.map(id=>publicMeta(state,id)),message:'本赛季没有更多符合条件的新人'};
    if (draft&&(Number(draft.year)!==Number(pending.year)||draft.team!==pending.playerTeam)) throw new Error('阵容草案已过期，请重新确认本季计划');
    const previous=new Set(pending.candidateIds);
    pending.candidateIds=[...next];pending.candidateBatchIndex=1;pending.refreshUsed=true;
    if (draft) {
      draft.candidateIds=[...next];
      draft.seats=(Array.isArray(draft.seats)?draft.seats:[]).map(id=>previous.has(id)&&state.available.includes(id)?null:id);
      if (previous.has(draft.academyId)&&state.available.includes(draft.academyId)) draft.academyId=null;
    }
    return {ok:true,refreshUsed:true,canRefresh:false,candidateIds:[...next],candidates:next.map(id=>publicMeta(state,id)),message:'新人名单已更换，本赛季无法再次刷新'};
  }

  function retirementChance(age) {
    if (age >= 46) return 1;
    if (age >= 42) return .70;
    if (age >= 40) return .43;
    if (age >= 38) return .23;
    if (age >= 35) return .09;
    return .005;
  }

  function newPlayerDraft(state,team) {
    migrateWorld(state);
    const pending = state.pendingOffseason;
    if (!pending) throw new Error('Prepare the offseason before creating a player draft');
    const retiring = new Set(pending.retirementIds);
    const currentAcademy = state.academy[team];
    const academyEligible = currentAcademy && !retiring.has(currentAcademy) && state.drivers[currentAcademy].age <= 25;
    return {year:pending.year,team,seats:(state.lineups[team] || []).map(id => retiring.has(id) ? null : id),academyId:academyEligible ? currentAcademy : null,candidateIds:[...pending.candidateIds]};
  }

  function setDraftSeat(state,draft,index,idOrName) {
    if (!draft || index < 0 || index > 1) return false;
    const id = idOrName == null ? null : resolveId(state,idOrName);
    if (idOrName != null && !id) return false;
    if (id) {
      const other = index === 0 ? 1 : 0;
      if (draft.seats[other] === id) draft.seats[other] = draft.seats[index] || null;
      if (draft.academyId === id) draft.academyId = null;
    }
    draft.seats[index] = id;
    return true;
  }

  function setDraftAcademy(state,draft,idOrName) {
    if (!draft) return false;
    const id = idOrName == null ? null : resolveId(state,idOrName);
    if (idOrName != null && !id) return false;
    if (id && draft.seats.includes(id)) return false;
    draft.academyId = id;
    return true;
  }

  function validatePlayerDraft(state,draft,options) {
    migrateWorld(state);
    const errors = [], pending = state.pendingOffseason;
    const seats = draft && Array.isArray(draft.seats) ? draft.seats : [];
    const allowedExternal = new Set((options && options.allowedExternalIds || []).map(value => resolveId(state,value)).filter(Boolean));
    if (!draft || !pending) errors.push('当前没有可提交的季前阵容');
    if (draft && pending && Number(draft.year)!==Number(pending.year)) errors.push('阵容草案已过期，请重新确认本季计划');
    if (draft && !state.teams.includes(draft.team)) errors.push('车队不存在');
    if (draft && (seats.length !== 2 || seats.some(id => !id))) errors.push('两个F1席位都必须有人选');
    if (draft && new Set(seats.filter(Boolean)).size !== 2) errors.push('同一车手不能占据两个席位');
    if (draft && !draft.academyId) errors.push('必须保留一名学院车手');
    if (draft && draft.academyId && seats.includes(draft.academyId)) errors.push('学院车手不能同时占据F1席位');
    const retiring = new Set(pending ? pending.retirementIds : []);
    for (const id of draft ? [...seats,draft.academyId].filter(Boolean) : []) {
      if (!state.drivers[id]) errors.push('阵容包含未知车手');
      if (retiring.has(id) || state.retired.includes(id)) errors.push('退役车手不能进入新赛季阵容');
    }
    if (draft && draft.academyId && state.drivers[draft.academyId] && state.drivers[draft.academyId].age > 25) errors.push('学院席位只接受25岁及以下车手');
    if (draft && draft.academyId && state.drivers[draft.academyId] && state.academy[draft.team]!==draft.academyId && state.drivers[draft.academyId].age > 21) errors.push('新签学院车手的年龄不能超过21岁');
    if (draft && draft.academyId && state.drivers[draft.academyId] && statusFor(state,draft.academyId).role==='f1') errors.push('F1正赛车手不能降为学院车手');
    if (draft) {
      const own = new Set([...(state.lineups[draft.team] || []),state.academy[draft.team],...state.available].filter(Boolean));
      seats.filter(Boolean).forEach(id => { if (!own.has(id)&&!allowedExternal.has(id)) errors.push('不能直接签下其他车队仍在合同内的车手'); });
      if (draft.academyId&&!own.has(draft.academyId)) errors.push('不能把其他车队的正赛车手直接放入学院');
    }
    return {ok:errors.length===0,errors:[...new Set(errors)]};
  }

  function commitPreseason(state,draft,options) {
    migrateWorld(state);
    const pending = state.pendingOffseason;
    if (!pending) {
      const processed = draft && state.processedOffseasons[String(draft.year)];
      if (processed) return clone(processed);
      throw new Error('No pending offseason');
    }
    const working=clone(state), workingPending=working.pendingOffseason;
    const playerTeam = workingPending.playerTeam || draft && draft.team;
    const chosen = draft ? clone(draft) : autoDraft(working,playerTeam);
    const validation = validatePlayerDraft(working,chosen,options);
    if (!validation.ok) throw new Error(validation.errors.join('；'));
    const before = working.transactions.length;
    workingPending.retirementIds.forEach(id => retireDriver(working,id,workingPending.year));
    applyPlayerDraft(working,chosen,workingPending.year,options);
    workingPending.aiOutgoingIds.forEach(id => {
      const placement = statusFor(working,id);
      if (placement.role !== 'f1' || placement.team === playerTeam) return;
      removeFromLineup(working,placement.team,id);
      makeAvailable(working,id);
      working.transactions.push({year:workingPending.year,type:'release',driverId:id,from:placement.team,to:null,reason:'ai_change'});
    });
    fillAiSeats(working,playerTeam,workingPending.year);
    trimAvailable(working,workingPending.year);
    working.pendingOffseason = null;
    const check = validateWorld(working);
    if (!check.ok) throw new Error('Driver world commit failed: ' + check.errors.join('; '));
    working.currentYear = workingPending.year;
    const report = {year:workingPending.year,transactions:working.transactions.slice(before).map(publicTransaction.bind(null,working)),activeCount:check.activeCount,candidateRefreshUsed:!!workingPending.refreshUsed};
    working.processedOffseasons[String(workingPending.year)] = clone(report);
    Object.keys(state).forEach(key=>delete state[key]);Object.assign(state,working);
    return clone(report);
  }

  function autoDraft(state,team) {
    const draft = newPlayerDraft(state,team), pool = [...draft.candidateIds,...state.available];
    for (let index=0; index<2; index += 1) if (!draft.seats[index]) {
      const id = pool.find(candidate => candidate && !draft.seats.includes(candidate) && candidate !== draft.academyId);
      setDraftSeat(state,draft,index,id);
    }
    if (!draft.academyId) {
      const id = pool.find(candidate => candidate && !draft.seats.includes(candidate) && state.drivers[candidate].age <= 21);
      setDraftAcademy(state,draft,id);
    }
    return draft;
  }

  function applyPlayerDraft(state,draft,year) {
    const team = draft.team, oldSeats = [...(state.lineups[team] || [])], oldAcademy = state.academy[team];
    const previousPlacements=Object.fromEntries(draft.seats.map(id=>[id,statusFor(state,id)]));
    oldSeats.forEach(id => { if (!draft.seats.includes(id) && !state.retired.includes(id)) { makeAvailable(state,id); state.transactions.push({year,type:'release',driverId:id,from:team,to:null,reason:'player_choice'}); } });
    if (oldAcademy && oldAcademy !== draft.academyId && !draft.seats.includes(oldAcademy) && !state.retired.includes(oldAcademy)) makeAvailable(state,oldAcademy);
    draft.seats.forEach(id => {
      const wasAcademy = oldAcademy === id;
      removeEverywhere(state,id,team);
      removeValue(state.available,id);
      state.drivers[id].series = 'Formula 1';
      if (!oldSeats.includes(id)) {
        const previous=previousPlacements[id]||{};
        const external=previous.role==='f1'&&previous.team&&previous.team!==team;
        state.transactions.push({year,type:wasAcademy?'promotion':external?'transfer':'signing',driverId:id,from:wasAcademy?`${team} Academy`:external?previous.team:null,to:team,reason:external?'player_poach':'player_choice'});
      }
    });
    state.lineups[team] = [...draft.seats];
    state.academy[team] = draft.academyId;
    removeValue(state.available,draft.academyId);
    if (draft.academyId && draft.academyId !== oldAcademy) state.transactions.push({year,type:'academy_signing',driverId:draft.academyId,from:null,to:`${team} Academy`,reason:'player_choice'});
  }

  function fillAiSeats(state,playerTeam,year) {
    state.teams.filter(team => team !== playerTeam).forEach((team,teamIndex) => {
      while ((state.lineups[team] || []).length < 2) {
        const candidates = state.available.filter(id => !state.retired.includes(id));
        if (!candidates.length) throw new Error('No driver is available for an AI vacancy');
        candidates.sort((a,b) => aiScore(state,b,teamIndex) - aiScore(state,a,teamIndex));
        const id = candidates[0], previous = statusFor(state,id),priorRelease=[...state.transactions].reverse().find(item=>item.driverId===id&&item.from&&!item.to),experienced=state.drivers[id].series==='Formula 1';
        removeValue(state.available,id);
        state.lineups[team].push(id);
        state.drivers[id].series = 'Formula 1';
        state.transactions.push({year,type:experienced?'transfer':'promotion',driverId:id,from:experienced&&priorRelease?priorRelease.from:previous.team,to:team,reason:'ai_market'});
      }
    });
  }

  function aiScore(state,id,teamIndex) {
    const driver = state.drivers[id], strength = 1 - teamIndex / Math.max(1,state.teams.length-1);
    return overall(driver.ratings) + (1-strength) * Math.max(0,24-driver.age) * .65 - Math.max(0,driver.age-37) * .8;
  }

  function retireDriver(state,id,year) {
    const placement = statusFor(state,id);
    if (placement.team && placement.role === 'f1') removeFromLineup(state,placement.team,id);
    if (placement.team && placement.role === 'academy') state.academy[placement.team] = null;
    removeValue(state.available,id); removeValue(state.shortlist,id);
    if (!state.retired.includes(id)) state.retired.push(id);
    state.drivers[id].retiredYear = year;
    state.transactions.push({year,type:'retirement',driverId:id,from:placement.team,to:null,reason:'retirement'});
  }

  function removeFromLineup(state,team,id) { if (state.lineups[team]) removeValue(state.lineups[team],id); }
  function removeEverywhere(state,id,exceptTeam) {
    state.teams.forEach(team => { if (team !== exceptTeam) removeFromLineup(state,team,id); if (state.academy[team] === id) state.academy[team] = null; });
  }
  function makeAvailable(state,id) {
    removeEverywhere(state,id,null);
    if (!state.available.includes(id) && !state.retired.includes(id) && !(state.departed || []).includes(id)) state.available.push(id);
  }
  function removeValue(array,value) { const index = array.indexOf(value); if (index >= 0) array.splice(index,1); }

  function generateCohort(state,year,random) {
    const key=String(year),ids=Array.isArray(state.generatedByYear[key])?[...new Set(state.generatedByYear[key].filter(id=>state.drivers[id]))]:[],added=[];
    while (ids.length<6) {const id=generateProspect(state,year,random);ids.push(id);added.push(id)}
    state.generatedByYear[key] = ids;
    return added;
  }

  function generateProspect(state,year,random) {
    state.worldSecrets.generatedSerial += 1;
    const serial = state.worldSecrets.generatedSerial;
    const isLegendShadow = serial === state.worldSecrets.legendSerial;
    let name,displayName, attempts=0;
    do {
      const first=FIRST_NAMES[Math.floor(random()*FIRST_NAMES.length)],last=LAST_NAMES[Math.floor(random()*LAST_NAMES.length)];
      name = `${first[0]} ${last[0]}`;displayName=`${first[1]}·${last[1]}`;
      attempts += 1;
      if (attempts > 20) {name += ` ${state.nextGeneratedId}`;displayName += ` ${state.nextGeneratedId}`}
    } while (Object.values(state.drivers).some(driver => driver.name === name));
    const id = `generated:${year}:${state.nextGeneratedId++}`;
    const age = 17 + Math.floor(random()*5), nationality = NATIONALITIES[Math.floor(random()*NATIONALITIES.length)];
    const archetype = weightedPick(ARCHETYPES,random);
    let band = weightedPick(POTENTIAL_BANDS,random), growthShape = weightedPick(GROWTH_SHAPES,random);
    if (isLegendShadow) { band='elite'; growthShape=random()<.55?'precocious':'steady'; }
    const bandBase = {limited:62,f1_capable:66,front_runner:70,elite:74}[band];
    const ratings = {pace:bandBase,racecraft:bandBase,consistency:bandBase,tyre:bandBase};
    ATTRS.forEach(key => { ratings[key] = clamp(ratings[key] + Math.floor(random()*9)-4,55,86); });
    if (archetype === 'raw_speed') {ratings.pace+=10;ratings.consistency-=4;}
    if (archetype === 'racecraft') {ratings.racecraft+=9;ratings.pace-=2;}
    if (archetype === 'consistent') {ratings.consistency+=10;ratings.pace-=3;}
    if (archetype === 'tyre_specialist') {ratings.tyre+=10;ratings.racecraft-=3;}
    if (archetype === 'all_rounder') ATTRS.forEach(key=>{ratings[key]+=2});
    if (archetype === 'commercial') {ratings.pace-=4;ratings.racecraft-=2;ratings.consistency+=5;}
    ATTRS.forEach(key=>{ratings[key]=clamp(ratings[key],52,key==='pace'?89:88)});
    if (isLegendShadow) { ratings.pace=clamp(ratings.pace+6,78,89); ratings.racecraft=clamp(ratings.racecraft+3,73,87); }
    const headroom = {limited:[3,8],f1_capable:[7,14],front_runner:[12,20],elite:[18,25]}[band];
    const ceilings = {}, tendency = {pace:1,racecraft:1,consistency:1,tyre:1};
    ATTRS.forEach(key => { ceilings[key] = clamp(ratings[key] + headroom[0] + Math.floor(random()*(headroom[1]-headroom[0]+1)),ratings[key],99); });
    if (archetype === 'raw_speed') tendency.pace=1.4;
    if (archetype === 'racecraft') tendency.racecraft=1.35;
    if (archetype === 'consistent') tendency.consistency=1.4;
    if (archetype === 'tyre_specialist') tendency.tyre=1.4;
    if (isLegendShadow) { ceilings.pace=97+Math.floor(random()*3); ceilings.racecraft=94+Math.floor(random()*5); ceilings.consistency=92+Math.floor(random()*7); ceilings.tyre=91+Math.floor(random()*8); tendency.pace=1.55; }
    const commercialMiracle = archetype === 'commercial' && random() < .01;
    if (commercialMiracle) { ATTRS.forEach(key => { ceilings[key]=92+Math.floor(random()*7); }); growthShape='late'; }
    const bullets = generatedBullets(archetype,year,age,random);
    state.drivers[id] = {id,name,displayName,zhName:displayName,age,nationality,series:age<=17?'Formula 3':'FIA Formula 2',origin:'generated',createdYear:year,ratings,bullets,retiredYear:null};
    state.worldSecrets.profiles[id] = {band,archetype,growthShape,ceilings,tendency,legendShadow:isLegendShadow,miracle:commercialMiracle};
    state.available.push(id);
    return id;
  }

  function generatedBullets(archetype,year,age,random) {
    const base = [
      `${year-1} ${age<=18?'地区F4':'F3'} 年度前五`,
      age<=18?'首次完整参加国际青年方程式':'拥有多个青年方程式赛季经验',
    ];
    const specific = {
      raw_speed:['排位单圈被认为是主要优势','曾连续三站从头排发车'],
      racecraft:['在混战中的位置判断受到认可','多次从后排追回积分'],
      consistent:['最近一个赛季完赛率突出','工程师称赞其周末执行力'],
      tyre_specialist:['长距离轮胎控制表现突出','模拟器长跑数据受到关注'],
      all_rounder:['没有明显短板的完整型车手','不同赛道类型下均有领奖台'],
      commercial:['获得重要赞助伙伴支持','在本土市场拥有较高关注度'],
    }[archetype];
    const colour = ['雨地比赛曾有亮眼发挥','车队对其技术反馈评价积极','关键收官战顶住压力登上领奖台','适应新赛车的速度较快','青年组别队友评价很高'];
    base.push(...specific,colour[Math.floor(random()*colour.length)]);
    if (random()<.45) base.push(colour[Math.floor(random()*colour.length)]);
    return [...new Set(base)].slice(0,6);
  }

  function trimAvailable(state,year) {
    const activeAcademies = new Set(Object.values(state.academy).filter(Boolean));
    const removable = state.available.filter(id => !activeAcademies.has(id)).sort((a,b) => {
      const da=state.drivers[a],db=state.drivers[b];
      return (db.age-da.age) || (overall(da.ratings)-overall(db.ratings));
    });
    for (const id of removable) {
      if (state.available.length <= 18 && state.drivers[id].age <= 25) break;
      removeValue(state.available,id); removeValue(state.shortlist,id);
      if (!state.departed.includes(id)) state.departed.push(id);
      state.drivers[id].departedYear = year;
    }
  }

  function publicTransaction(state,transaction) {
    const driver = state.drivers[transaction.driverId];
    return {year:transaction.year,type:transaction.type,driver:driver?driver.name:'Unknown',from:transaction.from,to:transaction.to,reason:transaction.reason};
  }

  function advanceYear(state,context,random) {
    const pending = prepareOffseason(state,context,random);
    if (pending && pending.transactions) return pending;
    const draft = autoDraft(state,context.playerTeam);
    return commitPreseason(state,draft,context);
  }

  function validateWorld(state) {
    migrateWorld(state);
    const errors=[], active=[];
    state.teams.forEach(team => {
      const seats = state.lineups[team] || [];
      if (seats.length !== 2) errors.push(`${team} does not have two seats`);
      seats.forEach(id => { active.push(id); if (!state.drivers[id]) errors.push(`${team} contains unknown driver`); if (state.retired.includes(id)) errors.push(`${team} contains retired driver`); });
    });
    if (new Set(active).size !== active.length) errors.push('An active driver occupies multiple seats');
    const academies = Object.values(state.academy).filter(Boolean);
    if (new Set(academies).size !== academies.length) errors.push('An academy driver belongs to multiple teams');
    academies.forEach(id => { if (!state.drivers[id]) errors.push('Academy contains unknown driver'); if (active.includes(id)) errors.push('An academy driver also occupies an F1 seat'); if (state.retired.includes(id)) errors.push('A retired driver occupies an academy seat'); });
    const available = state.available || [];
    if (new Set(available).size !== available.length) errors.push('Available pool contains duplicates');
    available.forEach(id => { if (!state.drivers[id]) errors.push('Available pool contains unknown driver'); if (active.includes(id)||academies.includes(id)||state.retired.includes(id)) errors.push('Driver status sets overlap'); });
    const pending=state.pendingOffseason;
    if (pending) {
      const batches=Array.isArray(pending.candidateBatches)?pending.candidateBatches:[];
      if (batches.length!==2||batches.some(batch=>!Array.isArray(batch)||batch.length!==3)) errors.push('Pending academy market does not contain two complete batches');
      const batchIds=batches.flat();
      if (new Set(batchIds).size!==batchIds.length) errors.push('Academy candidate batches overlap');
      batchIds.forEach(id=>{if(!state.drivers[id]||!available.includes(id))errors.push('Academy batch contains an unavailable driver');else if(state.drivers[id].age>21)errors.push('Academy batch contains an over-age newcomer')});
      const expected=batches[pending.refreshUsed?1:0]||[];
      if (JSON.stringify(pending.candidateIds||[])!==JSON.stringify(expected)) errors.push('Active academy batch does not match refresh state');
    }
    return {ok:errors.length===0,errors,activeCount:active.length,academyCount:academies.length,availableCount:available.length};
  }

  const api = {
    ATTRS,newWorld,activeDrivers,lineupFor,academyFor,publicMeta,publicMarket,toggleShortlist,
    prepareOffseason,refreshCandidates,newPlayerDraft,setDraftSeat,setDraftAcademy,validatePlayerDraft,commitPreseason,advanceYear,
    migrateWorld,_syncCareerState:syncCareerState,syncRatings,validateWorld,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1RecruitmentEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
