/* F1 Team Principal — ten-season legacy V0.1
 * Scores sporting results, expectation-beating, team building and management.
 * Hidden personality and potential values are intentionally not accepted.
 */
(function (root) {
  'use strict';

  const SCHEMA_VERSION = 1;
  const CAREER_LENGTH = 10;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function round1(value) { return Math.round(value * 10) / 10; }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function sum(rows, key) { return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0); }

  function newState(context) {
    const data = context || {};
    return {
      schemaVersion: SCHEMA_VERSION,
      startYear: Number(data.startYear) || 2026,
      team: data.team || null,
      initialCarRank: clamp(Number(data.initialCarRank) || 11, 1, 11),
      initialPerformance: Number(data.initialPerformance) || 50,
      seasons: [],
      seasonKeys: {},
      promotedDriverIds: [],
      externallySignedDriverIds: [],
      completed: false,
      final: null,
    };
  }

  function migrateState(raw, context) {
    if (!raw || !Array.isArray(raw.seasons)) return newState(context);
    const state = raw, fallback = newState(context);
    state.schemaVersion = SCHEMA_VERSION;
    state.startYear = Number(state.startYear) || fallback.startYear;
    state.team = state.team || fallback.team;
    state.initialCarRank = clamp(Number(state.initialCarRank) || fallback.initialCarRank, 1, 11);
    state.initialPerformance = Number(state.initialPerformance) || fallback.initialPerformance;
    const byYear = new Map(),endYear=state.startYear+CAREER_LENGTH-1;
    state.seasons.forEach(row => { const season=sanitizeSeason(row);if(Number.isFinite(season.year)&&season.year>=state.startYear&&season.year<=endYear&&!byYear.has(season.year))byYear.set(season.year,season); });
    state.seasons = [...byYear.values()].sort((a,b)=>a.year-b.year).slice(0,CAREER_LENGTH);
    state.seasonKeys = Object.fromEntries(state.seasons.map(season => [String(season.year), true]));
    state.promotedDriverIds = [...new Set(state.seasons.flatMap(season=>season.promotionIds||[]).map(String))];
    state.externallySignedDriverIds = [...new Set(state.seasons.flatMap(season=>season.externalSigningIds||[]).map(String))];
    state.completed = state.seasons.length >= CAREER_LENGTH;
    state.final = state.completed ? calculate(state) : null;
    return state;
  }

  function sanitizeSeason(data) {
    const decisionCount=clamp(Math.round(Number(data.decisionCount)||0),0,5),wins=clamp(Math.round(Number(data.wins)||0),0,24),constructorChampion=!!data.constructorChampion,driverChampion=!!data.driverChampion;
    return {
      year: Number(data.year),
      team: data.team,
      teamPosition: constructorChampion?1:clamp(Math.round(Number(data.teamPosition) || 11), 1, 11),
      points: clamp(Math.round(Number(data.points) || 0),0,1200),
      wins,
      podiums: clamp(Math.round(Number(data.podiums)||0),wins,48),
      bestDriverPosition: driverChampion?1:clamp(Math.round(Number(data.bestDriverPosition) || 22), 1, 22),
      constructorChampion,
      driverChampion,
      carRank: clamp(Number(data.carRank) || 11, 1, 11),
      carPerformance: Number(data.carPerformance) || 50,
      nextCarRank: clamp(Number(data.nextCarRank) || Number(data.carRank) || 11, 1, 11),
      nextCarPerformance: Number(data.nextCarPerformance) || Number(data.carPerformance) || 50,
      promotions: clamp(Math.round(Number(data.promotions)||0),0,1),
      promotionIds: [...new Set((Array.isArray(data.promotionIds)?data.promotionIds:[]).map(String))].slice(0,1),
      externalSignings: clamp(Math.round(Number(data.externalSignings)||0),0,2),
      externalSigningIds: [...new Set((Array.isArray(data.externalSigningIds)?data.externalSigningIds:[]).map(String))].slice(0,2),
      renewals: clamp(Math.round(Number(data.renewals)||0),0,2),
      failedOffers: clamp(Math.round(Number(data.failedOffers)||0),0,2),
      developedAttributes: clamp(Math.round(Number(data.developedAttributes)||0),0,12),
      decisionValue: clamp(Number(data.decisionValue)||0,-1,4),
      decisionCount,
      setbacks: clamp(Math.round(Number(data.setbacks)||0),0,decisionCount),
    };
  }

  function recordSeason(state, data) {
    const season = sanitizeSeason(data), key = String(season.year);
    if (!Number.isFinite(season.year)) throw new Error('Legacy season needs a valid year');
    if(season.year<state.startYear||season.year>=state.startYear+CAREER_LENGTH)throw new Error('Legacy season is outside the ten-year career window');
    if (state.seasonKeys[key]) return publicSnapshot(state);
    if (state.seasons.length >= CAREER_LENGTH) return publicSnapshot(state);
    if (state.team && season.team !== state.team) throw new Error('Legacy team cannot change inside a save');
    state.team = state.team || season.team;
    state.promotedDriverIds=state.promotedDriverIds||[];state.externallySignedDriverIds=state.externallySignedDriverIds||[];
    const unseen=(season.promotionIds||[]).filter(id=>!state.promotedDriverIds.includes(id));
    if(season.promotionIds.length)season.promotions=unseen.length;
    unseen.forEach(id=>state.promotedDriverIds.push(id));
    const unseenExternal=(season.externalSigningIds||[]).filter(id=>!state.externallySignedDriverIds.includes(id));
    if(season.externalSigningIds.length)season.externalSignings=unseenExternal.length;
    unseenExternal.forEach(id=>state.externallySignedDriverIds.push(id));
    state.seasons.push(season);
    state.seasons.sort((a, b) => a.year - b.year);
    state.seasonKeys[key] = true;
    state.completed = state.seasons.length >= CAREER_LENGTH;
    state.final = state.completed ? calculate(state) : null;
    return publicSnapshot(state);
  }

  function calculate(state) {
    const rows = state.seasons.slice(0, CAREER_LENGTH), count = Math.max(1, rows.length);
    const averagePosition = sum(rows, 'teamPosition') / count;
    const averageCarRank = sum(rows, 'carRank') / count;
    const constructorTitles = rows.filter(row => row.constructorChampion).length;
    const driverTitles = rows.filter(row => row.driverChampion).length;
    const wins = sum(rows, 'wins'), podiums = sum(rows, 'podiums');
    const legacyPromotions=rows.filter(row=>!(row.promotionIds||[]).length).reduce((total,row)=>total+row.promotions,0),promotions=Math.min(3,state.promotedDriverIds.length+legacyPromotions),developedAttributes = sum(rows, 'developedAttributes');
    const legacyExternal=rows.filter(row=>!(row.externalSigningIds||[]).length).reduce((total,row)=>total+row.externalSignings,0),externalSignings=state.externallySignedDriverIds.length+legacyExternal,renewals=sum(rows,'renewals'),failedOffers=sum(rows,'failedOffers');
    const finalSeason = rows[rows.length - 1];

    const finishScore = clamp((12 - averagePosition) / 11, 0, 1) * 18;
    const constructorScore = Math.sqrt(constructorTitles / CAREER_LENGTH) * 22;
    const driverScore = Math.sqrt(driverTitles / CAREER_LENGTH) * 14;
    const raceScore = clamp(wins / 55, 0, 1) * 4 + clamp(podiums / 130, 0, 1) * 2;
    const results = clamp(finishScore + constructorScore + driverScore + raceScore, 0, 60);

    const averageOverperformance = averageCarRank - averagePosition;
    const giantKillings = rows.filter(row => row.carRank >= 6 && row.teamPosition <= 3).length;
    const againstOdds = state.initialCarRank >= 7 && (constructorTitles || driverTitles) ? 3 : 0;
    const expectation = clamp(14 + averageOverperformance * 1.65 + giantKillings * .7 + againstOdds, 0, 22);

    const rankGain = Math.max(0, state.initialCarRank - finalSeason.nextCarRank);
    const performanceGain = Math.max(0, finalSeason.nextCarPerformance - state.initialPerformance);
    const building = clamp(rankGain / 10 * 8 + performanceGain / 14 * 6 + promotions * 1.35 + developedAttributes * .16, 0, 18);

    const completedScore = clamp(rows.length / CAREER_LENGTH, 0, 1) * 3;
    const decisionAverage = sum(rows, 'decisionValue') / count;
    const decisionScore = clamp(2.2 + decisionAverage * 1.45, 0, 4);
    const resilience = rows.filter(row => row.teamPosition <= row.carRank + 1).length / count;
    const management = clamp(completedScore + decisionScore + resilience, 0, 8);

    const score = Math.round(clamp(results + expectation + building + management, 0, 100));
    const grade = gradeFor(score), stories = narrative(state, {
      score, averagePosition, averageCarRank, averageOverperformance, constructorTitles, driverTitles,
      wins, podiums, promotions, developedAttributes, externalSignings, renewals, failedOffers, rankGain, performanceGain, setbacks: sum(rows, 'setbacks'),
    });
    return {
      score,
      grade: grade.grade,
      title: grade.title,
      summary: grade.summary,
      components: {
        sportingResults: round1(results),
        expectation: round1(expectation),
        teamBuilding: round1(building),
        management: round1(management),
      },
      totals: {
        seasons: rows.length,
        constructorTitles,
        driverTitles,
        wins,
        podiums,
        promotions,
        externalSignings,
        renewals,
        averagePosition: round1(averagePosition),
        averageCarRank: round1(averageCarRank),
      },
      stories,
    };
  }

  function gradeFor(score) {
    if (score >= 94) return { grade: 'S+', title: '时代缔造者', summary: '你建立的不只是冠军车队，而是定义了这个十年的竞争秩序。' };
    if (score >= 85) return { grade: 'S', title: '冠军架构师', summary: '成绩、人才与技术方向共同构成了一段冠军周期。' };
    if (score >= 74) return { grade: 'A', title: '顶级领队', summary: '你持续把赛车与人员组合转化成了超出预期的成绩。' };
    if (score >= 62) return { grade: 'B', title: '强势建设者', summary: '车队在你的任期中建立了清晰方向，并完成了重要跃升。' };
    if (score >= 45) return { grade: 'C', title: '稳健掌舵者', summary: '十年计划留下了稳定基础，但仍有部分目标未被兑现。' };
    return { grade: 'D', title: '未竟重建', summary: '车队经历了完整十年，却仍未把投入稳定转化为长期竞争力。' };
  }

  function narrative(state, totals) {
    const stories = [];
    if (totals.constructorTitles) stories.push(`带领 ${state.team} 赢得 ${totals.constructorTitles} 次世界车队冠军。`);
    else if (totals.averageOverperformance >= 1) stories.push(`平均完赛排名比赛车实力排名高 ${round1(totals.averageOverperformance)} 位。`);
    else stories.push(`十年车队平均排名为 P${round1(totals.averagePosition)}。`);
    if (totals.driverTitles) stories.push(`旗下车手共获得 ${totals.driverTitles} 次世界冠军。`);
    else if (totals.wins) stories.push(`在任期内取得 ${totals.wins} 场胜利和 ${totals.podiums} 次领奖台。`);
    else stories.push('任期内尚未取得分站胜利，重建成果主要体现在基础能力。');
    if (totals.rankGain >= 3) stories.push(`赛车从开局位置提升 ${totals.rankGain} 个竞争层级，完成长期技术逆袭。`);
    else if (totals.performanceGain >= 4) stories.push(`赛车基础性能较开局提高 ${round1(totals.performanceGain)} 点。`);
    else stories.push('赛车长期竞争力大致维持在开局层级。');
    if (totals.promotions) stories.push(`亲自把 ${totals.promotions} 名学院车手提拔到 F1 正赛席位。`);
    else stories.push('任期内没有完成学院车手到 F1 席位的内部提拔。');
    if (totals.developedAttributes >= 8) stories.push(`车手年度报告累计记录 ${totals.developedAttributes} 项公开能力进步。`);
    if (totals.externalSignings || totals.renewals) stories.push(`合同市场中完成 ${totals.externalSignings} 名外队车手引进与 ${totals.renewals} 次续约。`);
    if (totals.setbacks >= 8) stories.push(`经历 ${totals.setbacks} 次计划受挫后，车队仍完成了整个十年周期。`);
    return stories.slice(0, 6);
  }

  function publicSnapshot(state) {
    return {
      schemaVersion: state.schemaVersion,
      startYear: state.startYear,
      team: state.team,
      initialCarRank: state.initialCarRank,
      seasons: state.seasons.map(season => { const visible=clone(season);delete visible.promotionIds;delete visible.externalSigningIds;return visible; }),
      completed: state.completed,
      seasonsRemaining: Math.max(0, CAREER_LENGTH - state.seasons.length),
      final: state.final ? clone(state.final) : null,
    };
  }

  function validateState(state) {
    const errors = [];
    if (!state || !Array.isArray(state.seasons)) errors.push('Legacy seasons missing');
    else {
      if (state.seasons.length > CAREER_LENGTH) errors.push('Legacy exceeds ten seasons');
      if (new Set(state.seasons.map(row => row.year)).size !== state.seasons.length) errors.push('Legacy contains duplicate years');
      state.seasons.forEach(row => { if (row.teamPosition < 1 || row.teamPosition > 11) errors.push('Invalid team position'); });
    }
    if (state && new Set(state.promotedDriverIds||[]).size !== (state.promotedDriverIds||[]).length) errors.push('Legacy contains duplicate promotion ids');
    if (state && new Set(state.externallySignedDriverIds||[]).size !== (state.externallySignedDriverIds||[]).length) errors.push('Legacy contains duplicate external signing ids');
    if (state && state.completed && (!state.final || !Number.isFinite(state.final.score))) errors.push('Completed legacy has no score');
    return { ok: errors.length === 0, errors, seasons: state && state.seasons ? state.seasons.length : 0 };
  }

  const api = { SCHEMA_VERSION, CAREER_LENGTH, newState, migrateState, recordSeason, publicSnapshot, validateState };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1LegacyEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
