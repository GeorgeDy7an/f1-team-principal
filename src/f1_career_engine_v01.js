/* F1 Team Principal — career and development engine V0.1
 * Tracks save history and public rating development. Hidden personality values are never read here.
 */
(function (root) {
  'use strict';

  const ATTRS = ['pace', 'racecraft', 'consistency', 'tyre'];
  const AGE_2026 = {
    'Max Verstappen':28,'Kimi Antonelli':19,'Charles Leclerc':28,'George Russell':28,
    'Lewis Hamilton':41,'Lando Norris':26,'Oscar Piastri':25,'Fernando Alonso':44,
    'Pierre Gasly':30,'Isack Hadjar':21,'Liam Lawson':24,'Carlos Sainz':31,
    'Alexander Albon':30,'Oliver Bearman':21,'Arvid Lindblad':18,'Esteban Ocon':29,
    'Gabriel Bortoleto':21,'Nico Hulkenberg':38,'Franco Colapinto':23,
    'Valtteri Bottas':36,'Sergio Perez':36,'Lance Stroll':27,
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function newCareerState(drivers, random, startYear) {
    const state = { version:2, startYear:startYear || 2026, records:{}, recordedRaces:{}, finalizedYears:{} };
    drivers.forEach(driver => registerDriver(state, driver, random, startYear));
    return state;
  }

  function createDevelopmentProfile(ratings, age, random, supplied) {
    const spec = supplied || {};
    const headroom = age <= 20 ? [5,12] : age <= 23 ? [3,9] : age <= 27 ? [1,6] : age <= 31 ? [0,3] : [0,1];
    const ceilings = {};
    ATTRS.forEach(key => {
      const extra = headroom[0] + Math.floor(random() * (headroom[1] - headroom[0] + 1));
      const requested = spec.ceilings && Number(spec.ceilings[key]);
      ceilings[key] = Number.isFinite(requested)
        ? clamp(Math.round(requested), ratings[key], 99)
        : clamp(ratings[key] + extra, ratings[key], 99);
    });
    const ranked = [...ATTRS].sort((a,b) => ratings[b] - ratings[a]);
    const inferred = ranked[0] === 'pace' ? 'raw_speed' : ranked[0] === 'racecraft' ? 'racecraft' : ranked[0] === 'consistency' ? 'complete' : 'tyre_specialist';
    const archetype = spec.archetype || inferred;
    const tendency = { pace:1, racecraft:1, consistency:1, tyre:1 };
    if (archetype === 'raw_speed') tendency.pace = 1.35;
    if (archetype === 'racecraft') tendency.racecraft = 1.35;
    if (archetype === 'complete') tendency.consistency = 1.35;
    if (archetype === 'tyre_specialist') tendency.tyre = 1.35;
    ATTRS.forEach(key => {
      if (spec.tendency && Number.isFinite(Number(spec.tendency[key]))) tendency[key] = clamp(Number(spec.tendency[key]), .45, 2.2);
    });
    return {
      ceilings,
      archetype,
      tendency,
      growthShape:spec.growthShape || 'steady',
      miracle:!!spec.miracle,
      miracleAwakened:!!spec.miracleAwakened,
      miracleBurstYears:Math.max(0,Math.round(spec.miracleBurstYears || 0)),
    };
  }

  function registerDriver(state, driver, random, startYear, options) {
    if (!state || !driver || !driver.name) throw new Error('A named driver is required');
    if (!state.records) state.records = {};
    if (state.records[driver.name]) return false;
    const opts = options || {};
    const knownAge = AGE_2026[driver.name];
    const year = startYear || state.startYear || 2026;
    const age = driver.age == null ? (knownAge == null ? 20 : knownAge + (year - 2026)) : Math.round(driver.age);
    const sourceRatings = driver.ratings || driver;
    const ratings = Object.fromEntries(ATTRS.map(key => [key, clamp(Math.round(Number(sourceRatings[key]) || 50),45,99)]));
    const initialBullets = driver.initialBullets || driver.bullets || opts.initialBullets || [];
    state.records[driver.name] = {
      id:driver.id || opts.id || null,
      name:driver.name,
      age:clamp(age,16,60),
      ratings,
      starts:0, points:0, wins:0, podiums:0, dnfs:0, championships:0,
      seasons:[], bullets:[...new Set(initialBullets.map(String))].slice(-16), milestones:{},
      developmentRole:driver.role || opts.role || 'f1',
      currentTeam:driver.team || opts.team || null,
      development:createDevelopmentProfile(ratings, age, random, driver.developmentSpec || opts.developmentSpec),
    };
    return true;
  }

  function ratingsFor(state, name) {
    const record = state && state.records && state.records[name];
    return record ? { ...record.ratings } : null;
  }

  function recordRace(state, raceLog) {
    if (!state.recordedRaces) state.recordedRaces = {};
    const raceKey = raceLog.id || `${raceLog.year}:${raceLog.race}`;
    if (state.recordedRaces[raceKey]) return false;
    raceLog.result.forEach(row => {
      const record = state.records[row.name];
      if (!record) return;
      record.starts += 1;
      record.points += row.points || 0;
      if (!row.dnf && row.pos === 1) record.wins += 1;
      if (!row.dnf && row.pos && row.pos <= 3) record.podiums += 1;
      if (row.dnf) record.dnfs += 1;
      if ((row.points || 0) > 0 && !record.milestones.firstSavePoints) {
        record.milestones.firstSavePoints = true;
        addBullet(record, `${raceLog.year} ${raceLog.race} — 存档内首次积分`);
      }
      if (row.pos && row.pos <= 3 && !record.milestones.firstSavePodium) {
        record.milestones.firstSavePodium = true;
        addBullet(record, `${raceLog.year} ${raceLog.race} — 存档内首次领奖台`);
      }
      if (row.pos === 1 && !record.milestones.firstSaveWin) {
        record.milestones.firstSaveWin = true;
        addBullet(record, `${raceLog.year} ${raceLog.race} — 存档内首胜`);
      }
    });
    state.recordedRaces[raceKey] = true;
    return true;
  }

  function finishSeason(state, season, developmentLevels, storyBonuses, random) {
    if (!state.finalizedYears) state.finalizedYears = {};
    if (state.finalizedYears[String(season.year)]) return [];
    const reports = [];
    Object.values(state.records).forEach(record => {
      let row = season.drivers.find(item => item.name === record.name);
      if (!row && !['f1','retired'].includes(record.developmentRole)) {
        row = { name:record.name, team:record.currentTeam, role:record.developmentRole, position:null, points:0, wins:0, podiums:0, eligibleForTeamTitle:false };
      }
      if (!row || row.role === 'retired' || record.developmentRole === 'retired') return;
      const team = row.team || record.currentTeam || null;
      const role = row.role || record.developmentRole || 'f1';
      const eligibleForTeamTitle = row.eligibleForTeamTitle == null ? role === 'f1' : !!row.eligibleForTeamTitle;
      record.developmentRole = role;
      record.currentTeam = team;
      const isChampion = season.driverChampion === record.name;
      if (isChampion) {
        record.championships += 1;
        addBullet(record, `${season.year} 世界车手冠军`);
      }
      if (eligibleForTeamTitle && season.teamChampion === team) addBullet(record, `${season.year} 世界车队冠军成员`);
      if (role === 'f1' && row.wins > 0) addBullet(record, `${season.year} — ${row.wins} 场胜利，${row.podiums} 次领奖台`);
      const level = (developmentLevels && developmentLevels[record.name]) || 'medium';
      const storyBonus = (storyBonuses && storyBonuses[record.name]) || 0;
      const changes = develop(record, level, storyBonus, random);
      record.seasons.push({ year:season.year, team, role, position:row.position == null ? null : row.position, points:row.points || 0, wins:row.wins || 0, podiums:row.podiums || 0, champion:isChampion, changes });
      reports.push({ name:record.name, team, role, age:record.age, level, changes, ratings:{...record.ratings} });
      record.age += 1;
    });
    state.finalizedYears[String(season.year)] = true;
    return reports;
  }

  function develop(record, level, storyBonus, random) {
    const age = record.age;
    const investment = { high:.75, medium:0, low:-.42 }[level] || 0;
    let baseTotal = age <= 20 ? 3.3 : age <= 23 ? 2.45 : age <= 27 ? 1.35 : age <= 31 ? .58 : age <= 35 ? .18 : 0;
    const shape = record.development.growthShape;
    if (shape === 'precocious') baseTotal += age <= 21 ? .45 : age >= 26 ? -.22 : 0;
    if (shape === 'late') baseTotal += age <= 21 ? -.35 : age <= 29 ? .38 : 0;
    if (shape === 'volatile') baseTotal += random() < .28 ? 1.05 : -.22;
    if (record.development.miracle && !record.development.miracleAwakened && age >= 22 && age <= 29 && level === 'high' && random() < .14) {
      record.development.miracleAwakened = true;
      record.development.miracleBurstYears = 4;
      addBullet(record, `${record.seasons.length + 1} 个赛季后 — 训练表现出现罕见突破`);
    }
    if (record.development.miracleAwakened) baseTotal += age <= 30 ? 1.7 : .35;
    const growthTotal = Math.max(0, baseTotal + investment + clamp(storyBonus,-.7,.7));
    const decline = age >= 40 ? {pace:.90,racecraft:.25,consistency:.45,tyre:.30}
      : age >= 36 ? {pace:.68,racecraft:.14,consistency:.28,tyre:.20}
      : age >= 32 ? {pace:.25,racecraft:.04,consistency:.07,tyre:.06}
      : {pace:0,racecraft:0,consistency:0,tyre:0};
    const declineFactor = level === 'high' ? .82 : level === 'low' ? 1.12 : 1;
    const changes = [];
    const miracleBurst = record.development.miracleAwakened && record.development.miracleBurstYears > 0 && level === 'high';
    ATTRS.forEach(key => {
      const oldValue = record.ratings[key];
      let delta = 0;
      const tendency = record.development.tendency[key];
      const growChance = clamp((growthTotal / 4) * tendency, 0, .92);
      if (miracleBurst && oldValue < record.development.ceilings[key]) {
        delta = Math.min(record.development.ceilings[key] - oldValue, 4 + Math.floor(random() * 3));
      } else if (oldValue < record.development.ceilings[key] && random() < growChance) {
        delta = 1;
        if (age <= 20 && level === 'high' && oldValue + 1 < record.development.ceilings[key] && random() < .16) delta = 2;
      } else if (random() < clamp(decline[key] * declineFactor, 0, .98)) {
        delta = -1;
      }
      const newValue = clamp(oldValue + delta, 45, 99);
      if (newValue !== oldValue) {
        record.ratings[key] = newValue;
        changes.push({ attribute:key, from:oldValue, to:newValue, delta:newValue-oldValue });
      }
    });
    if (miracleBurst) record.development.miracleBurstYears -= 1;
    return changes;
  }

  function addBullet(record, text) {
    if (!record.bullets.includes(text)) record.bullets.push(text);
    if (record.bullets.length > 16) record.bullets.shift();
  }

  function addCareerBullet(state, name, text) {
    const record = state && state.records && state.records[name];
    if (!record || !text) return false;
    addBullet(record, String(text));
    return true;
  }

  function setDriverRole(state, name, role, team) {
    const record = state && state.records && state.records[name];
    if (!record) return false;
    record.developmentRole = role || record.developmentRole;
    if (team !== undefined) record.currentTeam = team;
    return true;
  }

  function publicCareer(state, name) {
    const record = state.records[name];
    if (!record) return null;
    return {
      name:record.name, age:record.age, ratings:{...record.ratings}, starts:record.starts,
      points:record.points, wins:record.wins, podiums:record.podiums, dnfs:record.dnfs,
      championships:record.championships,
      bullets:[...record.bullets],
      seasons:record.seasons.map(season => ({
        ...season,
        changes:(season.changes || []).map(change => ({...change})),
      })),
    };
  }

  function developmentLevelsFromPlans(driverNames, preseason, midseason) {
    const score = Object.fromEntries(driverNames.map(name => [name,0]));
    const count = Object.fromEntries(driverNames.map(name => [name,0]));
    [preseason, midseason].filter(Boolean).forEach(plan => {
      (plan.driverPriority || []).forEach(item => {
        if (!(item.name in score)) return;
        score[item.name] += {high:3,medium:2,low:1}[item.level] || 2;
        count[item.name] += 1;
      });
    });
    return Object.fromEntries(driverNames.map(name => {
      const average = count[name] ? score[name]/count[name] : 2;
      return [name, average >= 2.5 ? 'high' : average <= 1.5 ? 'low' : 'medium'];
    }));
  }

  // Only already-visible story outcomes may influence development. No hidden
  // personality value or label is accepted by this function.
  function storyBonusesFromLog(driverNames, storyLog, year) {
    const bonuses = Object.fromEntries(driverNames.map(name => [name, 0]));
    const eventEffect = {
      development_support:.30,
      first_win:.22,
      championship:.30,
      mentoring:.08,
    };
    const reactionEffect = {
      motivated:.28,
      enthusiastic_mentor:.16,
      grounded:.10,
      emboldened:.08,
      supportive:.08,
      calm:.06,
      shaken:-.30,
      public_discontent:-.24,
      private_concern:-.12,
      reluctant_mentor:-.10,
      defensive:-.08,
    };
    (storyLog || []).forEach(story => {
      if (story.year !== year || !(story.driver in bonuses)) return;
      bonuses[story.driver] += (eventEffect[story.eventId] || 0) + (reactionEffect[story.reaction] || 0);
    });
    Object.keys(bonuses).forEach(name => { bonuses[name] = clamp(bonuses[name], -.7, .7); });
    return bonuses;
  }

  const api = {
    ATTRS, AGE_2026, newCareerState, registerDriver, ratingsFor, recordRace, finishSeason,
    addCareerBullet, setDriverRole, publicCareer, developmentLevelsFromPlans, storyBonusesFromLog,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1CareerEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
