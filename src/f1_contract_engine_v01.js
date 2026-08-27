/* F1 Team Principal — contracts and seat market V0.1
 * Contract length, renewal windows and direct approaches without a finance minigame.
 * Negotiation rolls are created once per offseason so reloads cannot reroll outcomes.
 */
(function(root){
  'use strict';

  const SCHEMA_VERSION=1;
  const OFFER_TYPES={
    short:{id:'short',term:1,label:'短约 · 1年',note:'只承诺一个赛季，适合保留调整空间。'},
    standard:{id:'standard',term:2,label:'标准 · 2年',note:'两年保障，通常是最均衡的方案。'},
    long:{id:'long',term:3,label:'长约 · 3年',note:'三年共同建设，对年轻车手更有吸引力。'},
  };

  function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function hash(value){let h=2166136261;for(const char of String(value)){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function unit(value,salt){return (hash(`${salt}:${value}`)%10001)/10000}
  function overall(driver){const r=driver&&driver.ratings||{};return .5*(Number(r.pace)||0)+.25*(Number(r.racecraft)||0)+.15*(Number(r.consistency)||0)+.1*(Number(r.tyre)||0)}
  function placementMap(world){
    const out={};
    (world.teams||[]).forEach(team=>{
      (world.lineups[team]||[]).forEach(id=>{out[id]={driverId:id,team,role:'f1'}});
      const academy=world.academy&&world.academy[team];if(academy)out[academy]={driverId:academy,team,role:'academy'};
    });
    return out;
  }
  function profileFor(state,id,random){
    if(!state.secrets.profiles[id])state.secrets.profiles[id]={ambition:.25+(typeof random==='function'?random():unit(id,'ambition'))*.7,loyalty:.2+(typeof random==='function'?random():unit(id,'loyalty'))*.75,security:.2+(typeof random==='function'?random():unit(id,'security'))*.75};
    return state.secrets.profiles[id];
  }
  function syncPersonalityProfiles(state,valuesById){
    if(!valuesById||typeof valuesById!=='object')return;
    Object.entries(valuesById).forEach(([id,values])=>{if(!values||typeof values!=='object')return;const ambition=Number(values.ambition),loyalty=Number(values.loyalty),professionalism=Number(values.professionalism),resilience=Number(values.resilience);if(![ambition,loyalty,professionalism,resilience].every(Number.isFinite))return;state.secrets.profiles[id]={ambition:clamp(ambition/10,.1,.95),loyalty:clamp(loyalty/10,.1,.95),security:clamp((professionalism+resilience)/20,.1,.95)}});
  }
  function contractId(id,team,year,serial){return `contract:${year}:${team}:${id}:${serial}`}
  function legacyContract(state,id,placement,year,careerEndYear){
    const term=placement.role==='academy'?1:1+(hash(`${id}:${placement.team}:legacy`)%3);
    state.serial+=1;
    return {contractId:contractId(id,placement.team,year,state.serial),driverId:id,team:placement.team,role:placement.role,startYear:year,endYear:Math.min(Number(careerEndYear)||year+term-1,year+term-1),source:'legacy'};
  }
  function teamRank(strengths,team){const value=strengths&&strengths[team];if(Number.isFinite(Number(value)))return clamp(Number(value),1,11);if(value&&Number.isFinite(Number(value.rank)))return clamp(Number(value.rank),1,11);return 6}
  function contractStatus(contract,year){if(!contract)return 'free';if(contract.endYear<year)return 'expired';if(contract.endYear===year)return 'expiring';return 'secured'}
  function statusLabel(status,endYear){return status==='free'?'自由车手':status==='expired'?'合同已到期':status==='expiring'?`${endYear} 到期`:`合同至 ${endYear}`}
  function interestLabel(score){return score>=.68?'高':score>=.45?'中':'低'}
  function difficultyLabel(score,status){const adjusted=score+(status==='expired'?.14:status==='expiring'?.07:0);return adjusted>=.72?'较低':adjusted>=.50?'中等':'较高'}
  function usablePending(pending,world,year){
    if(!pending||typeof pending!=='object'||Number(pending.year)!==year||!(world.teams||[]).includes(pending.playerTeam))return false;
    if(!Array.isArray(pending.ownIds)||!Array.isArray(pending.targetIds)||!Array.isArray(pending.aiOutgoingIds)||!pending.interestScores||typeof pending.interestScores!=='object'||!pending.rolls||typeof pending.rolls!=='object'||!pending.offers||typeof pending.offers!=='object')return false;
    if(pending.ownIds.length>2||pending.targetIds.length>3||pending.maxExternalAttempts!==2||!Number.isInteger(pending.externalAttempts)||pending.externalAttempts<0||pending.externalAttempts>pending.maxExternalAttempts||!Number.isFinite(Number(pending.careerEndYear))||Number(pending.careerEndYear)<year)return false;
    const placements=placementMap(world),ids=[...pending.ownIds,...pending.targetIds];if(new Set(ids).size!==ids.length)return false;
    if(pending.ownIds.some(id=>!world.drivers[id]||!placements[id]||placements[id].team!==pending.playerTeam||placements[id].role!=='f1'))return false;
    if(pending.targetIds.some(id=>!world.drivers[id]||!placements[id]||placements[id].team===pending.playerTeam||placements[id].role!=='f1'))return false;
    if(ids.some(id=>!Number.isFinite(Number(pending.interestScores[id]))||Number(pending.interestScores[id])<0||Number(pending.interestScores[id])>1||!Number.isFinite(Number(pending.rolls[id]))||Number(pending.rolls[id])<0||Number(pending.rolls[id])>=1))return false;
    const offers=Object.entries(pending.offers);if(offers.some(([id,offer])=>!ids.includes(id)||!offer||offer.driverId!==id||offer.targetTeam!==pending.playerTeam||typeof offer.success!=='boolean'||!OFFER_TYPES[offer.offerType]||Number(offer.term)!==OFFER_TYPES[offer.offerType].term||!!offer.renewal!==pending.ownIds.includes(id)))return false;
    if(offers.filter(([id])=>pending.targetIds.includes(id)).length!==pending.externalAttempts)return false;
    return pending.aiOutgoingIds.every(id=>world.drivers[id]&&placements[id]&&placements[id].role==='f1'&&placements[id].team!==pending.playerTeam);
  }
  function publicOffer(result,world){
    if(!result)return null;const driver=world&&world.drivers&&world.drivers[result.driverId];
    return {driverId:result.driverId,driver:driver?driver.name:'Unknown',success:!!result.success,status:result.success?'accepted':'rejected',offerType:result.offerType,term:result.term,renewal:!!result.renewal,message:result.message};
  }

  function newState(world,random,startYear,options){
    const year=Number(startYear)||2026,careerEnd=Number(options&&options.careerEndYear)||year+9,state={schemaVersion:SCHEMA_VERSION,startYear:year,currentYear:year,serial:0,contracts:{},history:[],processedYears:{},pending:null,secrets:{profiles:{}}};
    const placements=placementMap(world);syncPersonalityProfiles(state,options&&options.personalityValuesById);
    Object.keys(world.drivers||{}).forEach(id=>profileFor(state,id,random));
    Object.values(placements).forEach(placement=>{state.contracts[placement.driverId]=legacyContract(state,placement.driverId,placement,year,careerEnd)});
    return state;
  }

  function migrateState(raw,world,random,currentYear,options){
    const year=Number(currentYear)||Number(world&&world.currentYear)||2026,opts=options||{},careerEnd=Number(opts.careerEndYear)||year+9;
    if(!raw||typeof raw!=='object'||!raw.contracts)return newState(world,random,year,{careerEndYear:careerEnd,personalityValuesById:opts.personalityValuesById});
    const state=raw;state.schemaVersion=SCHEMA_VERSION;state.startYear=Number(state.startYear)||year;state.currentYear=Number(state.currentYear)||year;state.serial=Math.max(0,Math.round(Number(state.serial)||0));state.history=Array.isArray(state.history)?state.history:[];state.processedYears=state.processedYears&&typeof state.processedYears==='object'?state.processedYears:{};state.secrets=state.secrets&&typeof state.secrets==='object'?state.secrets:{profiles:{}};state.secrets.profiles=state.secrets.profiles&&typeof state.secrets.profiles==='object'?state.secrets.profiles:{};state.contracts=state.contracts&&typeof state.contracts==='object'?state.contracts:{};
    const placements=placementMap(world),clean={};syncPersonalityProfiles(state,opts.personalityValuesById);
    Object.keys(world.drivers||{}).forEach(id=>profileFor(state,id,random));
    Object.values(placements).forEach(placement=>{
      const current=state.contracts[placement.driverId],valid=current&&current.driverId===placement.driverId&&current.team===placement.team&&current.role===placement.role&&Number.isFinite(Number(current.startYear))&&Number.isFinite(Number(current.endYear))&&Number(current.endYear)>=Number(current.startYear);
      const normalizedEnd=valid?Math.min(Number(current.endYear),careerEnd):NaN,usable=valid&&Number(current.startYear)<=year&&normalizedEnd>=Number(current.startYear)&&(opts.preserveExpired||normalizedEnd>=year);
      clean[placement.driverId]=usable?{...current,startYear:Number(current.startYear),endYear:normalizedEnd}:legacyContract(state,placement.driverId,placement,year,careerEnd);
    });
    state.contracts=clean;
    if(state.pending&&!usablePending(state.pending,world,year))state.pending=null;
    return state;
  }

  function driverInterest(state,world,id,targetTeam,context){
    const driver=world.drivers[id],placements=placementMap(world),placement=placements[id],contract=state.contracts[id],year=Number(context.year),strengths=context.teamStrengths||{},profile=profileFor(state,id),fromRank=placement?teamRank(strengths,placement.team):11,toRank=teamRank(strengths,targetTeam),rating=overall(driver),status=contractStatus(contract,year);
    let score=.46+(fromRank-toRank)*.055+(6-toRank)*.018+(profile.ambition-.5)*(rating>=84?.22:.10)-(profile.loyalty-.5)*(placement&&placement.team!==targetTeam?.18:.05);
    if(placement&&placement.team===targetTeam)score=.64+profile.loyalty*.18-(rating-82)*Math.max(0,toRank-5)*.005;
    if(status==='expired')score+=.16;else if(status==='expiring')score+=.08;else if(placement&&placement.team!==targetTeam)score-=.10+Math.max(0,contract.endYear-year-1)*.035;
    if(driver&&driver.age>=37)score+=(profile.security-.5)*.12;
    return clamp(score,.12,.90);
  }

  function aiOutgoingPlan(state,world,context,random){
    if(context.initial)return [];
    const year=Number(context.year),playerTeam=context.playerTeam,strengths=context.teamStrengths||{},rows=[],excluded=new Set(context.retirementIds||[]);
    (world.teams||[]).filter(team=>team!==playerTeam).forEach(team=>{
      (world.lineups[team]||[]).filter(id=>!excluded.has(id)).forEach(id=>{const driver=world.drivers[id],contract=state.contracts[id],status=contractStatus(contract,year);if(status!=='expired')return;const rating=overall(driver),rank=teamRank(strengths,team),profile=profileFor(state,id);let pressure=.68+(78-rating)*.018+(rank<=4?Math.max(0,88-rating)*.012:0)+(profile.ambition-.5)*Math.max(0,rank-4)*.16+random()*.14;rows.push({id,team,pressure})});
    });
    // Keep the grid lively without turning every winter into a reset: aim for
    // roughly one additional AI vacancy compared with the original tuning.
    const desired=[3,4,4,5][Math.floor(random()*4)],selected=[];
    rows.sort((a,b)=>b.pressure-a.pressure);
    for(const row of rows){if(selected.length>=desired)break;if(row.pressure<.27)continue;const same=selected.filter(item=>item.team===row.team).length;if(same>=1&&random()>.18)continue;selected.push(row)}
    return selected.map(row=>row.id);
  }

  function prepareOffseason(state,context,random){
    const ctx=context||{},year=Number(ctx.year)||state.currentYear;
    if(year>Number(ctx.careerEndYear||Infinity))throw new Error('Contract market cannot prepare beyond the career');
    if(state.processedYears[String(year)])return {processed:true,report:clone(state.processedYears[String(year)])};
    if(state.pending&&state.pending.year===year)return publicMarket(state,ctx.driverWorld);
    if(state.pending)throw new Error('A different contract market is still pending');
    if(typeof random!=='function')throw new Error('Contract market requires a random function');
    migrateState(state,ctx.driverWorld,random,year,{preserveExpired:true,careerEndYear:ctx.careerEndYear,personalityValuesById:ctx.personalityValuesById});
    const world=ctx.driverWorld,placements=placementMap(world),playerTeam=ctx.playerTeam,retiring=new Set(ctx.retirementIds||[]),own=(world.lineups[playerTeam]||[]).filter(id=>!retiring.has(id)),external=Object.values(placements).filter(row=>row.role==='f1'&&row.team!==playerTeam&&!retiring.has(row.driverId));
    const scores={},jitters={};external.forEach(row=>{scores[row.driverId]=driverInterest(state,world,row.driverId,playerTeam,ctx);jitters[row.driverId]=random()*2});
    const targetIds=external.map(row=>row.driverId).sort((a,b)=>{
      const ca=state.contracts[a],cb=state.contracts[b],sa=contractStatus(ca,year),sb=contractStatus(cb,year),openA=sa==='expired'?16:sa==='expiring'?8:0,openB=sb==='expired'?16:sb==='expiring'?8:0;
      return (scores[b]*38+overall(world.drivers[b])*.52+openB+jitters[b])-(scores[a]*38+overall(world.drivers[a])*.52+openA+jitters[a]);
    }).slice(0,3);
    const rollIds=[...own,...targetIds],rolls={};rollIds.forEach(id=>{rolls[id]=random()});
    const ownScores={};own.forEach(id=>{ownScores[id]=driverInterest(state,world,id,playerTeam,ctx)});
    state.pending={year,playerTeam,targetIds,ownIds:own,interestScores:{...scores,...ownScores},rolls,offers:{},externalAttempts:0,maxExternalAttempts:2,aiOutgoingIds:aiOutgoingPlan(state,world,ctx,random),teamStrengths:clone(ctx.teamStrengths||{}),careerEndYear:Number(ctx.careerEndYear)||year+9};
    return publicMarket(state,world);
  }

  function offerAdjustment(type,driver,renewal,profile){
    if(type==='short')return (driver.age>=36?.07:-.08)+(renewal?.03:0);
    if(type==='long')return (driver.age<=27?.13:driver.age>=37?-.10:.04)+(profile.security-.5)*.09;
    return .055+(renewal?.035:0);
  }
  function availableOfferTypes(pending){const remaining=Math.max(1,Number(pending.careerEndYear)-Number(pending.year)+1);return Object.values(OFFER_TYPES).filter(item=>item.term<=remaining)}
  function makePlayerOffer(state,context,world){
    const pending=state.pending,ctx=context||{};if(!pending)throw new Error('No pending contract market');
    const id=ctx.driverId,requested=OFFER_TYPES[ctx.offerType]?ctx.offerType:'standard',existing=pending.offers[id];if(existing)return publicOffer(existing,world);
    const permitted=availableOfferTypes(pending);if(!permitted.some(item=>item.id===requested))throw new Error('这个合同年限已超出剩余生涯周期');const type=requested;
    const own=pending.ownIds.includes(id),external=pending.targetIds.includes(id);if(!own&&!external)throw new Error('Driver is not in this contract window');
    const current=state.contracts[id],status=contractStatus(current,pending.year);if(own&&status!=='expired')throw new Error('This driver does not need a renewal before the current season');
    if(external&&pending.externalAttempts>=pending.maxExternalAttempts)throw new Error('No external approaches remain this offseason');
    if(external)pending.externalAttempts+=1;
    const driver=world.drivers[id],profile=profileFor(state,id),score=pending.interestScores[id],threshold=clamp(score+offerAdjustment(type,driver,own,profile),.10,.86),success=pending.rolls[id]<threshold,term=OFFER_TYPES[type].term,renewal=own;
    const message=success?(renewal?`${driver.name} 接受了续约方案。`:`${driver.name} 愿意加盟，现可安排F1席位。`):(renewal?`${driver.name} 暂时拒绝续约，需要准备其他人选。`:`${driver.name} 拒绝了这次接触。`);
    pending.offers[id]={driverId:id,targetTeam:pending.playerTeam,sourceTeam:placementMap(world)[id]&&placementMap(world)[id].team||null,offerType:type,term,renewal,success,message};
    return publicOffer(pending.offers[id],world);
  }

  function allowedExternalIds(state){if(!state.pending)return [];return Object.values(state.pending.offers).filter(result=>result.success&&!result.renewal).map(result=>result.driverId)}
  function validateDraft(state,context){
    const errors=[],ctx=context||{},pending=state.pending,draft=ctx.draft,world=ctx.driverWorld;if(!pending||!draft)return {ok:false,errors:['当前没有可提交的合同市场']};const seats=Array.isArray(draft.seats)?draft.seats:[];
    if(draft.team!==pending.playerTeam)errors.push('合同草案不属于当前车队');
    if(Number(draft.year)!==Number(pending.year))errors.push('合同草案已过期');
    if(seats.length!==2||seats.some(id=>!id)||new Set(seats).size!==2)errors.push('两个F1席位必须由两名不同车手占据');
    const placements=placementMap(world),accepted=new Set(allowedExternalIds(state));
    seats.filter(Boolean).forEach(id=>{const placement=placements[id],contract=state.contracts[id],driver=world.drivers[id];if(!driver){errors.push('合同草案包含未知车手');return}if(placement&&placement.team===draft.team){if(placement.role==='academy')return;if(!contract)errors.push(`${driver.name} 缺少有效合同记录`);else if(contract.endYear<pending.year){const offer=pending.offers[id];if(!offer||!offer.success||!offer.renewal)errors.push(`${driver.name} 的合同已经到期，必须先完成续约或更换人选`)}return}if(placement&&placement.team!==draft.team&&!accepted.has(id))errors.push(`${driver.name} 尚未接受加盟`) });
    return {ok:errors.length===0,errors:[...new Set(errors)]};
  }

  function publicContract(state,world,id,year){
    const contract=state.contracts[id]||null,status=contractStatus(contract,Number(year)||state.currentYear),driver=world&&world.drivers&&world.drivers[id];
    return {driverId:id,driver:driver?driver.name:'Unknown',team:contract&&contract.team||null,role:contract&&contract.role||null,startYear:contract&&contract.startYear||null,endYear:contract&&contract.endYear||null,status,label:statusLabel(status,contract&&contract.endYear)};
  }
  function publicMarket(state,world){
    const pending=state.pending;if(!pending)return null;
    const mapRow=(id,own)=>{const contract=state.contracts[id]||null,status=contractStatus(contract,pending.year),score=pending.interestScores[id],offer=publicOffer(pending.offers[id],world),driver=world.drivers[id];return {driverId:id,driver:driver.name,team:contract&&contract.team||null,age:driver.age,status,contractLabel:statusLabel(status,contract&&contract.endYear),interest:interestLabel(score),difficulty:own?'续约':difficultyLabel(score,status),actionable:own?status==='expired':true,offer}};
    return {year:pending.year,attemptsRemaining:Math.max(0,pending.maxExternalAttempts-pending.externalAttempts),own:pending.ownIds.map(id=>mapRow(id,true)),targets:pending.targetIds.map(id=>mapRow(id,false)),acceptedIds:allowedExternalIds(state),offerTypes:availableOfferTypes(pending).map(item=>clone(item))};
  }
  function aiPlan(state){return {aiOutgoingIds:state.pending?[...state.pending.aiOutgoingIds]:[]}}

  function commitOffseasonWorking(state,context,random){
    const ctx=context||{},year=Number(ctx.year),key=String(year),world=ctx.driverWorld;if(state.processedYears[key])return clone(state.processedYears[key]);if(!state.pending||state.pending.year!==year)throw new Error('No matching contract market');
    const before=clone(state.contracts),placements=placementMap(world),historyBefore=state.history.length,careerEnd=Math.max(year,Number(ctx.careerEndYear)||Number(state.pending.careerEndYear)||year);
    const next={};
    Object.values(placements).forEach(placement=>{
      const id=placement.driverId,old=before[id],offer=state.pending.offers[id],same=old&&old.team===placement.team&&old.role===placement.role,accepted=offer&&offer.success&&offer.targetTeam===placement.team;
      if(placement.team===state.pending.playerTeam&&placement.role==='f1'&&same&&old.endYear<year&&(!accepted||!offer.renewal))throw new Error(`${world.drivers[id]&&world.drivers[id].name||id} has an expired contract without an accepted renewal`);
      if(placement.team===state.pending.playerTeam&&placement.role==='f1'&&old&&old.team!==state.pending.playerTeam&&(!accepted||offer.renewal))throw new Error(`${world.drivers[id]&&world.drivers[id].name||id} joined from another team without an accepted offer`);
      if(same&&old.endYear>=year&&!accepted){next[id]=old;return}
      const defaultTerm=placement.role==='academy'?1:1+(hash(`${id}:${placement.team}:${year}`)%3),term=accepted?offer.term:defaultTerm,endYear=Math.min(careerEnd,year+term-1);state.serial+=1;
      next[id]={contractId:contractId(id,placement.team,year,state.serial),driverId:id,team:placement.team,role:placement.role,startYear:year,endYear,source:accepted?(offer.renewal?'renewal':'player_offer'):same?'renewal':'market'};
      const promoted=old&&old.team===placement.team&&old.role==='academy'&&placement.role==='f1',type=accepted&&offer.renewal?'renewal':promoted?'promotion':old&&old.team!==placement.team?'transfer':same?'renewal':placement.role==='academy'?'academy_signing':'signing';state.history.push({id:`contract-event:${year}:${state.serial}`,year,driverId:id,role:placement.role,type,from:old&&old.team||null,to:placement.team,endYear});
    });
    Object.values(before).forEach(old=>{if(!placements[old.driverId])state.history.push({id:`contract-exit:${year}:${old.contractId}`,year,driverId:old.driverId,type:'exit',from:old.team,to:null,endYear:old.endYear})});
    state.contracts=next;state.currentYear=year;
    const playerTeam=state.pending.playerTeam,externalSigningIds=Object.values(placements).filter(row=>row.role==='f1'&&row.team===playerTeam&&before[row.driverId]&&before[row.driverId].team!==playerTeam).map(row=>row.driverId),renewalIds=state.history.slice(historyBefore).filter(item=>item.role==='f1'&&item.type==='renewal'&&item.to===playerTeam).map(item=>item.driverId),failedOfferIds=Object.values(state.pending.offers).filter(item=>!item.success).map(item=>item.driverId);
    const report={year,externalSigningIds:[...new Set(externalSigningIds)],renewalIds:[...new Set(renewalIds)],failedOfferIds:[...new Set(failedOfferIds)],offers:Object.values(state.pending.offers).map(item=>publicOffer(item,world))};
    state.processedYears[key]=clone(report);state.pending=null;
    const validation=validateState(state,world,year);if(!validation.ok)throw new Error('Contract commit failed: '+validation.errors.join('; '));
    return clone(report);
  }
  function commitOffseason(state,context,random){
    const year=Number(context&&context.year),processed=state.processedYears&&state.processedYears[String(year)];if(processed)return clone(processed);
    const working=clone(state),report=commitOffseasonWorking(working,context,random);Object.keys(state).forEach(key=>delete state[key]);Object.assign(state,working);return report;
  }

  function validateState(state,world,year){
    const errors=[];if(!state||!state.contracts||!state.secrets)errors.push('Contract state is incomplete');if(!world)return {ok:errors.length===0,errors,contracts:state&&state.contracts?Object.keys(state.contracts).length:0};
    const placements=placementMap(world),ids=Object.keys(placements),rawPlacements=[];for(const team of world.teams||[]){(world.lineups[team]||[]).forEach(id=>rawPlacements.push(id));const academy=world.academy&&world.academy[team];if(academy)rawPlacements.push(academy)}
    for(const team of world.teams||[]){if(!Array.isArray(world.lineups&&world.lineups[team])||world.lineups[team].length!==2)errors.push(`${team} must have exactly two contracted F1 seats`)}
    const targetYear=Number(year)||Number(state.currentYear),negotiating=state.pending&&Number(state.pending.year)===targetYear;
    ids.forEach(id=>{const contract=state.contracts[id],placement=placements[id];if(!contract)errors.push(`Missing contract for ${id}`);else{if(contract.driverId!==id||contract.team!==placement.team||contract.role!==placement.role)errors.push(`Contract placement mismatch for ${id}`);if(!Number.isFinite(contract.startYear)||!Number.isFinite(contract.endYear)||contract.endYear<contract.startYear)errors.push(`Invalid contract years for ${id}`);if(!negotiating&&(contract.startYear>targetYear||contract.endYear<targetYear))errors.push(`Contract is not active in ${targetYear}: ${id}`)}});
    Object.keys(state.contracts||{}).forEach(id=>{if(!placements[id])errors.push(`Inactive driver retains a contract: ${id}`)});
    if(new Set(rawPlacements).size!==rawPlacements.length)errors.push('A driver occupies multiple contracted roles');
    const f1Contracts=Object.values(state.contracts||{}).filter(item=>item.role==='f1').length,expectedF1=(world.teams||[]).length*2;if(f1Contracts!==expectedF1)errors.push(`Expected ${expectedF1} F1 contracts, found ${f1Contracts}`);
    const historyIds=(state.history||[]).map(item=>item.id).filter(Boolean);if(new Set(historyIds).size!==historyIds.length)errors.push('Contract history contains duplicate event ids');
    return {ok:errors.length===0,errors:[...new Set(errors)],contracts:Object.keys(state.contracts||{}).length,f1Contracts};
  }
  function publicSnapshot(state,world){return {schemaVersion:state.schemaVersion,currentYear:state.currentYear,contracts:Object.keys(state.contracts).map(id=>publicContract(state,world,id,state.currentYear)),processedYears:Object.keys(state.processedYears).map(Number).sort((a,b)=>a-b),pending:state.pending?publicMarket(state,world):null}}

  const api={SCHEMA_VERSION,OFFER_TYPES,newState,migrateState,prepareOffseason,publicContract,publicMarket,makePlayerOffer,allowedExternalIds,validateDraft,aiPlan,commitOffseason,validateState,publicSnapshot};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.F1ContractEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
