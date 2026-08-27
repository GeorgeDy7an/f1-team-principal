const CARS=[
  {team:'Mercedes',p:96,r:90,t:88,c:'#00a19c'},{team:'Ferrari',p:93,r:87,t:90,c:'#e32636'},
  {team:'McLaren',p:89,r:92,t:95,c:'#ff8700'},{team:'Red Bull',p:86,r:85,t:84,c:'#3865ff'},
  {team:'Racing Bulls',p:75,r:88,t:80,c:'#6d8fff'},{team:'Alpine',p:73,r:83,t:82,c:'#ff6fbb'},
  {team:'Haas',p:66,r:84,t:74,c:'#b6b9bd'},{team:'Audi',p:63,r:82,t:76,c:'#b7ff31'},
  {team:'Williams',p:61,r:80,t:72,c:'#1595f9'},{team:'Aston Martin',p:55,r:81,t:79,c:'#18856c'},
  {team:'Cadillac',p:50,r:77,t:69,c:'#d8b25c'}
];
const BASE_DRIVERS=[
  ['Max Verstappen','Red Bull',97,97,95,92],['Kimi Antonelli','Mercedes',95,88,96,72],
  ['Charles Leclerc','Ferrari',94,90,79,80],['George Russell','Mercedes',93,91,88,89],
  ['Lewis Hamilton','Ferrari',92,94,93,93],['Lando Norris','McLaren',91,89,90,87],
  ['Oscar Piastri','McLaren',88,86,84,81],['Fernando Alonso','Aston Martin',86,93,91,94],
  ['Pierre Gasly','Alpine',84,80,86,83],['Isack Hadjar','Red Bull',81,78,77,69],
  ['Liam Lawson','Racing Bulls',80,76,80,68],['Carlos Sainz','Williams',78,83,82,85],
  ['Alexander Albon','Williams',76,72,75,74],['Oliver Bearman','Haas',74,67,68,66],
  ['Arvid Lindblad','Racing Bulls',72,65,63,60],['Esteban Ocon','Haas',70,74,73,78],
  ['Gabriel Bortoleto','Audi',68,64,65,64],['Nico Hulkenberg','Audi',67,69,71,70],
  ['Franco Colapinto','Alpine',65,62,61,62],['Valtteri Bottas','Cadillac',63,66,67,76],
  ['Sergio Perez','Cadillac',61,70,70,95],['Lance Stroll','Aston Martin',58,59,58,58]
].map(([name,team,pace,racecraft,consistency,tyre])=>({id:`f1:${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name,team,pace,racecraft,consistency,tyre,
  rating:.5*pace+.25*racecraft+.15*consistency+.1*tyre}));
const RACES=['Australian GP','Chinese GP','Japanese GP','Bahrain GP','Saudi Arabian GP','Miami GP','Canadian GP','Monaco GP','Spanish GP','Austrian GP','British GP','Belgian GP','Hungarian GP','Dutch GP','Italian GP','Madrid GP','Azerbaijan GP','Singapore GP','United States GP','Mexico City GP','São Paulo GP','Las Vegas GP','Qatar GP','Abu Dhabi GP'];
const TEAM_ZH={Mercedes:'梅赛德斯',Ferrari:'法拉利',McLaren:'迈凯伦','Red Bull':'红牛','Racing Bulls':'红牛二队',Alpine:'阿尔派',Haas:'哈斯',Audi:'奥迪',Williams:'威廉姆斯','Aston Martin':'阿斯顿·马丁',Cadillac:'凯迪拉克'};
const DRIVER_ZH={
  'Max Verstappen':'马克斯·维斯塔潘','Kimi Antonelli':'安德烈亚·基米·安东内利','Charles Leclerc':'夏尔·勒克莱尔','George Russell':'乔治·拉素尔',
  'Lewis Hamilton':'刘易斯·汉密尔顿','Lando Norris':'兰多·诺里斯','Oscar Piastri':'奥斯卡·皮亚斯特里','Fernando Alonso':'费尔南多·阿隆索',
  'Pierre Gasly':'皮埃尔·加斯利','Isack Hadjar':'伊萨克·哈贾尔','Liam Lawson':'利亚姆·劳森','Carlos Sainz':'小卡洛斯·塞恩斯',
  'Alexander Albon':'亚历山大·阿尔本','Oliver Bearman':'奥利弗·贝尔曼','Arvid Lindblad':'阿维德·林德布拉德','Esteban Ocon':'埃斯特班·奥康',
  'Gabriel Bortoleto':'加布里埃尔·博托莱托','Nico Hulkenberg':'尼科·霍肯伯格','Franco Colapinto':'弗兰科·科拉平托','Valtteri Bottas':'瓦尔特里·博塔斯',
  'Sergio Perez':'塞尔吉奥·佩雷兹','Lance Stroll':'兰斯·斯特罗尔'
};
const DRIVER_NATIONALITY={
  'Max Verstappen':'Netherlands','Kimi Antonelli':'Italy','Charles Leclerc':'Monaco','George Russell':'United Kingdom',
  'Lewis Hamilton':'United Kingdom','Lando Norris':'United Kingdom','Oscar Piastri':'Australia','Fernando Alonso':'Spain',
  'Pierre Gasly':'France','Isack Hadjar':'France','Liam Lawson':'New Zealand','Carlos Sainz':'Spain',
  'Alexander Albon':'Thailand','Oliver Bearman':'United Kingdom','Arvid Lindblad':'United Kingdom','Esteban Ocon':'France',
  'Gabriel Bortoleto':'Brazil','Nico Hulkenberg':'Germany','Franco Colapinto':'Argentina','Valtteri Bottas':'Finland',
  'Sergio Perez':'Mexico','Lance Stroll':'Canada'
};
const COUNTRY_ZH={
  Argentina:'阿根廷',Australia:'澳大利亚',Austria:'奥地利',Brazil:'巴西',Bulgaria:'保加利亚',Canada:'加拿大',Colombia:'哥伦比亚',Finland:'芬兰',France:'法国',Germany:'德国',India:'印度',Ireland:'爱尔兰',Italy:'意大利',Japan:'日本',Mexico:'墨西哥',Monaco:'摩纳哥',Netherlands:'荷兰','New Zealand':'新西兰',Norway:'挪威',Portugal:'葡萄牙',Spain:'西班牙',Sweden:'瑞典',Thailand:'泰国','United Kingdom':'英国'
};
// Offline flag artwork. Values are trusted SVG fragments, never user-provided data.
const NATIONALITY_FLAG={
  Argentina:'<rect width="24" height="16" fill="#74acdf"/><rect y="5.333" width="24" height="5.334" fill="#fff"/><circle cx="12" cy="8" r="1.15" fill="#f6b40e"/>',
  Australia:'<rect width="24" height="16" fill="#012169"/><g><path d="M0 0l12 8M12 0L0 8" stroke="#fff" stroke-width="2"/><path d="M0 0l12 8M12 0L0 8" stroke="#c8102e" stroke-width=".75"/><path d="M6 0v8M0 4h12" stroke="#fff" stroke-width="2.4"/><path d="M6 0v8M0 4h12" stroke="#c8102e" stroke-width="1.2"/></g><g fill="#fff"><circle cx="18" cy="3.2" r="1"/><circle cx="15.5" cy="7.5" r=".8"/><circle cx="20.5" cy="8.2" r=".8"/><circle cx="18" cy="12.5" r=".85"/><circle cx="8" cy="12" r="1.05"/></g>',
  Austria:'<rect width="24" height="16" fill="#ed2939"/><rect y="5.333" width="24" height="5.334" fill="#fff"/>',
  Brazil:'<rect width="24" height="16" fill="#009c3b"/><path d="M12 1.8L22.2 8 12 14.2 1.8 8z" fill="#ffdf00"/><circle cx="12" cy="8" r="3.05" fill="#002776"/><path d="M9.2 7.15c2.2-.55 4.25-.25 5.7.75" fill="none" stroke="#fff" stroke-width=".55"/>',
  Bulgaria:'<rect width="24" height="16" fill="#d62612"/><rect width="24" height="10.667" fill="#00966e"/><rect width="24" height="5.333" fill="#fff"/>',
  Canada:'<rect width="24" height="16" fill="#d80621"/><rect x="6" width="12" height="16" fill="#fff"/><path d="M12 2.2l1 2.65 1.65-.85-.7 2.45 1.8.7-2.3 1.7.7 1.6-1.55-.25.25 3.6h-1.7l.25-3.6-1.55.25.7-1.6-2.3-1.7 1.8-.7L9.35 4 11 4.85z" fill="#d80621"/>',
  Colombia:'<rect width="24" height="16" fill="#ce1126"/><rect width="24" height="12" fill="#003893"/><rect width="24" height="8" fill="#fcd116"/>',
  Finland:'<rect width="24" height="16" fill="#fff"/><rect x="7" width="3" height="16" fill="#003580"/><rect y="6.5" width="24" height="3" fill="#003580"/>',
  France:'<rect width="24" height="16" fill="#ed2939"/><rect width="16" height="16" fill="#fff"/><rect width="8" height="16" fill="#002395"/>',
  Germany:'<rect width="24" height="16" fill="#ffce00"/><rect width="24" height="10.667" fill="#dd0000"/><rect width="24" height="5.333" fill="#000"/>',
  India:'<rect width="24" height="16" fill="#138808"/><rect width="24" height="10.667" fill="#fff"/><rect width="24" height="5.333" fill="#ff9933"/><circle cx="12" cy="8" r="1.45" fill="none" stroke="#000080" stroke-width=".55"/><path d="M12 6.55v2.9M10.55 8h2.9M10.98 6.98l2.04 2.04M13.02 6.98l-2.04 2.04" stroke="#000080" stroke-width=".3"/>',
  Ireland:'<rect width="24" height="16" fill="#ff883e"/><rect width="16" height="16" fill="#fff"/><rect width="8" height="16" fill="#169b62"/>',
  Italy:'<rect width="24" height="16" fill="#ce2b37"/><rect width="16" height="16" fill="#fff"/><rect width="8" height="16" fill="#009246"/>',
  Japan:'<rect width="24" height="16" fill="#fff"/><circle cx="12" cy="8" r="3.3" fill="#bc002d"/>',
  Mexico:'<rect width="24" height="16" fill="#ce1126"/><rect width="16" height="16" fill="#fff"/><rect width="8" height="16" fill="#006847"/><circle cx="12" cy="8" r="1.25" fill="#8c6b3e"/><path d="M10.7 9.2c.8.8 1.8.8 2.6 0" fill="none" stroke="#006847" stroke-width=".45"/>',
  Monaco:'<rect width="24" height="16" fill="#fff"/><rect width="24" height="8" fill="#ce1126"/>',
  Netherlands:'<rect width="24" height="16" fill="#21468b"/><rect width="24" height="10.667" fill="#fff"/><rect width="24" height="5.333" fill="#ae1c28"/>',
  'New Zealand':'<rect width="24" height="16" fill="#00247d"/><g><path d="M0 0l12 8M12 0L0 8" stroke="#fff" stroke-width="2"/><path d="M0 0l12 8M12 0L0 8" stroke="#cc142b" stroke-width=".7"/><path d="M6 0v8M0 4h12" stroke="#fff" stroke-width="2.4"/><path d="M6 0v8M0 4h12" stroke="#cc142b" stroke-width="1.2"/></g><g fill="#cc142b" stroke="#fff" stroke-width=".45"><circle cx="17.5" cy="4" r=".9"/><circle cx="20.5" cy="7.2" r=".8"/><circle cx="16.2" cy="9" r=".8"/><circle cx="19.2" cy="12.2" r=".9"/></g>',
  Norway:'<rect width="24" height="16" fill="#ba0c2f"/><rect x="7" width="5" height="16" fill="#fff"/><rect y="5.5" width="24" height="5" fill="#fff"/><rect x="8.5" width="2" height="16" fill="#00205b"/><rect y="7" width="24" height="2" fill="#00205b"/>',
  Portugal:'<rect width="24" height="16" fill="#da291c"/><rect width="9.5" height="16" fill="#046a38"/><circle cx="9.5" cy="8" r="2.25" fill="#ffcd00"/><circle cx="9.5" cy="8" r="1.35" fill="#fff"/><path d="M8.65 7.15h1.7v2h-1.7z" fill="#1a4c8b"/>',
  Spain:'<rect width="24" height="16" fill="#aa151b"/><rect y="4" width="24" height="8" fill="#f1bf00"/><rect x="6.1" y="6.2" width="1.5" height="3.7" rx=".3" fill="#aa151b"/><circle cx="6.85" cy="6" r=".7" fill="#aa151b"/>',
  Sweden:'<rect width="24" height="16" fill="#006aa7"/><rect x="7" width="3" height="16" fill="#fecc00"/><rect y="6.5" width="24" height="3" fill="#fecc00"/>',
  Thailand:'<rect width="24" height="16" fill="#a51931"/><rect y="2.667" width="24" height="10.666" fill="#fff"/><rect y="5.333" width="24" height="5.334" fill="#2d2a4a"/>',
  'United Kingdom':'<rect width="24" height="16" fill="#012169"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="5"/><path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" stroke-width="2"/><rect x="9" width="6" height="16" fill="#fff"/><rect y="5" width="24" height="6" fill="#fff"/><rect x="10.5" width="3" height="16" fill="#c8102e"/><rect y="6.5" width="24" height="3" fill="#c8102e"/>'
};
const UNKNOWN_FLAG='<rect width="24" height="16" fill="#59606c"/><path d="M2 14L22 2" stroke="#858d99" stroke-width="3"/><circle cx="12" cy="8" r="2.4" fill="none" stroke="#fff" stroke-width="1"/><circle cx="12" cy="12" r=".65" fill="#fff"/>';
BASE_DRIVERS.forEach(driver=>{driver.nationality=DRIVER_NATIONALITY[driver.name]||''});
const RACE_ZH={'Australian GP':'澳大利亚大奖赛','Chinese GP':'中国大奖赛','Japanese GP':'日本大奖赛','Bahrain GP':'巴林大奖赛','Saudi Arabian GP':'沙特阿拉伯大奖赛','Miami GP':'迈阿密大奖赛','Canadian GP':'加拿大大奖赛','Monaco GP':'摩纳哥大奖赛','Spanish GP':'西班牙大奖赛','Austrian GP':'奥地利大奖赛','British GP':'英国大奖赛','Belgian GP':'比利时大奖赛','Hungarian GP':'匈牙利大奖赛','Dutch GP':'荷兰大奖赛','Italian GP':'意大利大奖赛','Madrid GP':'马德里大奖赛','Azerbaijan GP':'阿塞拜疆大奖赛','Singapore GP':'新加坡大奖赛','United States GP':'美国大奖赛','Mexico City GP':'墨西哥城大奖赛','São Paulo GP':'圣保罗大奖赛','Las Vegas GP':'拉斯维加斯大奖赛','Qatar GP':'卡塔尔大奖赛','Abu Dhabi GP':'阿布扎比大奖赛'};
const POINTS=[25,18,15,12,10,8,6,4,2,1];
const CAR=Object.fromEntries(CARS.map(x=>[x.team,x]));
const STORE='f1-team-principal-alpha-v1';
const ACHIEVEMENT_STORE='f1-team-principal-achievements-v1';
let state=null,scorePoolsCache=null,achievementState=null,achievementPanelOpen=false,achievementPanelTab='regular';

function seedState(){return {
  schemaVersion:9,screen:'select',playerTeam:null,year:2026,round:0,rng:(Date.now()>>>0)||2026,worldRng:0,teamRng:0,contractRng:0,planStep:0,planningLayoutVersion:2,seasonPanel:'overview',summaryPanel:'overview',standingsTab:'drivers',
  driverPoints:{},driverWins:{},driverPodiums:{},driverDnfs:{},history:[],champions:[],teamForm:{},frailty:{},
  decisionState:null,decisionDraft:null,pendingEvent:null,lastDecisionResult:null,finaleHandled:false,pendingFinale:null,
  personalities:{},personalityStoryLog:[],personalityStartedYears:{},personalitySeasonSnapshots:{},careerState:null,careerRaceKeys:{},careerFinalizedYears:{},lastDevelopmentReport:null,developmentReports:{},
  driverWorld:null,marketDraft:null,lastMarketReport:null,developmentAllocation:{},academySeasonBonus:{},academyProgramResult:null,
  teamState:null,lastCarReport:null,contractState:null,lastContractReport:null,legacyState:null,careerStartYear:2026,
}};
function rnd(){state.rng=(Math.imul(1664525,state.rng)+1013904223)>>>0;return state.rng/4294967296}
function worldRnd(){if(!state.worldRng)state.worldRng=((state.rng^0x9e3779b9)>>>0)||1357911;state.worldRng=(Math.imul(22695477,state.worldRng)+1)>>>0;return state.worldRng/4294967296}
function teamRnd(){if(!state.teamRng)state.teamRng=((state.worldRng^0x6d2b79f5)>>>0)||975312;state.teamRng=(Math.imul(1103515245,state.teamRng)+12345)>>>0;return state.teamRng/4294967296}
function contractRnd(){if(!state.contractRng)state.contractRng=((state.teamRng^0x85ebca6b)>>>0)||864209;state.contractRng=(Math.imul(214013,state.contractRng)+2531011)>>>0;return state.contractRng/4294967296}
function normal(mean=0,sd=1){const u=Math.max(rnd(),1e-9),v=rnd();return mean+sd*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function pickWeighted(items,weights){let total=weights.reduce((a,b)=>a+b,0),x=rnd()*total;for(let i=0;i<items.length;i++){x-=weights[i];if(x<=0)return items[i]}return items.at(-1)}
function sampleWeighted(items,weights,n){let a=[...items],w=[...weights],out=[];for(let k=0;k<Math.min(n,a.length);k++){const item=pickWeighted(a,w),i=a.indexOf(item);out.push(item);a.splice(i,1);w.splice(i,1)}return out}
function carColor(team){return CAR[team].c}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function js(value){return String(value).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}
function teamLabel(team){return TEAM_ZH[team]||team}
function driverLabel(personOrName){let person=personOrName&&typeof personOrName==='object'?personOrName:null;const name=person?person.name:personOrName;if(!person&&state&&state.driverWorld)person=Object.values(state.driverWorld.drivers||{}).find(item=>item.name===name)||null;return DRIVER_ZH[name]||person&&person.zhName||person&&person.displayName||name}
function nationalityOf(personOrName){let person=personOrName&&typeof personOrName==='object'?personOrName:null,name=person?person.name:personOrName;if((!person||!person.nationality)&&state&&state.driverWorld)person=Object.values(state.driverWorld.drivers||{}).find(item=>item.name===name)||person;return person&&person.nationality||DRIVER_NATIONALITY[name]||''}
function flagView(personOrName){const nationality=nationalityOf(personOrName),country=COUNTRY_ZH[nationality]||'未知',label=`国籍：${country}`,art=NATIONALITY_FLAG[nationality]||UNKNOWN_FLAG;return `<svg class="driver-flag" xmlns="http://www.w3.org/2000/svg" width="17" height="11" viewBox="0 0 24 16" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label)}" title="${esc(label)}" focusable="false"><title>${esc(label)}</title>${art}<rect x=".25" y=".25" width="23.5" height="15.5" rx=".8" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width=".5"/></svg>`}
function driverNameView(personOrName){return `<span class="driver-name-view">${esc(driverLabel(personOrName))}${flagView(personOrName)}</span>`}
function raceLabel(race){return RACE_ZH[race]||race}
function seriesLabel(series){return {'Formula 1':'F1','Formula 2':'F2','Formula 3':'F3','Regional Formula':'地区方程式','Karting':'卡丁车'}[series]||series}
function raceTypeLabel(type){return {Normal:'常规赛事',Eventful:'多事赛事',Chaos:'乱战'}[type]||type}
function eventReasonLabel(label){return {'Changeable Conditions':'多变赛道状况','Late Safety Car':'末段安全车','Opening Lap Incident':'首圈事故','Strategy Gamble':'策略豪赌','Red Flag':'红旗','Multi-car Incident':'多车事故'}[label]||label}
function upsetLabel(value){return {'Miracle Result':'奇迹夺冠','Midfield Upset':'中游爆冷'}[value]||value}
function localizeText(value){let text=String(value==null?'':value);Object.entries({...TEAM_ZH,...DRIVER_ZH}).sort((a,b)=>b[0].length-a[0].length).forEach(([from,to])=>{text=text.split(from).join(to)});if(state&&state.driverWorld)Object.values(state.driverWorld.drivers||{}).forEach(person=>{if(person.name&&(person.zhName||person.displayName))text=text.split(person.name).join(person.zhName||person.displayName)});return text}

function storedValue(key){try{return localStorage.getItem(key)}catch(error){return null}}
function storeValue(key,value){try{localStorage.setItem(key,value);return true}catch(error){return false}}
function removeStoredValue(key){try{localStorage.removeItem(key);return true}catch(error){return false}}
function ensureAchievementState(){
  if(achievementState)return F1AchievementEngine.migrateState(achievementState);
  let raw=null;try{const stored=storedValue(ACHIEVEMENT_STORE);raw=stored?JSON.parse(stored):null}catch(error){raw=null}
  achievementState=F1AchievementEngine.migrateState(raw);persistAchievementState();return achievementState;
}
function persistAchievementState(){if(achievementState)storeValue(ACHIEVEMENT_STORE,JSON.stringify(achievementState))}
function evaluateAchievements(facts){const result=F1AchievementEngine.evaluate(ensureAchievementState(),facts||{});if(result.newlyUnlocked.length)persistAchievementState();return result}
function achievementProgress(){const rows=F1AchievementEngine.catalog(ensureAchievementState(),'all');return {unlocked:rows.filter(row=>row.unlocked).length,total:rows.length}}
function openAchievementPanel(tab){achievementPanelTab=tab==='hidden'?'hidden':'regular';achievementPanelOpen=true;render()}
function setAchievementTab(tab){achievementPanelTab=tab==='hidden'?'hidden':'regular';render()}
function closeAchievementPanel(){achievementPanelOpen=false;render()}
function confirmAchievementPopup(){const popup=F1AchievementEngine.nextPopup(ensureAchievementState());if(popup){F1AchievementEngine.confirmPopup(achievementState,popup.id);persistAchievementState()}render()}
function achievementDecisionFlags(round){
  const decision=state&&state.decisionState;if(!decision)return [];
  const eventIds=new Set((decision.schedule||[]).filter(slot=>Number(slot.round)===Number(round)&&slot.resolved).map(slot=>slot.eventId));
  return (decision.history||[]).filter(item=>eventIds.has(item.eventId)).map(item=>`${item.eventId}:${item.choice}:${item.outcome}`);
}
function playerSeasonAchievementFacts(){
  if(!state||!state.playerTeam)return {};
  const drivers=teamDrivers(state.playerTeam),champions=state.champions||[];
  return {seasonPoints:drivers.reduce((sum,driver)=>sum+(state.driverPoints[driver.name]||0),0),seasonPodiums:drivers.reduce((sum,driver)=>sum+(state.driverPodiums[driver.name]||0),0),seasonWins:drivers.reduce((sum,driver)=>sum+(state.driverWins[driver.name]||0),0),driverTitles:champions.filter(row=>row.driverTeam===state.playerTeam).length,constructorTitles:champions.filter(row=>row.team===state.playerTeam).length};
}
function evaluateRaceAchievements(raceLog){
  const facts={...playerSeasonAchievementFacts(),year:raceLog.year,round:raceLog.round,source:'race',raceWon:raceLog.winnerTeam===state.playerTeam,preRaceTeamRank:raceLog.playerCarRank,raceType:raceLog.type,raceDnfCount:raceLog.dnfCount,eventFlags:raceLog.achievementFlags||[]};
  return evaluateAchievements(facts);
}
function syncAchievementProgress(){
  if(!state||!state.playerTeam)return;
  evaluateAchievements({...playerSeasonAchievementFacts(),year:state.year,round:state.round,source:'save_sync'});
  (state.history||[]).forEach(race=>{if(race.playerCarRank||race.dnfCount!=null)evaluateRaceAchievements(race)});
  const latest=(state.champions||[]).slice(-1)[0];if(latest)evaluateAchievements({...playerSeasonAchievementFacts(),year:latest.year,round:RACES.length,source:'season',driverChampion:latest.driverTeam===state.playerTeam,constructorsChampion:latest.team===state.playerTeam,championshipMargin:latest.championshipMargin,startCarRank:latest.startCarRank});
}

function ensureTeamState(){
  if(!state.teamState)state.teamState=F1TeamEngine.newState(CARS,teamRnd,state.year);
  else state.teamState=F1TeamEngine.migrateState(state.teamState,CARS,state.year,teamRnd);
  return state.teamState;
}
function currentCar(team){
  if(!state||!state.teamState)return {...CAR[team]};
  const car=F1TeamEngine.publicTeam(state.teamState,team);return {...CAR[team],...car,p:car.performance,r:car.reliability,t:car.tyre};
}
function currentCars(){return CARS.map(car=>currentCar(car.team))}
function carRank(team){return currentCars().sort((a,b)=>F1TeamEngine.carScore(b)-F1TeamEngine.carScore(a)).findIndex(car=>car.team===team)+1}
function ensureLegacyState(){
  if(!state.playerTeam)return null;
  const base=CAR[state.playerTeam],start=Number(state.careerStartYear)||Number(state.champions&&state.champions[0]?.year)||state.year;
  state.careerStartYear=start;
  state.legacyState=F1LegacyEngine.migrateState(state.legacyState,{startYear:start,team:state.playerTeam,initialCarRank:CARS.findIndex(car=>car.team===state.playerTeam)+1,initialPerformance:base.p});
  (state.champions||[]).slice(0,10).forEach(entry=>{
    if(state.legacyState.seasonKeys[String(entry.year)])return;
    F1LegacyEngine.recordSeason(state.legacyState,{year:entry.year,team:state.playerTeam,teamPosition:entry.playerPos,points:entry.playerPoints,constructorChampion:entry.team===state.playerTeam,driverChampion:entry.driverTeam===state.playerTeam,carRank:CARS.findIndex(car=>car.team===state.playerTeam)+1,carPerformance:base.p,nextCarRank:CARS.findIndex(car=>car.team===state.playerTeam)+1,nextCarPerformance:base.p});
  });
  return state.legacyState;
}
function careerProgress(){const legacy=ensureLegacyState();return legacy?F1LegacyEngine.publicSnapshot(legacy):null}
function careerComplete(){const progress=careerProgress();return !!(progress&&progress.completed)}
function careerEndYear(){return (Number(state.careerStartYear)||2026)+F1LegacyEngine.CAREER_LENGTH-1}

function ensureWorld(){
  if(state.driverWorld){
    const world=state.driverWorld;world.retired=world.retired||[];world.departed=world.departed||[];world.available=world.available||[];world.shortlist=world.shortlist||[];world.transactions=world.transactions||[];world.processedOffseasons=world.processedOffseasons||{};world.generatedByYear=world.generatedByYear||{};world.nextGeneratedId=world.nextGeneratedId||1;world.currentYear=world.currentYear||state.year;world.ageYear=world.ageYear||state.year;world.academy=world.academy||Object.fromEntries(CARS.map(car=>[car.team,null]));world.teams=world.teams||CARS.map(car=>car.team);
    try{if(!world.drivers||!world.lineups||!world.worldSecrets||!world.worldSecrets.profiles||!Number.isFinite(world.worldSecrets.legendSerial)||!F1RecruitmentEngine.validateWorld(world).ok)state.driverWorld=null}catch(error){state.driverWorld=null}
  }
  if(!state.driverWorld){state.driverWorld=F1RecruitmentEngine.newWorld(BASE_DRIVERS,CARS,worldRnd,state.year);state.marketDraft=null}
  return state.driverWorld;
}
function repairAlpha08Seats(previousSchema){if(Number(previousSchema)>=8||state.year!==2026||!state.driverWorld)return false;const world=state.driverWorld,had=Object.values(world.drivers||{}).find(driver=>driver.name==='Isack Hadjar'),lind=Object.values(world.drivers||{}).find(driver=>driver.name==='Arvid Lindblad');if(!had||!lind)return false;const red=world.lineups['Red Bull']||[],junior=world.lineups['Racing Bulls']||[],touched=(world.transactions||[]).some(item=>item.year===2026&&(item.driverId===had.id||item.driverId===lind.id));if(touched||!red.includes(lind.id)||!junior.includes(had.id))return false;world.lineups['Red Bull']=red.map(id=>id===lind.id?had.id:id);world.lineups['Racing Bulls']=junior.map(id=>id===had.id?lind.id:id);if(state.marketDraft){if(state.marketDraft.team==='Red Bull')state.marketDraft.seats=state.marketDraft.seats.map(id=>id===lind.id?had.id:id);if(state.marketDraft.team==='Racing Bulls')state.marketDraft.seats=state.marketDraft.seats.map(id=>id===had.id?lind.id:id)}return true}
function contractTeamStrengths(){const ranked=currentCars().sort((a,b)=>F1TeamEngine.carScore(b)-F1TeamEngine.carScore(a));return Object.fromEntries(ranked.map((car,index)=>[car.team,{rank:index+1,performance:car.p}]))}
function contractPersonalityValues(){const out={};if(!state.personalities||!state.driverWorld)return out;Object.values(state.driverWorld.drivers||{}).forEach(meta=>{const values=state.personalities[meta.name]&&state.personalities[meta.name].values;if(values)out[meta.id]=values});return out}
function ensureContractState(preserveExpired){
  ensureWorld();
  if(!state.contractState)state.contractState=F1ContractEngine.newState(state.driverWorld,contractRnd,state.year,{careerEndYear:careerEndYear(),personalityValuesById:contractPersonalityValues()});
  else state.contractState=F1ContractEngine.migrateState(state.contractState,state.driverWorld,contractRnd,state.year,{preserveExpired:!!preserveExpired,careerEndYear:careerEndYear(),personalityValuesById:contractPersonalityValues()});
  const key=String(state.year),alreadyRan=state.driverWorld.processedOffseasons&&state.driverWorld.processedOffseasons[key];
  if(alreadyRan&&!state.contractState.processedYears[key]&&!state.contractState.pending)state.contractState.processedYears[key]={year:state.year,externalSigningIds:[],renewalIds:[],failedOfferIds:[],offers:[],migrated:true};
  if(!state.lastContractReport&&state.contractState.processedYears[key])state.lastContractReport=JSON.parse(JSON.stringify(state.contractState.processedYears[key]));
  return state.contractState;
}
function prepareContractMarket(initial){
  const contracts=ensureContractState(true),recruitment=state.driverWorld.pendingOffseason,key=String(state.year);if(!recruitment)return contracts;
  if(!contracts.pending&&!contracts.processedYears[key])F1ContractEngine.prepareOffseason(contracts,{year:state.year,playerTeam:state.playerTeam,initial:!!initial,driverWorld:state.driverWorld,teamStrengths:contractTeamStrengths(),retirementIds:recruitment.retirementIds||[],careerEndYear:careerEndYear(),personalityValuesById:contractPersonalityValues()},contractRnd);
  if(contracts.pending){const plan=F1ContractEngine.aiPlan(contracts);recruitment.aiOutgoingIds=[...plan.aiOutgoingIds]}
  return contracts;
}
function contractRecruitmentOptions(){return {allowedExternalIds:state.contractState?F1ContractEngine.allowedExternalIds(state.contractState):[]}}
function syncWorldRecords(){
  if(!state.careerState||!state.driverWorld)return;
  F1RecruitmentEngine._syncCareerState(state.driverWorld,F1CareerEngine,state.careerState,worldRnd,state.year);
  F1RecruitmentEngine.syncRatings(state.driverWorld,Object.values(state.careerState.records).map(record=>({id:record.id,name:record.name,age:record.age,ratings:record.ratings})));
}
function ensureCareerState(){
  ensureWorld();
  if(!state.careerState)state.careerState=F1CareerEngine.newCareerState(BASE_DRIVERS,worldRnd,state.year);
  if(!state.careerRaceKeys)state.careerRaceKeys={};
  if(!state.careerFinalizedYears)state.careerFinalizedYears={};
  if(!('lastDevelopmentReport' in state))state.lastDevelopmentReport=null;
  syncWorldRecords();
  (state.history||[]).forEach(recordCareerRace);
}
function ensurePersonalities(startSeason){
  ensureWorld();
  if(!state.personalities)state.personalities={};
  const shouldStart=!!startSeason&&!state.personalityStartedYears?.[String(state.year)],presetUpdates=[];
  Object.values(state.driverWorld.drivers).forEach(meta=>{
    const visible=F1RecruitmentEngine.publicMeta(state.driverWorld,meta.id);
    if(visible.status==='retired'||visible.status==='departed')return;
    if(!state.personalities[visible.name])state.personalities[visible.name]=F1PersonalityEngine.newPersonality(worldRnd,{conservative:visible.origin==='f1_2026',knowledge:visible.team===state.playerTeam?2:1,name:visible.origin==='f1_2026'?visible.name:null});
    else{
      const profile=state.personalities[visible.name],updated=visible.origin==='f1_2026'&&F1PersonalityEngine.applyDriverPreset&&F1PersonalityEngine.applyDriverPreset(profile,visible.name);
      if(updated)presetUpdates.push(visible.name);
      if(F1PersonalityEngine.migrateProfile)F1PersonalityEngine.migrateProfile(profile);
      if(shouldStart)F1PersonalityEngine.startNewSeason(profile);
    }
  });
  if(!state.personalityStoryLog)state.personalityStoryLog=[];
  if(!state.personalityStartedYears)state.personalityStartedYears={};
  if(startSeason)state.personalityStartedYears[String(state.year)]=true;
  if(!state.personalitySeasonSnapshots)state.personalitySeasonSnapshots={};
  const yearKey=String(state.year);if(!state.personalitySeasonSnapshots[yearKey])state.personalitySeasonSnapshots[yearKey]={};Object.values(state.driverWorld.drivers).forEach(meta=>{const visible=F1RecruitmentEngine.publicMeta(state.driverWorld,meta.id),profile=state.personalities[visible.name]&&F1PersonalityEngine.publicProfile(state.personalities[visible.name]);if(profile&&(!state.personalitySeasonSnapshots[yearKey][visible.name]||presetUpdates.includes(visible.name)))state.personalitySeasonSnapshots[yearKey][visible.name]={label:profile.label,rarity:profile.rarity||'common'}})
}
function currentRatings(driver){
  const ratings=state.careerState&&F1CareerEngine.ratingsFor(state.careerState,driver.name);
  return ratings||driver.ratings||{pace:driver.pace,racecraft:driver.racecraft,consistency:driver.consistency,tyre:driver.tyre};
}
function enrichDriver(driver){const r=currentRatings(driver);return {...driver,...r,ratings:{...r},rating:.5*r.pace+.25*r.racecraft+.15*r.consistency+.1*r.tyre}}
function activeDrivers(){
  if(!state||!state.driverWorld)return BASE_DRIVERS.map(driver=>({...driver,ratings:{pace:driver.pace,racecraft:driver.racecraft,consistency:driver.consistency,tyre:driver.tyre}}));
  return F1RecruitmentEngine.activeDrivers(state.driverWorld).map(enrichDriver);
}
function teamDrivers(team){return activeDrivers().filter(driver=>driver.team===team)}
function currentAcademy(team){if(!state.driverWorld)return null;const meta=F1RecruitmentEngine.academyFor(state.driverWorld,team);return meta?enrichPublicMeta(meta):null}
function enrichPublicMeta(meta){
  if(!meta)return null;
  const career=state.careerState&&F1CareerEngine.publicCareer(state.careerState,meta.name);
  const ratings=career?career.ratings:meta.ratings;
  const bullets=[...new Set([...(meta.bullets||[]),...(career?career.bullets:[])])].slice(-6);
  return {...meta,age:career?career.age:meta.age,ratings:{...ratings},bullets};
}
function blankCounters(){state.driverPoints={};state.driverWins={};state.driverPodiums={};state.driverDnfs={};activeDrivers().forEach(d=>{state.driverPoints[d.name]=0;state.driverWins[d.name]=0;state.driverPodiums[d.name]=0;state.driverDnfs[d.name]=0})}
function recordCareerRace(raceLog){if(!state.careerState)return false;if(!state.careerRaceKeys)state.careerRaceKeys={};const year=raceLog.year||state.year,key=`${year}:${raceLog.round||raceLog.race}`;if(state.careerRaceKeys[key])return false;const recorded=F1CareerEngine.recordRace(state.careerState,{id:key,year,race:raceLog.race,result:raceLog.result});state.careerRaceKeys[key]=true;return recorded}
function currentDriverRating(driver){const r=currentRatings(driver);return .5*r.pace+.25*r.racecraft+.15*r.consistency+.1*r.tyre}
function personalityFor(person){return person&&state.personalities&&state.personalities[person.name]||null}
function currentCommercialPackage(){const ids=state.marketDraft&&Array.isArray(state.marketDraft.seats)?state.marketDraft.seats:state.driverWorld&&state.playerTeam&&state.driverWorld.lineups[state.playerTeam]||[],profiles=ids.slice(0,2).map(id=>F1RecruitmentEngine.publicMeta(state.driverWorld,id)).map(person=>person&&personalityFor(person)).filter(Boolean);return F1PersonalityEngine.teamCommercialPackage?F1PersonalityEngine.teamCommercialPackage(profiles):{id:'balanced',label:'常规',tone:'neutral',description:'双车商业回报大致处于围场常规水平。'}}

function prepareSeasonWorld(initial){
  if(state.year>careerEndYear())throw new Error('Career cannot prepare an eleventh season');
  ensureTeamState();
  if(state.teamState.currentYear!==state.year)state.lastCarReport=F1TeamEngine.beginYear(state.teamState,state.year);
  ensureLegacyState();ensureWorld();
  if(!state.driverWorld.pendingOffseason&&!state.driverWorld.processedOffseasons[String(state.year)])F1RecruitmentEngine.prepareOffseason(state.driverWorld,{year:state.year,playerTeam:state.playerTeam,initial:!!initial},worldRnd);
  ensureCareerState();
  ensurePersonalities(true);
  prepareContractMarket(initial);
  state.marketDraft=F1RecruitmentEngine.newPlayerDraft(state.driverWorld,state.playerTeam);
  ensureDevelopmentAllocation();
}
function initSeason(initial){
  state.round=0;state.history=[];state.teamForm={};state.frailty={};state.finaleHandled=false;state.pendingFinale=null;
  state.decisionState=F1DecisionEngine.newDecisionState();state.decisionDraft={investment:'medium',focus:'balanced',academyProgram:'simulator',engineSupplier:'ferrari'};
  state.pendingEvent=null;state.lastDecisionResult=null;state.lastDevelopmentReport=null;state.lastMarketReport=null;state.lastContractReport=null;state.academySeasonBonus={};state.academyProgramResult=null;state.developmentAllocation={};state.planStep=0;state.seasonPanel='overview';state.summaryPanel='overview';state.standingsTab='drivers';
  prepareSeasonWorld(initial);blankCounters();state.screen='preseason';save();
}
function chooseTeam(team){state=seedState();state.playerTeam=team;state.careerStartYear=state.year;state.rng=((Date.now()^(team.length*2654435761))>>>0)||2026;state.worldRng=((state.rng^0xa341316c)>>>0)||246810;state.teamRng=((state.worldRng^0x6d2b79f5)>>>0)||975312;state.contractRng=((state.teamRng^0x85ebca6b)>>>0)||864209;initSeason(true);render()}
function initializeCompetition(){
  blankCounters();state.teamForm={};state.frailty={};currentCars().forEach(c=>state.teamForm[c.team]=normal(0,1.25));activeDrivers().forEach(d=>state.frailty[d.name]=Math.exp(normal(-.1,.48)));
}

function draftPeople(){
  if(!state.marketDraft)return [];
  return [...state.marketDraft.seats,state.marketDraft.academyId].filter(Boolean).map(id=>enrichPublicMeta(F1RecruitmentEngine.publicMeta(state.driverWorld,id))).filter(Boolean);
}
function currentDevelopmentPeople(){const academy=currentAcademy(state.playerTeam);return [...teamDrivers(state.playerTeam),...(academy?[academy]:[])]}
function ensureDevelopmentAllocation(){
  const ids=draftPeople().map(person=>person.id);
  if(ids.length!==3||new Set(ids).size!==3)return;
  const current=state.developmentAllocation||{},levels=ids.map(id=>current[id]);
  if(levels.sort().join(',')==='high,low,medium'&&Object.keys(current).every(id=>ids.includes(id)))return;
  state.developmentAllocation={[ids[0]]:'medium',[ids[1]]:'low',[ids[2]]:'high'};
}
function setDevelopmentLevel(id,level){
  ensureDevelopmentAllocation();const allocation=state.developmentAllocation||{},other=Object.keys(allocation).find(key=>allocation[key]===level);
  if(!(id in allocation)||!other)return;
  const previous=allocation[id];allocation[id]=level;allocation[other]=previous;save();render();
}
function priorityPlan(){
  const people=state.marketDraft?draftPeople():currentDevelopmentPeople();
  return people.map(person=>({name:person.name,level:state.developmentAllocation[person.id]||'medium'}));
}
function resetMarketDraft(){state.marketDraft=F1RecruitmentEngine.newPlayerDraft(state.driverWorld,state.playerTeam);state.developmentAllocation={};ensureDevelopmentAllocation();save();render()}
function assignTalent(id,slot){
  const visible=F1RecruitmentEngine.publicMeta(state.driverWorld,id),external=visible&&visible.role==='f1'&&visible.team!==state.playerTeam;
  if(external&&!F1ContractEngine.allowedExternalIds(state.contractState).includes(id)){toast('必须先让车手接受合同方案');return}
  let changed=false;
  if(slot==='academy')changed=F1RecruitmentEngine.setDraftAcademy(state.driverWorld,state.marketDraft,id);
  else changed=F1RecruitmentEngine.setDraftSeat(state.driverWorld,state.marketDraft,Number(slot),id);
  if(!changed){toast('这个安排与当前阵容冲突');return}
  ensureDevelopmentAllocation();save();render();
}
function attemptContract(id,offerType){
  try{const result=F1ContractEngine.makePlayerOffer(state.contractState,{driverId:id,offerType},state.driverWorld);save();render();toast(result.message)}catch(error){toast(error.message||'合同洽谈无法进行')}
}
function confirmPreseason(){
  if(careerComplete()||state.year>careerEndYear()){state.screen='legacy';save();render();return}
  const contractValidation=F1ContractEngine.validateDraft(state.contractState,{draft:state.marketDraft,driverWorld:state.driverWorld});
  if(!contractValidation.ok){toast(contractValidation.errors[0]);return}
  const recruitmentOptions=contractRecruitmentOptions(),validation=F1RecruitmentEngine.validatePlayerDraft(state.driverWorld,state.marketDraft,recruitmentOptions);
  if(!validation.ok){toast(validation.errors[0]);return}
  ensureDevelopmentAllocation();
  const commercial=currentCommercialPackage(),plan={investment:state.decisionDraft.investment,focus:state.decisionDraft.focus,engineSupplier:state.decisionDraft.engineSupplier||'ferrari',commercialBudgetId:commercial.id,driverPriority:priorityPlan()};
  const worldBackup=JSON.parse(JSON.stringify(state.driverWorld)),contractBackup=JSON.parse(JSON.stringify(state.contractState));
  try{state.lastMarketReport=F1RecruitmentEngine.commitPreseason(state.driverWorld,state.marketDraft,recruitmentOptions);state.lastContractReport=F1ContractEngine.commitOffseason(state.contractState,{year:state.year,driverWorld:state.driverWorld,playerTeam:state.playerTeam,careerEndYear:careerEndYear()},contractRnd)}catch(error){state.driverWorld=worldBackup;state.contractState=contractBackup;toast(error.message||'季前市场提交失败');return}
  syncWorldRecords();ensurePersonalities(false);
  F1DecisionEngine.preseasonPlan(state.decisionState,plan,rnd);
  state.marketDraft=null;state.decisionDraft=null;state.planStep=0;state.seasonPanel='overview';initializeCompetition();state.screen='season';save();render();
}

function eventType(){const x=rnd();return x<.80?'Normal':x<.97?'Eventful':'Chaos'}
function dnfCount(type){const choices={Normal:[[0,1,2],[35,48,17]],Eventful:[[1,2,3,4],[15,38,32,15]],Chaos:[[3,4,5,6,7],[10,22,30,23,15]]}[type];return pickWeighted(...choices)}
function eventLabel(type){if(type==='Normal')return null;const labels=type==='Eventful'?['Changeable Conditions','Late Safety Car','Opening Lap Incident','Strategy Gamble']:['Changeable Conditions','Red Flag','Multi-car Incident','Strategy Gamble'];return labels[Math.floor(rnd()*labels.length)]}
function simulateRace(){
  const drivers=activeDrivers(),cars=Object.fromEntries(currentCars().map(car=>[car.team,car])),carRanks=Object.fromEntries(Object.values(cars).sort((a,b)=>F1TeamEngine.carScore(b)-F1TeamEngine.carScore(a)).map((car,index)=>[car.team,index+1])),type=eventType(),sd={Normal:2.25,Eventful:5.5,Chaos:9.5}[type],scores=new Map(),decision=state.decisionState||F1DecisionEngine.newDecisionState(),raceBonus=F1DecisionEngine.consumeRaceBonus(decision,state.round+1);
  drivers.forEach(d=>{const c=cars[d.team],ratings=currentRatings(d),isPlayer=d.team===state.playerTeam,carScore=c.p+state.teamForm[d.team]+.06*(c.t-80)+(isPlayer?decision.performance+raceBonus:0),driverRating=currentDriverRating(d)+(isPlayer?(decision.driverBonus[d.name]||0):0),scale=1+(80-ratings.consistency)*.007;let score=.65*carScore+.35*driverRating+normal(0,sd*scale);if(type!=='Normal'&&rnd()<(type==='Eventful'?.20:.38))score+=normal(0,type==='Eventful'?5:9);scores.set(d,score)});
  const weights=drivers.map(d=>{const c=cars[d.team],ratings=currentRatings(d),effectiveReliability=c.r+(d.team===state.playerTeam?decision.reliability:0);return (.45+(95-effectiveReliability)*.055+.65+(90-ratings.consistency)*.018)*(state.frailty[d.name]||1)});
  const retired=new Set(sampleWeighted(drivers,weights,dnfCount(type)));
  const finishers=drivers.filter(d=>!retired.has(d)).sort((a,b)=>scores.get(b)-scores.get(a));
  if(type!=='Normal'&&rnd()<(type==='Eventful'?.035:.21)){const mids=finishers.filter(d=>carRanks[d.team]>=5&&carRanks[d.team]<=8);if(mids.length){const w=pickWeighted(mids,mids.map(d=>Math.max(1,scores.get(d)-55)**2));finishers.splice(finishers.indexOf(w),1);finishers.unshift(w)}}
  if(type==='Chaos'&&rnd()<.07){const tails=finishers.filter(d=>carRanks[d.team]>=9);if(tails.length){const w=pickWeighted(tails,tails.map(d=>Math.max(1,scores.get(d)-45)**3));finishers.splice(finishers.indexOf(w),1);finishers.unshift(w)}}
  finishers.forEach((d,i)=>{if(i<10)state.driverPoints[d.name]+=POINTS[i];if(i===0)state.driverWins[d.name]++;if(i<3)state.driverPodiums[d.name]++});retired.forEach(d=>state.driverDnfs[d.name]++);
  const result=[...finishers.map((d,i)=>({id:d.id,name:d.name,team:d.team,pos:i+1,points:POINTS[i]||0,dnf:false})),...[...retired].sort((a,b)=>scores.get(b)-scores.get(a)).map(d=>({id:d.id,name:d.name,team:d.team,pos:null,points:0,dnf:true}))];
  const winner=finishers[0],winnerRank=carRanks[winner.team],upset=winnerRank>=9?'Miracle Result':winnerRank>=5?'Midfield Upset':null;
  const careerRecord=state.careerState.records[winner.name],firstSaveWin=winner.team===state.playerTeam&&careerRecord&&careerRecord.wins===0;
  const raceLog={year:state.year,round:state.round+1,race:RACES[state.round],type,label:eventLabel(type),result,winner:winner.name,winnerId:winner.id,winnerTeam:winner.team,upset,playerCarRank:carRanks[state.playerTeam],dnfCount:retired.size,achievementFlags:achievementDecisionFlags(state.round+1)};
  state.history.push(raceLog);recordCareerRace(raceLog);if(firstSaveWin)raceLog.personalityReaction=applyPersonalityStory(winner.name,'first_win',{round:raceLog.round});const achievementResult=evaluateRaceAchievements(raceLog);state.round++;
  if(state.round===RACES.length)finishSeason();else save();return achievementResult.newlyUnlocked.length>0;
}
function driverStandings(){return activeDrivers().sort((a,b)=>(state.driverPoints[b.name]||0)-(state.driverPoints[a.name]||0)||(state.driverWins[b.name]||0)-(state.driverWins[a.name]||0))}
function teamPoints(){const out=Object.fromEntries(CARS.map(c=>[c.team,0]));activeDrivers().forEach(d=>out[d.team]+=(state.driverPoints[d.name]||0));return out}
function teamStandings(){const p=teamPoints();return currentCars().sort((a,b)=>p[b.team]-p[a.team])}
function finalizeCareerSeason(ds,ts){
  if(state.careerFinalizedYears[String(state.year)])return state.lastDevelopmentReport||[];
  if(ds[0].team===state.playerTeam&&!state.personalityStoryLog.some(x=>x.year===state.year&&x.eventId==='championship'&&x.driver===ds[0].name))applyPersonalityStory(ds[0].name,'championship',{round:RACES.length});
  const names=Object.keys(state.careerState.records),preseason=state.decisionState.preseason&&state.decisionState.preseason.plan,midseason=state.decisionState.midseason&&state.decisionState.midseason.plan;
  const levels=F1CareerEngine.developmentLevelsFromPlans(names,preseason,midseason),bonuses=F1CareerEngine.storyBonusesFromLog(names,state.personalityStoryLog,state.year);
  Object.entries(state.academySeasonBonus||{}).forEach(([name,value])=>{bonuses[name]=(bonuses[name]||0)+value});
  const activeRows=ds.map((d,i)=>({name:d.name,team:d.team,role:'f1',eligibleForTeamTitle:true,position:i+1,points:state.driverPoints[d.name]||0,wins:state.driverWins[d.name]||0,podiums:state.driverPodiums[d.name]||0}));
  const activeNames=new Set(activeRows.map(row=>row.name)),developmentRows=[];
  Object.values(state.driverWorld.drivers).forEach(meta=>{const visible=F1RecruitmentEngine.publicMeta(state.driverWorld,meta.id);if(activeNames.has(visible.name)||visible.status==='retired'||visible.status==='departed')return;developmentRows.push({name:visible.name,team:visible.team,role:visible.role,eligibleForTeamTitle:false,position:null,points:0,wins:0,podiums:0})});
  const season={year:state.year,driverChampion:ds[0].name,teamChampion:ts[0].team,drivers:[...activeRows,...developmentRows]};
  state.lastDevelopmentReport=F1CareerEngine.finishSeason(state.careerState,season,levels,bonuses,worldRnd);
  if(!state.developmentReports)state.developmentReports={};state.developmentReports[String(state.year)]=JSON.parse(JSON.stringify(state.lastDevelopmentReport));
  state.careerFinalizedYears[String(state.year)]=true;
  F1RecruitmentEngine.syncRatings(state.driverWorld,Object.values(state.careerState.records).map(record=>({id:record.id,name:record.name,age:record.age,ratings:record.ratings})),state.year+1);
  return state.lastDevelopmentReport;
}
function finalizeTeamSeason(ts){
  ensureTeamState();const points=teamPoints(),decision=F1DecisionEngine.seasonSummary(state.decisionState),preseason=state.decisionState.preseason&&state.decisionState.preseason.plan,midseason=state.decisionState.midseason&&state.decisionState.midseason.plan;
  state.lastCarReport=F1TeamEngine.settleSeason(state.teamState,{year:state.year,playerTeam:state.playerTeam,standings:ts.map((car,index)=>({team:car.team,position:index+1,points:points[car.team]})),decisionSummary:decision,preseasonPlan:preseason,midseasonPlan:midseason},teamRnd);
  return state.lastCarReport;
}
function finalizeLegacySeason(ds,ts,carReport){
  const legacy=state.legacyState||ensureLegacyState(),points=teamPoints(),teamDriversNow=teamDrivers(state.playerTeam),decision=F1DecisionEngine.seasonSummary(state.decisionState),bestDriverPosition=ds.findIndex(driver=>driver.team===state.playerTeam)+1;
  const promotionTransactions=(state.driverWorld.transactions||[]).filter(item=>item.year===state.year&&item.type==='promotion'&&item.to===state.playerTeam&&item.reason==='player_choice'),promotions=promotionTransactions.length,promotionIds=promotionTransactions.map(item=>item.driverId);
  const contracts=state.lastContractReport||{externalSigningIds:[],renewalIds:[],failedOfferIds:[]};
  const developedAttributes=(state.lastDevelopmentReport||[]).filter(report=>report.team===state.playerTeam).reduce((sum,report)=>sum+(report.changes||[]).filter(change=>change.to>change.from).length,0);
  F1LegacyEngine.recordSeason(legacy,{year:state.year,team:state.playerTeam,teamPosition:ts.findIndex(car=>car.team===state.playerTeam)+1,points:points[state.playerTeam],wins:teamDriversNow.reduce((sum,driver)=>sum+(state.driverWins[driver.name]||0),0),podiums:teamDriversNow.reduce((sum,driver)=>sum+(state.driverPodiums[driver.name]||0),0),bestDriverPosition,constructorChampion:ts[0].team===state.playerTeam,driverChampion:ds[0].team===state.playerTeam,carRank:carReport.rankBefore,carPerformance:carReport.playerBefore.performance,nextCarRank:carReport.rankAfter,nextCarPerformance:carReport.playerAfter.performance,promotions,promotionIds,externalSignings:(contracts.externalSigningIds||[]).length,externalSigningIds:contracts.externalSigningIds||[],renewals:(contracts.renewalIds||[]).length,failedOffers:(contracts.failedOfferIds||[]).length,developedAttributes,decisionValue:decision.performance+decision.reliability*.2,decisionCount:decision.decisions,setbacks:decision.setbacks});
}
function finishSeason(){
  if(state.year>careerEndYear())throw new Error('Career cannot settle an eleventh season');
  const ds=driverStandings(),ts=teamStandings(),playerPos=ts.findIndex(t=>t.team===state.playerTeam)+1,championshipMargin=Math.max(0,(state.driverPoints[ds[0].name]||0)-(state.driverPoints[ds[1].name]||0));ensureLegacyState();
  let championRow=state.champions.find(x=>x.year===state.year);if(!championRow){championRow={year:state.year,driver:ds[0].name,driverTeam:ds[0].team,team:ts[0].team,playerPos,playerPoints:teamPoints()[state.playerTeam],championshipMargin};state.champions.push(championRow)}
  finalizeCareerSeason(ds,ts);const carReport=finalizeTeamSeason(ts);championRow.championshipMargin=championshipMargin;championRow.startCarRank=carReport.rankBefore;evaluateAchievements({...playerSeasonAchievementFacts(),year:state.year,round:RACES.length,source:'season',driverChampion:ds[0].team===state.playerTeam,constructorsChampion:ts[0].team===state.playerTeam,championshipMargin,startCarRank:carReport.rankBefore});finalizeLegacySeason(ds,ts,carReport);if(careerComplete())state.teamState.pending=null;state.summaryPanel='overview';state.screen='summary';save();
}

function applyPersonalityStory(driverName,eventId,context){const profile=state.personalities[driverName];if(!profile||!eventId)return null;const ctx=context||{},response=F1PersonalityEngine.reaction(profile,eventId,worldRnd,ctx),change=F1PersonalityEngine.applyCareerEvent(profile,eventId,response.id,worldRnd,{});F1PersonalityEngine.improveKnowledge(profile,1);const visible=F1PersonalityEngine.publicProfile(profile),story={year:state.year,round:ctx.round==null?state.round+1:ctx.round,driver:driverName,eventId,reaction:response.id,text:response.text,label:visible.label,labelChanged:change.labelChanged,labelBefore:change.labelBefore,labelAfter:change.labelAfter};state.personalityStoryLog.push(story);return story}
function setDecisionDraft(key,value){state.decisionDraft[key]=value;save();render()}
function academyProgram(choice){
  const academy=currentAcademy(state.playerTeam);if(!academy)return null;
  const configs={
    fp1:{label:'两次 FP1 练习',setback:.10,breakthrough:.34,bonus:.26,story:'车手完成了两次自由练习，车队获得了真实F1环境下的新判断。'},
    f2_title:{label:'留在 F2 冲击冠军',setback:.22,breakthrough:.35,bonus:.34,story:'车队让他继续承担争冠压力，结果会在年度成长报告中体现。'},
    simulator:{label:'模拟器与轮胎计划',setback:.04,breakthrough:.20,bonus:.20,story:'稳定的长距离项目带来了更多技术反馈。'},
  },config=configs[choice]||configs.simulator,roll=worldRnd();
  const outcome=roll<config.setback?'setback':roll>1-config.breakthrough?'breakthrough':'progress';
  const multiplier={setback:0,progress:.7,breakthrough:1.45}[outcome];
  state.academySeasonBonus[academy.name]=(state.academySeasonBonus[academy.name]||0)+config.bonus*multiplier;
  F1CareerEngine.addCareerBullet(state.careerState,academy.name,`${state.year} — 学院计划：${config.label}`);
  F1PersonalityEngine.improveKnowledge(state.personalities[academy.name],1);
  const reaction=outcome==='setback'?null:applyPersonalityStory(academy.name,'development_support',{round:12});
  return {driver:academy.name,label:config.label,outcome,text:outcome==='setback'?'计划没有带来即时能力提升，但车队排除了一条错误方向。':config.story,reaction};
}
function confirmMidseason(){
  ensureDevelopmentAllocation();const draft=state.decisionDraft,plan={investment:draft.investment,focus:draft.focus,driverPriority:priorityPlan()};
  const result=F1DecisionEngine.midseasonAdjustment(state.decisionState,plan,rnd),low=plan.driverPriority.find(item=>item.level==='low'),previous=state.decisionState.preseason&&state.decisionState.preseason.plan.driverPriority||[];
  let personalityReaction=null;if(low){const repeated=previous.some(item=>item.name===low.name&&item.level==='low');personalityReaction=applyPersonalityStory(low.name,'resource_overlooked',{repeated})}
  state.academyProgramResult=academyProgram(draft.academyProgram);state.decisionDraft=null;state.planStep=0;state.lastDecisionResult={phase:'midseason',key:result.key,title:'季中调整完成',personalityReaction,academyResult:state.academyProgramResult};state.screen='decisionResult';save();render();
}
function finaleSituation(){
  if(state.round!==23||state.finaleHandled)return null;
  const ds=driverStandings(),playerNames=new Set(teamDrivers(state.playerTeam).map(driver=>driver.name)),leader=ds[0],contenders=ds.filter(driver=>Math.abs((state.driverPoints[leader.name]||0)-(state.driverPoints[driver.name]||0))<=25),playerTitle=contenders.find(driver=>playerNames.has(driver.name));
  let titleText=null;if(playerTitle){const rival=contenders.find(driver=>driver.name!==playerTitle.name);if(rival)titleText=`${driverLabel(playerTitle)} 与 ${driverLabel(rival)} 的冠军差距仍在一场胜利以内。`}
  const teams=teamStandings(),points=teamPoints(),index=teams.findIndex(team=>team.team===state.playerTeam),keyBoundaries=new Set([1,3,5]),neighbors=[teams[index-1],teams[index+1]].filter(Boolean),close=neighbors.find(team=>{const other=teams.findIndex(item=>item.team===team.team),boundary=Math.min(index,other)+1;return keyBoundaries.has(boundary)&&Math.abs(points[state.playerTeam]-points[team.team])<=43});
  const teamText=close?`${teamLabel(state.playerTeam)} 与 ${teamLabel(close.team)} 的车队积分位置仍可能在末站互换。`:null;
  return titleText||teamText?{titleText,teamText}:null;
}
function decisionBeforeRace(){
  if(state.round>=12&&!state.decisionState.midseason){state.decisionDraft={investment:'maintain',focus:'balanced',academyProgram:'simulator',engineSupplier:state.decisionState.engineSupplier||state.decisionState.preseason?.plan?.engineSupplier||'ferrari'};state.planStep=0;ensureDevelopmentAllocation();state.screen='midseason';save();return true}
  const template=F1DecisionEngine.scheduledEventForRound(state.decisionState,state.round+1);if(template){state.pendingEvent=template;state.screen='event';save();return true}
  const finale=finaleSituation();if(finale){state.pendingFinale=finale;state.screen='finale';save();return true}
  return false;
}
function simulateNext(){if(careerComplete()||state.year>careerEndYear()){state.screen='legacy';save();render();return}if(state.round<RACES.length){const before=state.round;if(!decisionBeforeRace())simulateRace();if(state.screen==='season'&&state.round>before){state.seasonPanel='results';save()}render()}}
function simulateToDecision(){let guard=0;while(state.round<RACES.length&&state.screen==='season'&&guard++<30){if(decisionBeforeRace())break;const unlocked=simulateRace();if(unlocked||F1AchievementEngine.nextPopup(ensureAchievementState()))break}render()}
function resolveEventChoice(choice){const drivers=teamDrivers(state.playerTeam),context={round:state.round+1,driver:drivers[0].name,chasing:rankOfTeam(state.playerTeam)>1,protectingLead:rankOfTeam(state.playerTeam)===1,lowReliability:currentCar(state.playerTeam).r+state.decisionState.reliability<85,highTeamwork:false};const result=F1DecisionEngine.resolveEvent(state.decisionState,state.pendingEvent.id,choice,rnd,context);const storyEvent=F1PersonalityEngine.decisionFlagToStoryEvent(result.flag);let personalityReaction=null;if(storyEvent){const target=storyEvent==='resource_overlooked'||storyEvent==='team_orders'?[...drivers].sort((a,b)=>(state.driverPoints[a.name]||0)-(state.driverPoints[b.name]||0))[0]:drivers[0];personalityReaction=applyPersonalityStory(target.name,storyEvent,{repeated:false})}state.lastDecisionResult={phase:'event',key:result.key,title:result.template.title,choice,risk:result.risk,personalityReaction};state.pendingEvent=null;state.screen='decisionResult';save();render()}
function resolveFinaleChoice(choice){const drivers=teamDrivers(state.playerTeam),result=F1DecisionEngine.resolveEvent(state.decisionState,'points_gamble',choice,rnd,{round:24,driver:drivers[0].name,chasing:true,protectingLead:rankOfTeam(state.playerTeam)===1});state.finaleHandled=true;state.pendingFinale=null;state.lastDecisionResult={phase:'finale',key:result.key,title:'末站决战计划',choice,risk:result.risk};state.screen='decisionResult';save();render()}
function continueAfterDecision(){state.lastDecisionResult=null;state.seasonPanel='overview';state.screen='season';save();render()}
function nextSeason(){if(careerComplete()||state.year>=careerEndYear()){state.screen='legacy';save();render();return}state.year++;initSeason(false);render()}
function openSummary(){state.summaryPanel='overview';state.screen='summary';save();render()}
function openFinalStandings(){state.seasonPanel='standings';state.screen='season';save();render()}

function save(){return storeValue(STORE,JSON.stringify(state))}
function normalizeLegacySchedule(){
  if(!state.decisionState)return;const validIds=new Set(F1DecisionEngine.EVENT_TEMPLATES.filter(event=>event.category==='race').map(event=>event.id)),schedule=Array.isArray(state.decisionState.schedule)?state.decisionState.schedule:[];
  const valid=schedule.filter(slot=>slot&&validIds.has(slot.eventId)&&Number.isFinite(slot.round)),early=valid.find(slot=>slot.round>=4&&slot.round<=10),late=valid.find(slot=>slot.round>=14&&slot.round<=21);
  state.decisionState.schedule=[early,late].filter(Boolean).map(slot=>({...slot,resolved:!!slot.resolved||slot.round<=state.round}));
}
function repairLoadedScreen(){
  const known=new Set(['select','preseason','midseason','event','finale','decisionResult','summary','legacy','season']);if(!known.has(state.screen))state.screen=state.round===RACES.length?'summary':'season';
  if(Number(state.planningLayoutVersion||0)<2){const oldStep=Number.isInteger(state.planStep)?state.planStep:0;if(state.screen==='preseason')state.planStep=[0,1,3,5,6][Math.max(0,Math.min(4,oldStep))];if(state.screen==='midseason')state.planStep=[0,1,3,4,5][Math.max(0,Math.min(4,oldStep))];state.planningLayoutVersion=2}
  const planKind=state.screen==='preseason'?'preseason':state.screen==='midseason'?'midseason':null,stepCount=planKind?planningStepSpecs(planKind).length:7;state.planStep=Math.max(0,Math.min(stepCount-1,Number.isInteger(state.planStep)?state.planStep:0));if(!['overview','results','standings','drivers'].includes(state.seasonPanel))state.seasonPanel='overview';if(!['overview','development','review','standings'].includes(state.summaryPanel))state.summaryPanel='overview';if(!['drivers','teams'].includes(state.standingsTab))state.standingsTab='drivers';
  if(careerComplete()){if(state.teamState)state.teamState.pending=null;if(state.contractState)state.contractState.pending=null;if(!['summary','legacy'].includes(state.screen))state.screen='legacy';return}
  if(state.screen==='preseason'&&!state.decisionDraft)state.decisionDraft={investment:'medium',focus:'balanced',academyProgram:'simulator',engineSupplier:'ferrari'};
  if(state.screen==='midseason'&&!state.decisionDraft)state.decisionDraft={investment:'maintain',focus:'balanced',academyProgram:'simulator',engineSupplier:state.decisionState.engineSupplier||'ferrari'};
  if(state.decisionDraft&&!state.decisionDraft.engineSupplier)state.decisionDraft.engineSupplier=state.decisionState.engineSupplier||state.decisionState.preseason?.plan?.engineSupplier||'ferrari';
  if(state.screen==='event'&&(!state.pendingEvent||!F1DecisionEngine.EVENT_TEMPLATES.some(event=>event.id===state.pendingEvent.id)))state.screen='season';
  if(state.screen==='finale'&&!state.pendingFinale){state.pendingFinale=finaleSituation();if(!state.pendingFinale)state.screen='season'}
  if(state.screen==='decisionResult'&&!state.lastDecisionResult)state.screen='season';
  if(state.screen==='summary'&&state.round!==RACES.length)state.screen='season';
  if(state.screen==='legacy')state.screen=state.round===RACES.length?'summary':'season';
}
function load(){
  try{const loaded=JSON.parse(localStorage.getItem(STORE));if(loaded&&loaded.playerTeam){const loadedSchema=Number(loaded.schemaVersion)||0;state=loaded;(state.history||[]).forEach(race=>{if(!race.type)race.type='Normal'});if(!state.worldRng)state.worldRng=((state.rng^0xa341316c)>>>0)||246810;if(!state.teamRng)state.teamRng=((state.worldRng^0x6d2b79f5)>>>0)||975312;if(!state.contractRng)state.contractRng=((state.teamRng^0x85ebca6b)>>>0)||864209;if(!state.decisionState){state.decisionState=F1DecisionEngine.newDecisionState();state.decisionState.preseason={legacy:true};state.decisionState.schedule=[];if(state.round>=12)state.decisionState.midseason={legacy:true}}normalizeLegacySchedule();
    Object.assign(state,{schemaVersion:9,history:state.history||[],champions:state.champions||[],driverPoints:state.driverPoints||{},driverWins:state.driverWins||{},driverPodiums:state.driverPodiums||{},driverDnfs:state.driverDnfs||{},teamForm:state.teamForm||{},frailty:state.frailty||{},personalities:state.personalities||{},personalityStoryLog:state.personalityStoryLog||[],personalityStartedYears:state.personalityStartedYears||{},personalitySeasonSnapshots:state.personalitySeasonSnapshots||{},careerRaceKeys:state.careerRaceKeys||{},careerFinalizedYears:state.careerFinalizedYears||{},developmentReports:state.developmentReports||{},developmentAllocation:state.developmentAllocation||{},academySeasonBonus:state.academySeasonBonus||{},careerStartYear:state.careerStartYear||Number(state.champions&&state.champions[0]?.year)||2026,lastCarReport:state.lastCarReport||null,contractState:state.contractState||null,lastContractReport:state.lastContractReport||null,planStep:Number.isInteger(state.planStep)?state.planStep:0,planningLayoutVersion:Number(state.planningLayoutVersion)||1,seasonPanel:['overview','results','standings','drivers'].includes(state.seasonPanel)?state.seasonPanel:'overview',summaryPanel:['overview','development','review','standings'].includes(state.summaryPanel)?state.summaryPanel:'overview',standingsTab:['drivers','teams'].includes(state.standingsTab)?state.standingsTab:'drivers'});
    if(state.lastDevelopmentReport&&!state.developmentReports[String(state.year)])state.developmentReports[String(state.year)]=JSON.parse(JSON.stringify(state.lastDevelopmentReport));
    if(!Number.isFinite(state.decisionState.budgetPressure))state.decisionState.budgetPressure=0;state.decisionState.budgetPressure=Math.max(0,Math.min(6,state.decisionState.budgetPressure));
    const decisionDefaults=F1DecisionEngine.newDecisionState();Object.keys(decisionDefaults).forEach(key=>{if(!(key in state.decisionState))state.decisionState[key]=decisionDefaults[key]});if(F1DecisionEngine.migrateState)F1DecisionEngine.migrateState(state.decisionState);if(state.round>12&&!state.decisionState.midseason&&state.screen!=='midseason')state.decisionState.midseason={legacy:true};normalizeLegacySchedule();
    if(state.year>careerEndYear()){state.year=careerEndYear();state.round=RACES.length;state.screen='summary'}
    ensureTeamState();ensureLegacyState();ensureWorld();repairAlpha08Seats(loadedSchema);ensureCareerState();ensurePersonalities(false);ensureContractState(state.screen==='preseason');
    const yearKey=String(state.year),incomplete=!careerComplete()&&state.year<=careerEndYear()&&state.round===RACES.length&&(!state.champions.some(item=>item.year===state.year)||!state.careerFinalizedYears[yearKey]||!state.teamState.settledYears[yearKey]||!state.legacyState.seasonKeys[yearKey]);
    if(incomplete)finishSeason();else if(state.round===RACES.length&&!state.lastCarReport)state.lastCarReport=F1TeamEngine.publicReport(state.teamState,state.year);
    if(state.screen==='preseason'){const initial=state.year===state.careerStartYear&&!state.champions.length;if(!state.driverWorld.pendingOffseason&&!state.driverWorld.processedOffseasons[String(state.year)])F1RecruitmentEngine.prepareOffseason(state.driverWorld,{year:state.year,playerTeam:state.playerTeam,initial},worldRnd);prepareContractMarket(initial);if(!state.marketDraft)state.marketDraft=F1RecruitmentEngine.newPlayerDraft(state.driverWorld,state.playerTeam);ensureDevelopmentAllocation()}
    repairLoadedScreen();syncAchievementProgress();save();render();toast('存档已载入');return}}
  catch(error){console.error(error)}toast('暂无可用存档');
}
function resetGame(){removeStoredValue(STORE);achievementPanelOpen=false;state=seedState();render()}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=localizeText(msg);document.body.appendChild(el);setTimeout(()=>el.remove(),2500)}
function rankOfTeam(team){return teamStandings().findIndex(x=>x.team===team)+1}
function setTheme(team){const color=team?carColor(team):'#ff3b30',hex=color.replace('#',''),rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)),luma=.299*rgb[0]+.587*rgb[1]+.114*rgb[2],ink=luma>145?'#101216':'#ffffff';document.documentElement.style.setProperty('--team',color);document.documentElement.style.setProperty('--team-ink',ink);if(typeof document.querySelector==='function'&&document.head){let meta=document.querySelector('meta[name="theme-color"]');if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta)}meta.content=color}}

function achievementLibraryView(){
  const regular=F1AchievementEngine.regularCatalog(ensureAchievementState()),hidden=F1AchievementEngine.hiddenCatalog(achievementState),rows=achievementPanelTab==='hidden'?hidden:regular,done=rows.filter(row=>row.unlocked).length;
  return `<div class="achievement-overlay" role="presentation"><section class="achievement-library" role="dialog" aria-modal="true" aria-labelledby="achievement-title"><header><div><div class="eyebrow">生涯记录</div><h2 id="achievement-title">成就总览</h2></div><b>${achievementProgress().unlocked} / 10</b></header><nav class="achievement-tabs" aria-label="成就分类"><button class="${achievementPanelTab==='regular'?'active':''}" onclick="setAchievementTab('regular')">常规 ${regular.filter(row=>row.unlocked).length}/5</button><button class="${achievementPanelTab==='hidden'?'active':''}" onclick="setAchievementTab('hidden')">隐藏 ${hidden.filter(row=>row.unlocked).length}/5</button></nav><div class="achievement-list" aria-label="${achievementPanelTab==='hidden'?'隐藏':'常规'}成就，已完成 ${done} 项">${rows.map(row=>`<article class="achievement-row ${row.unlocked?'unlocked':'locked'}"><i>${esc(row.icon)}</i><div><b>${esc(row.title)}</b><p>${esc(row.description)}</p></div><span>${row.unlocked?'已完成':'未完成'}</span></article>`).join('')}</div><footer><button class="primary" onclick="closeAchievementPanel()">返回开始界面</button></footer></section></div>`;
}
function achievementPopupView(){
  const row=F1AchievementEngine.nextPopup(ensureAchievementState());if(!row)return '';
  return `<div class="achievement-overlay achievement-popup-overlay" role="presentation"><section class="achievement-popup" role="dialog" aria-modal="true" aria-labelledby="achievement-popup-title"><div class="achievement-popup-icon">${esc(row.icon)}</div><div class="eyebrow">${row.hidden?'隐藏成就已解锁':'成就已解锁'}</div><h2 id="achievement-popup-title">${esc(row.title)}</h2><p>${esc(row.description)}</p><button class="primary" onclick="confirmAchievementPopup()">收下成就</button></section></div>`;
}
function selectionView(){
  setTheme(null);const achievements=achievementProgress(),hasSave=!!storedValue(STORE);
  return `<div class="shell"><section class="hero"><div><div class="eyebrow">车队领队生涯 · Beta 0.1</div><h1>选择你的车队，<br>经营完整十年。</h1><p>赛车、车手、合同与竞争秩序都会跨赛季变化。技术规则会重置部分旧优势，而你的研发与人才选择将共同决定车队能否建立一个时代。</p></div><div class="stamp">2026 数据库 · V0.1</div></section><div class="section-head"><div><h2>11 支车队</h2><p>从既有实力起步，但没有车队被永远锁在原来的位置。</p></div><div class="start-actions"><button class="ghost" onclick="openAchievementPanel('regular')">成就 ${achievements.unlocked}/${achievements.total}</button>${hasSave?`<button class="ghost" onclick="load()">继续存档</button>`:''}</div></div><section class="team-grid">${CARS.map((c,i)=>{const ds=teamDrivers(c.team);return `<button class="team-card" style="--c:${c.c}" onclick="chooseTeam('${js(c.team)}')"><span class="rank">赛车排名 · ${String(i+1).padStart(2,'0')}</span><h3>${esc(teamLabel(c.team))}</h3><div class="drivers">${ds.map(driverNameView).join('<br>')}</div><div class="bars"><div class="bar"><span>性能</span><div class="track"><div class="fill" style="width:${c.p}%"></div></div>${carScoreView(c,'p',c.p)}</div><div class="bar"><span>可靠性</span><div class="track"><div class="fill" style="width:${c.r}%"></div></div>${carScoreView(c,'r',c.r)}</div><div class="bar"><span>轮胎</span><div class="track"><div class="fill" style="width:${c.t}%"></div></div>${carScoreView(c,'t',c.t)}</div></div></button>`}).join('')}</section><div class="footer-note">自动模拟 V0.2 · 决策 V0.2 · 人格 V0.2 · 生涯 V0.2 · 新人市场 V0.2 · 成就 V0.1</div></div>`;
}
function choiceGroup(key,items){return `<div class="choice-grid">${items.map(item=>`<button class="choice ${state.decisionDraft[key]===item.value?'selected':''}" onclick="setDecisionDraft('${key}','${item.value}')"><b>${item.label}</b><small>${item.note}</small></button>`).join('')}</div>`}
function signed(value){return `${value>0?'+':''}${value}`}
function rarityName(rarity){return {common:'常见',uncommon:'少见',rare:'稀有',epic:'罕见',legendary:'传奇'}[rarity]||'常见'}
function labelInfo(labelId){const label=(F1PersonalityEngine.LABELS||[]).find(item=>item.id===labelId);return {label:label?label.name:labelId,rarity:F1PersonalityEngine.RARITY&&F1PersonalityEngine.RARITY[labelId]||'common'}}
function priorPersonalityShift(name){const previous=String(state.year-1),before=state.personalitySeasonSnapshots&&state.personalitySeasonSnapshots[previous]&&state.personalitySeasonSnapshots[previous][name],after=state.personalitySeasonSnapshots&&state.personalitySeasonSnapshots[String(state.year)]&&state.personalitySeasonSnapshots[String(state.year)][name];if(before&&after&&before.label!==after.label)return {before,after};const changed=(state.personalityStoryLog||[]).filter(item=>String(item.year)===previous&&item.driver===name&&item.labelChanged&&item.labelBefore&&item.labelAfter);if(!changed.length)return null;return {before:labelInfo(changed[0].labelBefore),after:labelInfo(changed.at(-1).labelAfter)}}
function previousGrowth(name){const record=state.careerState&&state.careerState.records&&state.careerState.records[name],season=record&&(record.seasons||[]).find(item=>item.year===state.year-1);if(!season||!Array.isArray(season.changes))return null;const deltas={pace:0,racecraft:0,consistency:0,tyre:0};season.changes.forEach(change=>{if(change.attribute in deltas)deltas[change.attribute]=Number(change.delta)||0});return {deltas,overall:.5*deltas.pace+.25*deltas.racecraft+.15*deltas.consistency+.1*deltas.tyre}}
function trendMark(value,precision){const delta=Number(value)||0,shown=(precision?Math.abs(delta).toFixed(1):Math.abs(delta));if(delta>0)return `<em class="trend up">▲ +${shown}</em>`;if(delta<0)return `<em class="trend down">▼ -${shown}</em>`;return `<em class="trend flat">—</em>`}
function normalizedScore(value,precision){const number=Number(value);if(!Number.isFinite(number))return null;const scale=precision?10:1;return Math.round(number*scale)/scale}
function scoreTier(value,precision){const score=normalizedScore(value,precision);if(score==null)return 'base';return score>=95?'purple':score>=90?'red':score>=85?'green':score>=80?'yellow':'base'}
function driverMetric(driver,key){const ratings=driver.ratings||currentRatings(driver);return key==='overall'?.5*ratings.pace+.25*ratings.racecraft+.15*ratings.consistency+.1*ratings.tyre:Number(ratings[key])||0}
function scorePools(){if(scorePoolsCache)return scorePoolsCache;const drivers=activeDrivers(),cars=currentCars();scorePoolsCache={driver:{overall:drivers.map(driver=>driverMetric(driver,'overall')),pace:drivers.map(driver=>driverMetric(driver,'pace')),racecraft:drivers.map(driver=>driverMetric(driver,'racecraft')),consistency:drivers.map(driver=>driverMetric(driver,'consistency')),tyre:drivers.map(driver=>driverMetric(driver,'tyre'))},car:{p:cars.map(car=>car.p),r:cars.map(car=>car.r),t:cars.map(car=>car.t)}};return scorePoolsCache}
function competitionRank(value,pool,precision){const target=normalizedScore(value,precision);return target==null?null:1+(pool||[]).map(other=>normalizedScore(other,precision)).filter(other=>other!=null&&other>target).length}
function scoreMarkup(value,rank,precision,rankLabel){const number=normalizedScore(value,precision);if(number==null)return '<b class="score-value score-base">—</b>';const shown=precision?number.toFixed(1):String(number),badge=rank&&rank<=3?`<sup class="top-three rank-${rank}" aria-label="${esc(rankLabel)}第 ${rank}" title="${esc(rankLabel)}第 ${rank}">#${rank}</sup>`:'';return `<b class="score-value score-${scoreTier(number,precision)}">${shown}${badge}</b>`}
function driverScore(person,key,value,precision){return scoreMarkup(value,competitionRank(value,scorePools().driver[key],precision),precision,'现役 F1 车手该项')}
function carScoreView(car,key,value){return scoreMarkup(value,competitionRank(value,scorePools().car[key],false),false,'赛车该项')}
function growthStrip(person){const growth=previousGrowth(person.name),r=person.ratings||currentRatings(person),overall=.5*r.pace+.25*r.racecraft+.15*r.consistency+.1*r.tyre,items=[['pace','速度'],['racecraft','缠斗'],['consistency','稳定'],['tyre','轮胎']];return `<div class="growth-block"><div class="growth-overall"><span>总评</span>${driverScore(person,'overall',overall,true)}${growth?trendMark(growth.overall,true):'<em class="trend new">初次评估</em>'}</div><div class="growth-attributes">${items.map(([key,label])=>`<span>${label}${driverScore(person,key,r[key],false)}${growth?trendMark(growth.deltas[key],false):'<em class="trend new">新</em>'}</span>`).join('')}</div></div>`}
function personalityBadge(profile){return `<span class="personality-label rarity-${profile.rarity||'common'}">${esc(profile.label)}<small>${rarityName(profile.rarity)}</small></span>`}
function commercialValueBadge(profile,academy){const value=profile&&profile.commercialValue;if(!value)return '';return `<span class="commercial-value commercial-${value.tone||'steady'}" title="${esc(value.description||'')}">商业价值 · <b>${esc(value.label)}</b>${academy?'<small>学院暂不计预算</small>':''}</span>`}
function personalityShiftView(name){const shift=priorPersonalityShift(name);return shift?`<div class="personality-shift">人格倾向：<span class="rarity-${shift.before.rarity||'common'}">${esc(shift.before.label)}</span><b>→</b><span class="rarity-${shift.after.rarity||'common'}">${esc(shift.after.label)}</span></div>`:''}
function planBudgetDelta(kind){const choice=state.decisionDraft&&state.decisionDraft.investment,base=kind==='midseason'?({reduce:-1,maintain:1,push:2}[choice]||0):({low:0,medium:1,high:2}[choice]||0),supplier=kind==='preseason'?({mercedes:1.25,ferrari:.65,honda:.25}[state.decisionDraft&&state.decisionDraft.engineSupplier]||.65):0;return base+supplier}
function budgetStatusView(kind,preview){const commercial=kind==='preseason'?currentCommercialPackage():null,plan={investment:state.decisionDraft&&state.decisionDraft.investment,engineSupplier:state.decisionDraft&&state.decisionDraft.engineSupplier,commercialBudgetId:commercial&&commercial.id},current=F1DecisionEngine.budgetStatus(state.decisionState,0),projected=preview&&F1DecisionEngine.projectedBudgetStatus?F1DecisionEngine.projectedBudgetStatus(state.decisionState,kind,plan):F1DecisionEngine.budgetStatus(state.decisionState,preview?planBudgetDelta(kind):0);return `<section class="budget-card tone-${projected.tone}"><div><span>预算状况</span><b>${esc(projected.label)}</b>${commercial?`<small class="commercial-support commercial-${commercial.tone}">商业支持 · ${esc(commercial.label)}</small>`:''}</div><p>${preview&&current.label!==projected.label?`当前${esc(current.label)} → 计划后${esc(projected.label)}。`:''}${esc(projected.description)}${commercial?` ${esc(commercial.description)}`:''}</p></section>`}
function engineSupplierChoices(){return F1DecisionEngine.engineSupplierOptions?F1DecisionEngine.engineSupplierOptions():[]}
function engineSupplierView(){const options=engineSupplierChoices();return `<section class="question engine-question"><h2>引擎供应商</h2><p>动力差异只带来小幅即时影响；更昂贵的方案会压缩后续研发余地。</p><div class="engine-grid">${options.map(option=>`<button class="engine-choice ${state.decisionDraft.engineSupplier===option.id?'selected':''}" onclick="setDecisionDraft('engineSupplier','${option.id}')"><span class="engine-name"><b>${esc(option.label)}</b><i>价格 · ${esc(option.price)}</i></span><span class="engine-tags"><em>动力 ${esc(option.performance)}</em><em>可靠性 ${esc(option.reliability)}</em></span><small>${esc(option.description)}</small></button>`).join('')}</div></section>`}
function carOverviewView(){
  const car=currentCar(state.playerTeam),status=F1TeamEngine.regulationStatus(state.teamState,state.year),report=state.lastCarReport&&state.lastCarReport.nextYear===state.year?state.lastCarReport:null,notice=status.current?`本赛季生效 · ${status.current.title}`:status.next&&status.next.year===state.year+1?`下赛季生效 · ${status.next.title}`:status.next?`${status.next.year} · ${status.next.title}`:'当前十年内没有更多已公布规则变动',description=status.current?status.current.description:status.next?status.next.description:'现行技术框架保持稳定。';
  return `<section class="car-overview"><div class="car-overview-head"><div><div class="eyebrow">赛车研发 · 实力 P${car.rank}</div><h2>${state.year} 赛车状态</h2></div><span class="regulation-pill">${esc(notice)}</span></div><div class="car-metrics"><span>性能${carScoreView(car,'p',car.p)}${report?`<small>${signed(report.delta.performance)}</small>`:''}</span><span>可靠性${carScoreView(car,'r',car.r)}${report?`<small>${signed(report.delta.reliability)}</small>`:''}</span><span>轮胎效率${carScoreView(car,'t',car.t)}${report?`<small>${signed(report.delta.tyre)}</small>`:''}</span></div><p><b>${esc(description)}</b> 规则变化不会增加新节点；季前与季中研发会同时影响当季，并有一部分延续到下赛季。</p></section>`;
}
function carSeasonBar(){const car=currentCar(state.playerTeam),status=F1TeamEngine.regulationStatus(state.teamState,state.year),supplier=state.decisionState&&state.decisionState.engineSupplier&&F1DecisionEngine.engineSupplier?F1DecisionEngine.engineSupplier(state.decisionState.engineSupplier):null;return `<section class="car-season-bar"><div><div class="eyebrow">当前赛车 · 实力 P${car.rank}${supplier?` · ${esc(supplier.label)}`:''}</div><div class="car-inline-scores"><span>性能${carScoreView(car,'p',car.p)}</span><span>可靠性${carScoreView(car,'r',car.r)}</span><span>轮胎${carScoreView(car,'t',car.t)}</span></div></div>${status.current?`<span>${esc(status.current.title)} · 本季生效</span>`:status.next&&status.next.year===state.year+1?`<span>${esc(status.next.title)} · 下季生效</span>`:`<span>技术周期稳定</span>`}</section>`}
function ratingStrip(person){const ratings=person.ratings||currentRatings(person);return `<div class="rating-strip"><span>速度${driverScore(person,'pace',ratings.pace,false)}</span><span>缠斗${driverScore(person,'racecraft',ratings.racecraft,false)}</span><span>稳定${driverScore(person,'consistency',ratings.consistency,false)}</span><span>轮胎${driverScore(person,'tyre',ratings.tyre,false)}</span></div>`}
function miniRatings(person){const ratings=person.ratings||currentRatings(person);return `<div class="mini-ratings"><span>速度${driverScore(person,'pace',ratings.pace,false)}</span><span>缠斗${driverScore(person,'racecraft',ratings.racecraft,false)}</span><span>稳定${driverScore(person,'consistency',ratings.consistency,false)}</span><span>轮胎${driverScore(person,'tyre',ratings.tyre,false)}</span></div>`}
function contractActions(row,own,market){
  if(row.offer){const terms=F1ContractEngine.OFFER_TYPES[row.offer.offerType],termLabel=terms?terms.label:`${row.offer.term}年合同`;if(row.offer.success&&!own){const first=state.marketDraft.seats[0]===row.driverId,second=state.marketDraft.seats[1]===row.driverId;return `<div class="contract-result success">已接受 · ${esc(termLabel)}</div><div class="contract-actions accepted"><button class="${first?'active':''}" onclick="assignTalent('${js(row.driverId)}','0')">${first?'✓ 已安排一号席':'安排一号席'}</button><button class="${second?'active':''}" onclick="assignTalent('${js(row.driverId)}','1')">${second?'✓ 已安排二号席':'安排二号席'}</button></div>`}return `<div class="contract-result ${row.offer.success?'success':'failed'}">${row.offer.success?`已续约 · ${esc(termLabel)}`:'谈判失败'} · ${esc(localizeText(row.offer.message))}</div>`}
  if(!row.actionable)return `<div class="contract-result secured">本季无需续约</div>`;
  if(!own&&market.attemptsRemaining<=0)return `<div class="contract-result secured">本季对外接触次数已用完</div>`;
  return `<div class="contract-actions">${market.offerTypes.map(option=>`<button title="${esc(option.note)}" onclick="attemptContract('${js(row.driverId)}','${option.id}')">${esc(option.label)}</button>`).join('')}</div>`;
}
function contractRow(row,own,market){
  const person=enrichPublicMeta(F1RecruitmentEngine.publicMeta(state.driverWorld,row.driverId));if(!person)return '';const profile=personalityFor(person)&&F1PersonalityEngine.publicProfile(personalityFor(person));
  return `<article class="contract-card ${row.offer&&row.offer.success?'accepted':''}"><div class="contract-card-head"><div><small>${own?'现有车手':esc(teamLabel(row.team))}</small><b>${driverNameView(person)}</b></div><span>${esc(row.contractLabel)}</span></div><div class="contract-tags"><i>意愿 · ${esc(row.interest)}</i><i>${own?'续约窗口':'挖角难度 · '+esc(row.difficulty)}</i>${profile?commercialValueBadge(profile):''}</div>${miniRatings(person)}${contractActions(row,own,market)}</article>`;
}
function contractWindowView(){
  const market=state.contractState&&F1ContractEngine.publicMarket(state.contractState,state.driverWorld);if(!market)return '';
  return `<section class="contract-window"><div class="contract-window-head"><div><div class="eyebrow">F1 合同窗口</div><h3>续约与车手接触</h3><p>合同只设 1–3 年；车手意愿受车队竞争力、现合同和职业阶段影响。点击方案即提交并保存，同一车手不能重投。</p></div><span>剩余对外接触 ${market.attemptsRemaining} / 2</span></div><div class="contract-subhead">当前阵容</div><div class="contract-grid own card-rail">${market.own.map(row=>contractRow(row,true,market)).join('')}</div><div class="contract-subhead">本季可接触车手 · 最多尝试两人</div><div class="contract-grid card-rail">${market.targets.map(row=>contractRow(row,false,market)).join('')}</div></section>`;
}
function talentCard(person){
  const profile=state.personalities[person.name]?F1PersonalityEngine.publicProfile(state.personalities[person.name]):null,draft=state.marketDraft,assigned=draft.seats.includes(person.id)||draft.academyId===person.id;
  return `<article class="talent-card ${assigned?'selected':''}"><div class="eyebrow">${esc(seriesLabel(person.series))}</div><h3>${driverNameView(person)}</h3><div class="talent-meta">${person.age} 岁</div>${profile?`<div class="talent-signals">${personalityBadge(profile)}${commercialValueBadge(profile,draft.academyId===person.id)}</div>`:''}${growthStrip(person)}${personalityShiftView(person.name)}<ul class="talent-bullets">${person.bullets.slice(0,4).map(item=>`<li>${esc(item)}</li>`).join('')}</ul><div class="talent-actions"><button class="${draft.seats[0]===person.id?'active':''}" onclick="assignTalent('${js(person.id)}','0')">F1 一号席</button><button class="${draft.seats[1]===person.id?'active':''}" onclick="assignTalent('${js(person.id)}','1')">F1 二号席</button><button class="${draft.academyId===person.id?'active':''}" onclick="assignTalent('${js(person.id)}','academy')">学院席位</button></div></article>`;
}
function refreshTalentCandidates(){const result=F1RecruitmentEngine.refreshCandidates(state.driverWorld,state.marketDraft);if(!result.ok){toast(result.message||'本年刷新机会已使用');return}state.developmentAllocation={};ensureDevelopmentAllocation();save();render();toast(result.message||'已换一批新人')}
function contractStepView(){return `<section class="step-content"><div class="step-intro"><div class="eyebrow">第一步 · 合同</div><h2>先确认现有合同与外部目标</h2><p>对外洽谈每年最多两人；接受后仍要在下一步将他安排进正式席位。</p></div>${contractWindowView()}</section>`}
function rosterSlot(person,label,empty){if(!person)return `<div class="slot"><small>${esc(label)}</small><b>${esc(empty)}</b></div>`;const profile=state.personalities[person.name]&&F1PersonalityEngine.publicProfile(state.personalities[person.name]),academy=label.includes('学院');return `<div class="slot roster-slot"><small>${esc(label)}</small><b>${driverNameView(person)}</b>${profile?`<div class="slot-signals">${personalityBadge(profile)}${commercialValueBadge(profile,academy)}</div>`:''}${growthStrip(person)}${personalityShiftView(person.name)}</div>`}
function lineupStepView(){
  const market=F1RecruitmentEngine.publicMarket(state.driverWorld,state.playerTeam),draft=state.marketDraft,candidates=draft.candidateIds.map(id=>enrichPublicMeta(F1RecruitmentEngine.publicMeta(state.driverWorld,id))).filter(Boolean),academy=F1RecruitmentEngine.academyFor(state.driverWorld,state.playerTeam),extra=academy&&!candidates.some(person=>person.id===academy.id)?[enrichPublicMeta(academy)]:[],slots=[...draft.seats,draft.academyId].map(id=>id?enrichPublicMeta(F1RecruitmentEngine.publicMeta(state.driverWorld,id)):null),recruitmentValidation=F1RecruitmentEngine.validatePlayerDraft(state.driverWorld,draft,contractRecruitmentOptions()),contractValidation=F1ContractEngine.validateDraft(state.contractState,{draft,driverWorld:state.driverWorld}),validation=contractValidation.ok?recruitmentValidation:contractValidation,retiring=market.retiring.filter(person=>(state.driverWorld.lineups[state.playerTeam]||[]).includes(person.id)),commercial=currentCommercialPackage();
  return `<section class="talent-desk"><div class="talent-desk-head"><div><div class="eyebrow">第二步 · 阵容与新人</div><h2>选定两名正赛车手与一名学院车手</h2><p>新人年龄不超过 21 岁；每年可免费换一批。只有两名正式车手的商业价值会影响预算，学院暂不计入。</p></div><div class="talent-head-actions"><button class="ghost" onclick="refreshTalentCandidates()" ${market.canRefresh?'':'disabled'}>${market.canRefresh?'换一批新人':'本年已刷新'}</button><button class="ghost" onclick="resetMarketDraft()">恢复原席位</button></div></div>${retiring.length?`<div class="feedback-box"><b>席位空缺</b><p>${retiring.map(person=>esc(driverLabel(person))).join('、')} 已决定退役，需要完成补位。</p></div>`:''}<div class="slot-strip">${rosterSlot(slots[0],'F1 一号席','等待人选')}${rosterSlot(slots[1],'F1 二号席','等待人选')}${rosterSlot(slots[2],'学院席位','请选择新人')}</div><div class="commercial-package commercial-${commercial.tone}"><span>双车商业支持</span><b>${esc(commercial.label)}</b><small>${esc(commercial.description)}</small></div><div class="talent-grid card-rail">${[...extra,...candidates].map(talentCard).join('')}</div>${validation.ok?'':`<div class="validation-note">${esc(localizeText(validation.errors[0]))}</div>`}</section>`;
}
function talentDeskView(){return `${contractStepView()}${lineupStepView()}`}
function allocationView(){
  const people=state.marketDraft?draftPeople():currentDevelopmentPeople();ensureDevelopmentAllocation();
  const levelNames={high:'高',medium:'中',low:'低'};return `<div class="allocation-grid">${people.map(person=>`<div class="allocation-row"><div class="driver-label"><b>${driverNameView(person)}</b><small>${person.role==='academy'||(!person.team&&person.series!=='Formula 1')?'学院车手':'F1 正赛车手'}</small></div>${['high','medium','low'].map(level=>`<button class="level-button ${state.developmentAllocation[person.id]===level?'active':''}" onclick="setDevelopmentLevel('${js(person.id)}','${level}')">${levelNames[level]}</button>`).join('')}</div>`).join('')}</div><p class="talent-meta">三人必须分别占用高 / 中 / 低；点击等级会自动交换资源。</p>`;
}
function planningSteps(kind){return planningStepSpecs(kind).map(step=>step.label)}
function validateLineup(){const contract=F1ContractEngine.validateDraft(state.contractState,{draft:state.marketDraft,driverWorld:state.driverWorld});if(!contract.ok)return contract;return F1RecruitmentEngine.validatePlayerDraft(state.driverWorld,state.marketDraft,contractRecruitmentOptions())}
function setPlanStep(index){const kind=state.screen==='midseason'?'midseason':'preseason',steps=planningSteps(kind),target=Math.max(0,Math.min(steps.length-1,Number(index)||0));if(kind==='preseason'&&target>1){const validation=validateLineup();if(!validation.ok){state.planStep=1;save();render();toast(validation.errors[0]);return}}state.planStep=target;ensureDevelopmentAllocation();save();render()}
function investmentChoices(kind){return kind==='midseason'?[{value:'reduce',label:'降低投入',note:'收益较小，但风险低并释放开发空间。'},{value:'maintain',label:'保持计划',note:'稳定推进，控制风险与资源消耗。'},{value:'push',label:'追加投入',note:'潜在收益最高，也更容易遭遇受挫。'}]:[{value:'low',label:'低投入',note:'保守起步，保留更多调整空间。'},{value:'medium',label:'均衡投入',note:'标准投入，收益和风险较均衡。'},{value:'high',label:'高投入',note:'激进开发，追求更高的性能上限。'}]}
function focusChoices(){return [{value:'performance',label:'性能优先',note:'优先提升绝对速度，可靠性改善较少。'},{value:'balanced',label:'均衡开发',note:'同时改善速度、可靠性与轮胎理解。'},{value:'reliability',label:'可靠性优先',note:'降低技术风险，同时获得少量性能进步。'}]}
function academyChoices(){return [{value:'fp1',label:'两次 FP1',note:'获得 F1 实车适应与更多观察信息。'},{value:'f2_title',label:'留在 F2 争冠',note:'收益上限更高，但赛季压力也更明显。'},{value:'simulator',label:'模拟器与轮胎计划',note:'稳定积累技术反馈，失败风险最低。'}]}
function planChoiceLabel(items,value){return (items.find(item=>item.value===value)||{}).label||'待选择'}
function planningSnapshotView(kind){
  const car=currentCar(state.playerTeam),commercial=kind==='preseason'?currentCommercialPackage():null,budget=F1DecisionEngine.projectedBudgetStatus?F1DecisionEngine.projectedBudgetStatus(state.decisionState,kind,{investment:state.decisionDraft&&state.decisionDraft.investment,engineSupplier:state.decisionDraft&&state.decisionDraft.engineSupplier,commercialBudgetId:commercial&&commercial.id}):F1DecisionEngine.budgetStatus(state.decisionState,planBudgetDelta(kind)),supplier=kind==='preseason'&&F1DecisionEngine.engineSupplier?F1DecisionEngine.engineSupplier(state.decisionDraft.engineSupplier||'ferrari'):null,planLabel=planChoiceLabel(investmentChoices(kind),state.decisionDraft.investment);
  return `<div class="planning-snapshot"><div><span>赛车实力</span><b>P${carRank(state.playerTeam)}</b></div><div><span>计划后预算</span><b class="budget-${budget.tone}">${esc(budget.label)}</b>${commercial?`<small>商业支持 · ${esc(commercial.label)}</small>`:''}</div><div><span>${supplier?'当前选择':'投入方案'}</span><b>${esc(supplier?supplier.label:planLabel)}</b></div></div>`;
}
function engineSupplierStepView(){return `<section class="step-content compact-choice-step engine-step"><div class="step-intro"><div class="eyebrow">动力方案</div><h2>选择本赛季引擎供应商</h2><p>三家方案的差异保持克制；价格会影响后续研发空间。</p></div>${planningSnapshotView('preseason')}${engineSupplierView()}</section>`}
function investmentStepView(kind){return `<section class="step-content compact-choice-step"><div class="step-intro"><div class="eyebrow">研发投入</div><h2>${kind==='midseason'?'决定后半程投入':'决定年度投入'}</h2><p>投入越高，潜在收益与计划受挫的风险都会提高。</p></div>${planningSnapshotView(kind)}<section class="question"><h2>${kind==='midseason'?'后半程投入':'年度投入'}</h2>${choiceGroup('investment',investmentChoices(kind))}</section></section>`}
function focusStepView(kind){return `<section class="step-content compact-choice-step"><div class="step-intro"><div class="eyebrow">研发方向</div><h2>确定技术团队的主要目标</h2><p>方向决定收益落点，不改变已经选择的投入等级。</p></div>${planningSnapshotView(kind)}<section class="question"><h2>研发方向</h2>${choiceGroup('focus',focusChoices())}</section></section>`}
function feedbackStepView(){const feedback=F1DecisionEngine.midseasonFeedback(state.decisionState);return `<section class="step-content"><div class="step-intro"><div class="eyebrow">季中调整</div><h2>前半程反馈</h2><p>这些判断是前半年决策的综合结果，用于调整下一阶段，不新增额外节点。</p></div><div class="feedback-box"><p>${feedback.performance}</p><p>${feedback.reliability}</p><p>${feedback.resources}</p></div>${budgetStatusView('midseason',false)}</section>`}
function allocationStepView(){return `<section class="step-content"><div class="step-intro"><div class="eyebrow">培养资源</div><h2>三名车手如何分配关注</h2><p>三个等级必须各用一次；高投入提高成长期望，但任何人仍可能停滞或退步。</p></div>${allocationView()}</section>`}
function academyStepView(){return `<section class="step-content"><div class="step-intro"><div class="eyebrow">学院计划</div><h2>为年轻车手选择一条路径</h2></div>${choiceGroup('academyProgram',academyChoices())}</section>`}
function reviewPlanView(kind){const people=state.marketDraft?draftPeople():currentDevelopmentPeople(),levels={high:'高',medium:'中',low:'低'},supplier=kind==='preseason'&&F1DecisionEngine.engineSupplier?F1DecisionEngine.engineSupplier(state.decisionDraft.engineSupplier||'ferrari'):null,commercial=kind==='preseason'?currentCommercialPackage():null;return `<section class="step-content review-step"><div class="step-intro"><div class="eyebrow">最后确认</div><h2>${kind==='midseason'?'提交后半程调整':'提交完整季前计划'}</h2><p>确认后本节点的合同、阵容与资源选择将正式生效。${commercial?` 双车商业支持为${esc(commercial.label)}。`:''}</p></div>${budgetStatusView(kind,true)}<div class="review-grid"><div><span>投入</span><b>${esc(planChoiceLabel(investmentChoices(kind),state.decisionDraft.investment))}</b></div><div><span>研发</span><b>${esc(planChoiceLabel(focusChoices(),state.decisionDraft.focus))}</b></div>${supplier?`<div><span>引擎</span><b>${esc(supplier.label)} · ${esc(supplier.price)}</b></div>`:''}${kind==='midseason'?`<div><span>学院</span><b>${esc(planChoiceLabel(academyChoices(),state.decisionDraft.academyProgram))}</b></div>`:''}</div><div class="review-lineup">${people.map(person=>`<div><span>${driverNameView(person)}</span><b>${levels[state.developmentAllocation[person.id]]||'中'}培养资源</b></div>`).join('')}</div></section>`}
function planningStepSpecs(kind){return kind==='midseason'?[{id:'feedback',label:'半程反馈',view:feedbackStepView},{id:'investment',label:'研发投入',view:()=>investmentStepView(kind)},{id:'focus',label:'研发方向',view:()=>focusStepView(kind)},{id:'allocation',label:'培养资源',view:allocationStepView},{id:'academy',label:'学院机会',view:academyStepView},{id:'review',label:'确认调整',view:()=>reviewPlanView(kind)}]:[{id:'contract',label:'合同洽谈',view:contractStepView},{id:'lineup',label:'阵容与新人',view:lineupStepView},{id:'engine',label:'引擎供应',view:engineSupplierStepView},{id:'investment',label:'研发投入',view:()=>investmentStepView(kind)},{id:'focus',label:'研发方向',view:()=>focusStepView(kind)},{id:'allocation',label:'培养资源',view:allocationStepView},{id:'review',label:'确认计划',view:()=>reviewPlanView(kind)}]}
function planningStepView(kind){const specs=planningStepSpecs(kind),step=Math.max(0,Math.min(specs.length-1,state.planStep||0));return specs[step].view()}
function planningNavigation(kind){const steps=planningSteps(kind),last=state.planStep===steps.length-1;return `<footer class="planning-footer"><button class="ghost" onclick="setPlanStep(${state.planStep-1})" ${state.planStep===0?'disabled':''}>上一步</button><span>${state.planStep+1} / ${steps.length}</span>${last?`<button class="primary" onclick="${kind==='midseason'?'confirmMidseason()':'confirmPreseason()'}">${kind==='midseason'?'确认调整':'开始赛季'}</button>`:`<button class="primary" onclick="setPlanStep(${state.planStep+1})">下一步</button>`}</footer>`}
function planView(kind){setTheme(state.playerTeam);const steps=planningSteps(kind),mid=kind==='midseason';return `<div class="shell viewport-shell planning-screen">${topbar()}<main class="decision-wrap planning-frame"><header class="planning-head"><div><div class="eyebrow">${state.year} · ${mid?'季中调整':'季前计划'}</div><h1>${esc(steps[state.planStep])}</h1></div><nav class="stepper" style="--plan-step-count:${steps.length}" aria-label="计划步骤">${steps.map((label,index)=>`<button class="${index===state.planStep?'active':index<state.planStep?'done':''}" onclick="setPlanStep(${index})" aria-label="${esc(label)}" ${index===state.planStep?'aria-current="step"':''}><i>${index<state.planStep?'✓':index+1}</i><span>${esc(label)}</span></button>`).join('')}</nav></header><div class="planning-scroll">${planningStepView(kind)}</div>${planningNavigation(kind)}</main></div>`}
function eventOptionCopy(event){const map={performance:[['两台赛车立即采用','直接兑现速度，但未验证方案可能受挫。'],['先在一台车上验证','保留收益，同时控制验证风险。'],['留在工厂完成验证','延后收益，优先确保方案成熟。']],reliability:[['更换全部高风险部件','最大幅度处理隐患，也承担更高资源压力。'],['只处理关键故障点','在可靠性和性能之间取中间方案。'],['降低设定保护完赛','牺牲部分机会，优先避免技术退赛。']],momentum:[['彻底转向新方案','快速追赶对手，但会放弃部分既有工作。'],['两条路线并行验证','保持调整空间，成本与风险居中。'],['坚持当前开发路线','避免方向摇摆，但可能错过窗口。']],race:[['换上新胎主动进攻','放弃赛道位置换取最大反击空间。'],['分拆两台车的策略','用两种方案覆盖不同比赛走向。'],['守住赛道位置','减少主动风险，把现有积分带回终点。']],driver:[['资源集中给反馈更强的一方','追求单车最大收益，另一名车手可能不满。'],['用折中设定照顾双车','让两名车手都能执行自己的比赛。'],['维持原有分工','不临时改变车手资源与角色。']]};return map[event.target]||map[event.category]||map.momentum}
function eventView(){setTheme(state.playerTeam);const e=state.pendingEvent,options=eventOptionCopy(e),choices=['aggressive','balanced','conservative'],risks=['高','中','低'];return `<div class="shell">${topbar()}<div class="decision-wrap"><section class="decision-head"><div class="eyebrow">第 ${state.round+1} 站 · 管理决策</div><h1>${esc(e.title)}</h1><p>${esc(e.description)}</p></section><div class="event-choices">${options.map((option,index)=>`<button class="event-choice" onclick="resolveEventChoice('${choices[index]}')"><span><b>${option[0]}</b><small>${option[1]}</small></span><span class="risk">风险 · ${risks[index]}</span></button>`).join('')}</div></div></div>`}
function finaleView(){setTheme(state.playerTeam);const finale=state.pendingFinale;return `<div class="shell">${topbar()}<div class="decision-wrap"><section class="decision-head"><div class="eyebrow">第 24 站 · 条件触发</div><h1>阿布扎比最终决战</h1><p>${[finale.titleText,finale.teamText].filter(Boolean).map(esc).join(' ')}</p></section><div class="event-choices"><button class="event-choice" onclick="resolveFinaleChoice('aggressive')"><span><b>围绕争冠车手执行单一进攻策略</b><small>把升级、进站窗口和赛道位置全部押在最高目标上。</small></span><span class="risk">风险 · 高</span></button><button class="event-choice" onclick="resolveFinaleChoice('balanced')"><span><b>双车分拆策略覆盖比赛</b><small>一台车主动进攻，另一台车保护车队积分。</small></span><span class="risk">风险 · 中</span></button><button class="event-choice" onclick="resolveFinaleChoice('conservative')"><span><b>优先确保双车完赛</b><small>减少意外损失，守住已经掌握的积分位置。</small></span><span class="risk">风险 · 低</span></button></div></div></div>`}
function resultCopy(key){return {breakthrough:['重大突破','计划取得了远超预期的效果。','🚀'],success:['计划成功','车队顺利兑现了这次机会。','✓'],progress:['取得进展','结果并不惊艳，但车队获得了实际帮助。','↗'],setback:['计划受挫','方案没有达到预期，车队需要消化这次结果。','⚠'],no_change:['没有明显变化','车队避免了损失，但也没有获得实际提升。','—']}[key]||['决定已执行','结果已经计入本赛季。','✓']}
function decisionResultView(){setTheme(state.playerTeam);const copy=resultCopy(state.lastDecisionResult.key),reaction=state.lastDecisionResult.personalityReaction,academy=state.lastDecisionResult.academyResult,shift=reaction&&reaction.labelChanged?{before:labelInfo(reaction.labelBefore),after:labelInfo(reaction.labelAfter)}:null;return `<div class="shell viewport-shell flow-shell decision-result-screen">${topbar()}<main class="decision-frame"><div class="decision-panel-scroll"><section class="summary-hero compact-summary decision-result-card"><div class="outcome-icon">${copy[2]}</div><div class="eyebrow">决策结果</div><h1>${copy[0]}</h1><h2>${esc(state.lastDecisionResult.title||'季中调整完成')}</h2><p>${copy[1]}</p><p>具体数值保持隐藏，实际效果会在之后的比赛与年度报告中逐渐体现。</p>${budgetStatusView('season',false)}${academy?`<div class="reaction-box"><b>${driverNameView(academy.driver)} · ${esc(academy.label)}</b><p>${esc(academy.text)}</p></div>`:''}${reaction?`<div class="reaction-box"><b>${driverNameView(reaction.driver)} · ${esc(reaction.label)}</b><p>${esc(reaction.text)}</p>${shift?`<p>人格倾向：<span class="rarity-${shift.before.rarity}">${esc(shift.before.label)}</span> → <span class="rarity-${shift.after.rarity}">${esc(shift.after.label)}</span></p>`:''}</div>`:''}</section></div></main>${flowDock('decision')}</div>`}
function topbar(){const progress=state.playerTeam?careerProgress():null,shown=progress?Math.min(10,progress.seasons.length+(['summary','legacy'].includes(state.screen)?0:1)):null;return `<header class="topbar"><div class="brand"><span class="mark"></span><div><strong>F1 车队领队</strong><small>Beta 0.1${progress?` · 第 ${shown}/10 年`:''}</small></div></div><div class="top-actions"><button class="ghost" onclick="save();toast('进度已保存')">保存</button><button class="ghost danger" onclick="resetGame()">重新开始</button></div></header>`}
function playerStats(){const p=teamPoints(),ds=teamDrivers(state.playerTeam),last=state.history.at(-1),budget=F1DecisionEngine.budgetStatus(state.decisionState,0);return `<section class="stats"><div class="stat"><span>车队排名</span><b>P${rankOfTeam(state.playerTeam)}</b></div><div class="stat"><span>车队积分</span><b>${p[state.playerTeam]}</b></div><div class="stat"><span>赛季胜场</span><b>${ds.reduce((n,d)=>n+(state.driverWins[d.name]||0),0)}</b></div><div class="stat"><span>预算状况</span><b class="budget-${budget.tone}">${esc(budget.label)}</b></div><div class="stat"><span>最近一站</span><b>${last?bestTeamFinish(last.result,state.playerTeam):'—'}</b></div></section>`}
function historicalScore(value,precision){return scoreMarkup(value,null,!!precision,'')}
function developmentText(report){if(!report||!report.changes.length)return '评分保持稳定';const labels={pace:'速度',racecraft:'缠斗',consistency:'稳定',tyre:'轮胎'};return report.changes.map(x=>`${labels[x.attribute]} ${historicalScore(x.from,false)}<i class="change-arrow">→</i>${historicalScore(x.to,false)}`).join('<span class="change-separator"> · </span>')}
function personalityPanel(){return `<section class="personality-grid">${teamDrivers(state.playerTeam).map(d=>{const p=F1PersonalityEngine.publicProfile(state.personalities[d.name]),c=F1CareerEngine.publicCareer(state.careerState,d.name),contract=state.contractState&&F1ContractEngine.publicContract(state.contractState,state.driverWorld,d.id,state.year);return `<article class="personality-card"><div class="eyebrow">正赛车手</div><h3>${driverNameView(d)}</h3><div class="driver-signals">${personalityBadge(p)}${commercialValueBadge(p)}</div><div class="career-meta"><span>${c.age} 岁</span><span>${c.starts} 场 · ${c.wins} 胜 · ${c.podiums} 次领奖台</span>${contract?`<span>${esc(contract.label)}</span>`:''}</div>${growthStrip({...d,ratings:c.ratings})}${personalityShiftView(d.name)}<p class="personality-summary">${esc(p.summary)}</p><ul class="observations">${p.observations.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`}).join('')}</section>`}
function academyBar(){const academy=currentAcademy(state.playerTeam);if(!academy)return '';const profile=F1PersonalityEngine.publicProfile(state.personalities[academy.name]);return `<section class="academy-bar academy-detail"><div class="academy-copy"><div class="eyebrow">车队学院</div><h3>${driverNameView(academy)} · ${academy.age} 岁</h3><div class="driver-signals">${personalityBadge(profile)}${commercialValueBadge(profile,true)}</div>${state.academyProgramResult?`<p>${esc(state.academyProgramResult.label)}</p>`:''}${personalityShiftView(academy.name)}</div>${growthStrip(academy)}</section>`}
function resetPanelScroll(selector){const panel=typeof document!=='undefined'&&document.querySelector&&document.querySelector(selector);if(panel)panel.scrollTop=0}
function setSeasonPanel(panel){state.seasonPanel=['overview','results','standings','drivers'].includes(panel)?panel:'overview';save();render();resetPanelScroll('.season-panel-scroll')}
function setSummaryPanel(panel){state.summaryPanel=['overview','development','review','standings'].includes(panel)?panel:'overview';save();render();resetPanelScroll('.summary-panel-scroll')}
function setStandingsTab(tab){state.standingsTab=tab==='teams'?'teams':'drivers';save();render();resetPanelScroll('.standing-list')}
function seasonPanelNav(){const items=[['overview','比赛中心'],['results','最近赛果'],['standings','积分榜'],['drivers','车手状态']];return `<nav class="panel-tabs" aria-label="赛季页面">${items.map(([id,label])=>`<button class="${state.seasonPanel===id?'active':''}" onclick="setSeasonPanel('${id}')">${label}</button>`).join('')}</nav>`}
function driverStatusLauncher(){const names=teamDrivers(state.playerTeam).map(driverNameView).join(' · ');return `<button class="quick-card driver-status-launcher compact-launcher" onclick="setSeasonPanel('drivers')"><small>车手与学院</small><b>车手状态</b><span>${names}</span></button>`}
function driverStatusPanel(){return `<section class="panel-section"><header class="panel-heading"><div><div class="eyebrow">${state.year} · ${esc(teamLabel(state.playerTeam))}</div><h1>车手状态</h1></div><small>成长箭头对比上一个已完成赛季</small></header><p class="rarity-note">人格颜色仅表示类型稀有度，不代表性格好坏。</p>${personalityPanel()}${academyBar()}</section>`}
function bestTeamFinish(result,team){const x=result.filter(r=>r.team===team&&!r.dnf).sort((a,b)=>a.pos-b.pos)[0];return x?'P'+x.pos:'DNF'}
function raceAdvanceModel(){const done=state.round>=RACES.length;if(done)return {label:'查看赛季总结',action:'openSummary()'};const mid=state.round>=12&&!state.decisionState.midseason,upcoming=F1DecisionEngine.scheduledEventForRound(state.decisionState,state.round+1),finale=state.round===23&&!state.finaleHandled&&finaleSituation();return {label:mid?'进入季中调整':upcoming||finale?'处理决策':'模拟下一站',action:'simulateNext()'}}
function flowDock(kind){if(kind==='decision')return `<footer class="advance-dock"><span></span><span class="dock-status">决策已记录</span><button class="primary flow-primary" onclick="continueAfterDecision()">继续赛季</button></footer>`;if(kind==='summary'){const progress=careerProgress(),complete=progress.completed;return `<footer class="advance-dock"><button class="ghost" onclick="setSummaryPanel('standings')">最终积分榜</button><span class="dock-status">${state.year} 赛季完成</span><button class="primary flow-primary" onclick="${complete?"state.screen='legacy';save();render()":'nextSeason()'}">${complete?'查看十年结算':`开始 ${state.year+1} 赛季`}</button></footer>`}const action=raceAdvanceModel(),done=state.round>=RACES.length;return `<footer class="advance-dock"><button class="ghost quick-advance" onclick="${done?"setSeasonPanel('standings')":'simulateToDecision()'}">${done?'最终积分榜':'推进至下一决策'}</button><span class="dock-status">${done?'24 / 24':`下一站 · ${state.round+1}/24`}</span><button class="primary flow-primary" data-flow-action onclick="${action.action}">${action.label}</button></footer>`}
function nextRaceCard(){const done=state.round>=RACES.length,last=state.history.at(-1),upcoming=done?null:F1DecisionEngine.scheduledEventForRound(state.decisionState,state.round+1),mid=state.round>=12&&!state.decisionState.midseason,finale=state.round===23&&!state.finaleHandled&&finaleSituation();return `<section class="card race-focus"><div class="race-next"><div class="race-count">${done?'赛季完成':`第 ${String(state.round+1).padStart(2,'0')} / 24 站`}</div><h2>${done?'赛季已结束':raceLabel(RACES[state.round])}</h2><p>${done?'年度结算已经完成，可查看冠军、最终排名和成长报告。':mid?'下一步将先进行季中调整。':upcoming?'本轮比赛前存在一个管理决策。':finale?'末站仍可能改变关键冠军或车队位置。':'一键生成最终名次；异常情况只作为解释标签。'}</p><div class="progress">${RACES.map((_,i)=>`<i class="${i<state.round?'done':''}"></i>`).join('')}</div>${last&&last.type!=='Normal'?`<span class="tag ${last.type==='Chaos'?'chaos':''}">${raceTypeLabel(last.type)} · ${eventReasonLabel(last.label)}</span>`:''}</div></section>`}
function visibleDriver(row){return row&&row.id&&state.driverWorld&&F1RecruitmentEngine.publicMeta(state.driverWorld,row.id)||activeDrivers().find(driver=>driver.name===(row&&row.name))||row&&row.name}
function visibleDriverLabel(row){return driverLabel(visibleDriver(row))}
function latestResult(){const last=state.history.at(-1);if(!last)return `<section class="card result-window"><div class="card-head"><h2>最近比赛</h2></div><div class="empty">赛季尚未开始。模拟第一站后，赛果会显示在这里。</div></section>`;const important=new Set(last.result.filter(r=>r.team===state.playerTeam).map(r=>r.name)),rows=last.result.filter((r,i)=>i<6||important.has(r.name)),reaction=last.personalityReaction;return `<section class="card result-window"><div class="card-head"><div><h2>${esc(raceLabel(last.race))}</h2><small>${last.upset?upsetLabel(last.upset)+' · ':''}${raceTypeLabel(last.type)}</small></div><small>前六 + 玩家车队</small></div><ol class="result-list panel-list">${rows.map(r=>`<li class="result-row ${r.team===state.playerTeam?'player-row':''}"><span class="pos ${r.dnf?'dnf':''}">${r.dnf?'DNF':'P'+r.pos}</span><span class="name">${driverNameView(visibleDriver(r))}<small>${esc(teamLabel(r.team))}</small></span><span class="team-name">${r.dnf?'退赛':r.points?'积分区':'完赛'}</span><span class="pts">${r.points?`+${r.points}`:'—'}</span></li>`).join('')}</ol>${reaction?`<div class="reaction-box compact-reaction"><b>${driverNameView(reaction.driver)} · ${esc(reaction.label)}</b><p>${esc(reaction.text)}</p></div>`:''}</section>`}
function standingsCard(){const p=teamPoints(),tab=state.standingsTab||'drivers';let rows;if(tab==='drivers')rows=driverStandings().map((d,i)=>`<li class="standing-row ${d.team===state.playerTeam?'player-row':''}"><span class="pos">${i+1}</span><span class="name">${driverNameView(d)}<small>${esc(teamLabel(d.team))}</small></span><span class="team-name">${state.driverWins[d.name]||0} 胜 · ${state.driverDnfs[d.name]||0} 退赛</span><span class="pts">${state.driverPoints[d.name]||0}</span></li>`);else rows=teamStandings().map((t,i)=>`<li class="standing-row ${t.team===state.playerTeam?'player-row':''}"><span class="pos">${i+1}</span><span class="name">${esc(teamLabel(t.team))}<small>${teamDrivers(t.team).map(driverNameView).join(' · ')}</small></span><span class="team-name car-standing-score">性能 ${carScoreView(t,'p',t.p)}</span><span class="pts">${p[t.team]}</span></li>`);return `<section class="card standing-window"><div class="card-head"><h2>积分榜</h2><div class="tabs"><button class="tab ${tab==='drivers'?'active':''}" onclick="setStandingsTab('drivers')">车手</button><button class="tab ${tab==='teams'?'active':''}" onclick="setStandingsTab('teams')">车队</button></div></div><ol class="standing-list panel-list">${rows.join('')}</ol></section>`}
function resultPreview(){const last=state.history.at(-1);if(!last)return `<button class="quick-card" onclick="setSeasonPanel('results')"><small>最近赛果</small><b>等待首站</b><span>模拟后在小窗查看</span></button>`;const winner=last.result.find(row=>!row.dnf&&row.pos===1),ours=last.result.filter(row=>row.team===state.playerTeam).map(row=>row.dnf?'退赛':`P${row.pos}`).join(' · ');return `<button class="quick-card" onclick="setSeasonPanel('results')"><small>${esc(raceLabel(last.race))}</small><b>${winner?driverNameView(visibleDriver(winner)):'—'}</b><span>本队 ${ours||'—'} · 查看赛果</span></button>`}
function standingsPreview(){const leader=driverStandings()[0],team=teamStandings()[0],player=rankOfTeam(state.playerTeam);return `<button class="quick-card" onclick="setSeasonPanel('standings')"><small>积分榜</small><b>${driverNameView(leader)}</b><span>${esc(teamLabel(team.team))} 领跑 · 本队 P${player}</span></button>`}
function seasonOverviewPanel(){return `<section class="panel-section overview-panel"><section class="dashboard-head compact-dashboard"><div><div class="eyebrow">${state.year} 世界锦标赛</div><h1>${esc(teamLabel(state.playerTeam))}</h1></div><div class="season-meta">赛季进度<b>${state.round} / 24</b></div></section>${playerStats()}${carSeasonBar()}${nextRaceCard()}<div class="quick-grid">${resultPreview()}${standingsPreview()}${driverStatusLauncher()}</div></section>`}
function seasonView(){setTheme(state.playerTeam);const panel=state.seasonPanel==='results'?latestResult():state.seasonPanel==='standings'?standingsCard():state.seasonPanel==='drivers'?driverStatusPanel():seasonOverviewPanel(),fixed=state.seasonPanel==='standings'?' fixed-list-panel':'';return `<div class="shell viewport-shell flow-shell season-screen">${topbar()}<main class="season-frame">${seasonPanelNav()}<div class="season-panel-scroll${fixed}">${panel}</div></main>${flowDock('season')}</div>`}
function summaryPanelNav(){const items=[['overview','冠军总览'],['development','成长报告'],['review','管理复盘'],['standings','最终积分']];return `<nav class="panel-tabs summary-tabs" aria-label="赛季总结页面">${items.map(([id,label])=>`<button class="${state.summaryPanel===id?'active':''}" onclick="setSummaryPanel('${id}')">${label}</button>`).join('')}</nav>`}
function summaryView(){
  setTheme(state.playerTeam);const ds=driverStandings(),ts=teamStandings(),p=teamPoints(),playerPos=ts.findIndex(t=>t.team===state.playerTeam)+1,drivers=teamDrivers(state.playerTeam),academy=currentAcademy(state.playerTeam),decision=F1DecisionEngine.seasonSummary(state.decisionState),stories=state.personalityStoryLog.filter(x=>x.year===state.year),development=(state.lastDevelopmentReport||[]).filter(x=>x.team===state.playerTeam),best=[...drivers].sort((a,b)=>(state.driverPoints[b.name]||0)-(state.driverPoints[a.name]||0))[0],car=state.lastCarReport,contracts=state.lastContractReport||{externalSigningIds:[],renewalIds:[],failedOfferIds:[]},progress=careerProgress(),complete=progress.completed,supplier=F1DecisionEngine.currentEngineSupplier?F1DecisionEngine.currentEngineSupplier(state.decisionState):null;
  const carReport=car?`<section class="car-report-card"><div><div class="eyebrow">${complete?'最终赛车研发':`${car.nextYear} 赛车展望`} · 实力 P${car.rankAfter}</div><h3>${esc(car.direction)}</h3><p class="car-change-row"><span>性能 ${historicalScore(car.playerBefore.performance,false)}<i>→</i>${historicalScore(car.playerAfter.performance,false)}</span><span>可靠性 ${historicalScore(car.playerBefore.reliability,false)}<i>→</i>${historicalScore(car.playerAfter.reliability,false)}</span><span>轮胎 ${historicalScore(car.playerBefore.tyre,false)}<i>→</i>${historicalScore(car.playerAfter.tyre,false)}</span></p></div>${car.regulation?`<span class="regulation-pill">${esc(car.regulation.title)} · 生效</span>`:'<span class="regulation-pill">规则周期稳定</span>'}</section>`:'';
  const panels={
    overview:`<section class="summary-hero compact-summary"><div class="trophy">🏆</div><div class="eyebrow">${state.year} 赛季完成 · ${progress.seasons.length}/10</div><h1>${driverNameView(ds[0])}</h1><h2>世界车手冠军 · ${esc(teamLabel(ts[0].team))} 车队冠军</h2><p>${esc(teamLabel(state.playerTeam))} 最终获得车队第 ${playerPos} 名，共 ${p[state.playerTeam]} 分。</p><div class="summary-grid"><div class="stat"><span>玩家车队排名</span><b>P${playerPos}</b></div><div class="stat"><span>赛季胜场</span><b>${drivers.reduce((n,d)=>n+(state.driverWins[d.name]||0),0)}</b></div><div class="stat"><span>管理节点</span><b>${decision.decisions}</b></div></div></section>`,
    development:`<section class="panel-section summary-section"><header class="panel-heading"><div><div class="eyebrow">赛车与人才</div><h1>年度成长报告</h1></div><small>公开评分会跨赛季变化</small></header>${carReport}<div class="report-grid">${development.map(report=>`<div class="report-card"><b>${driverNameView(report.name)}${report.role==='academy'?' · 学院':''}</b><p>${developmentText(report)}</p></div>`).join('')||'<div class="empty">本季没有可显示的成长记录。</div>'}</div></section>`,
    review:`<section class="panel-section summary-section"><header class="panel-heading"><div><div class="eyebrow">车队运营</div><h1>管理复盘</h1></div><small>${supplier?`${esc(supplier.label)}引擎 · 价格${esc(supplier.price)}`:''}</small></header><ul class="decision-log compact-log"><li><b>管理结果：</b>${decision.setbacks} 次受挫，其余节点取得正向或稳定结果。</li><li><b>预算状况：</b>${esc(F1DecisionEngine.budgetStatus(state.decisionState,0).label)}。</li><li><b>合同市场：</b>${(contracts.externalSigningIds||[]).length} 名外队车手加盟，${(contracts.renewalIds||[]).length} 次续约，${(contracts.failedOfferIds||[]).length} 次洽谈未果。</li><li><b>最佳车手：</b>${driverNameView(best)}</li><li><b>学院车手：</b>${academy?`${driverNameView(academy)}，${esc(state.academyProgramResult?state.academyProgramResult.label:'完成年度培养')}`:'本赛季没有学院车手'}</li><li><b>人格故事：</b>记录了 ${stories.length} 次可见反应。</li>${stories.slice(-3).map(x=>`<li><b>${driverNameView(x.driver)}：</b>${esc(x.text)}</li>`).join('')}</ul></section>`,
    standings:standingsCard(),
  },fixed=state.summaryPanel==='standings'?' fixed-list-panel':'';
  return `<div class="shell viewport-shell flow-shell summary-screen">${topbar()}<main class="summary-frame">${summaryPanelNav()}<div class="summary-panel-scroll${fixed}">${panels[state.summaryPanel]||panels.overview}</div></main>${flowDock('summary')}</div>`;
}
function legacyView(){
  setTheme(state.playerTeam);const progress=careerProgress(),result=progress.final;if(!result){state.screen='summary';return summaryView()}
  return `<div class="shell"><div class="summary">${topbar()}<section class="summary-hero legacy-hero"><div class="eyebrow">十年生涯遗产 · ${progress.startYear}–${progress.startYear+9}</div><div class="career-score">${result.score}</div><h1>${esc(result.grade)} · ${esc(result.title)}</h1><p>${esc(localizeText(result.summary))}</p><div class="legacy-components"><div><span>竞技成绩</span><b>${result.components.sportingResults}</b></div><div><span>超额表现</span><b>${result.components.expectation}</b></div><div><span>车队建设</span><b>${result.components.teamBuilding}</b></div><div><span>管理执行</span><b>${result.components.management}</b></div></div><ul class="decision-log">${result.stories.map(story=>`<li>${esc(localizeText(story))}</li>`).join('')}</ul><div class="career-table-wrap"><table class="career-table"><thead><tr><th>赛季</th><th>赛车</th><th>车队</th><th>积分</th><th>胜场</th></tr></thead><tbody>${progress.seasons.map(row=>`<tr><td>${row.year}</td><td>P${row.carRank}</td><td>P${row.teamPosition}${row.constructorChampion?' · 冠军':''}</td><td>${row.points}</td><td>${row.wins}</td></tr>`).join('')}</tbody></table></div><div class="summary-actions"><button class="ghost" onclick="state.screen='summary';render()">查看最后赛季</button><button class="primary" onclick="resetGame()">开始新的十年</button></div></section><div class="footer-note">生涯分同时评价冠军、相对赛车实力的超额成绩、长期赛车建设与学院提拔，不会只奖励开局最强车队。</div></div></div>`;
}
function render(){if(!state)state=seedState();scorePoolsCache=null;const locked=['preseason','midseason','season','decisionResult','summary'].includes(state.screen);if(document.body&&document.body.classList)document.body.classList.toggle('viewport-lock',locked);if(document.documentElement&&document.documentElement.classList)document.documentElement.classList.toggle('viewport-lock-root',locked);const views={select:selectionView,preseason:()=>planView('preseason'),midseason:()=>planView('midseason'),event:eventView,finale:finaleView,decisionResult:decisionResultView,summary:summaryView,legacy:legacyView,season:seasonView},base=(views[state.screen]||seasonView)(),overlay=achievementPanelOpen?achievementLibraryView():achievementPopupView();if(document.body&&document.body.classList)document.body.classList.toggle('modal-open',!!overlay);document.getElementById('app').innerHTML=base+overlay;if(locked){document.documentElement.scrollTop=0;document.body.scrollTop=0;if(typeof window!=='undefined'&&typeof window.scrollTo==='function')window.scrollTo(0,0)}}
state=seedState();render();
