/* F1 Team Principal — persistent car world V0.1
 * Owns multi-season car strength, AI development and regulation resets.
 * Hidden team profiles never enter public snapshots.
 */
(function (root) {
  'use strict';

  const SCHEMA_VERSION = 1;
  const ATTRS = ['performance', 'reliability', 'tyre'];
  const REGULATIONS = {
    aero: {
      title: '空气动力规则修订',
      description: '底板与车身规则将重置部分既有空气动力优势。',
      affected: ['performance'],
      retention: { performance: .70, reliability: .94, tyre: .90 },
    },
    power: {
      title: '动力单元规则更新',
      description: '动力与能量回收架构变化，速度和可靠性都会重新接受检验。',
      affected: ['performance', 'reliability'],
      retention: { performance: .78, reliability: .70, tyre: .94 },
    },
    tyre: {
      title: '轮胎规格全面更新',
      description: '新的轮胎结构将改变长距离效率与工作窗口。',
      affected: ['tyre', 'performance'],
      retention: { performance: .86, reliability: .96, tyre: .64 },
    },
    major: {
      title: '新一代技术规则',
      description: '底盘、动力与轮胎目标同步调整，旧有竞争秩序可能明显松动。',
      affected: ['performance', 'reliability', 'tyre'],
      retention: { performance: .58, reliability: .76, tyre: .68 },
    },
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function round1(value) { return Math.round(value * 10) / 10; }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function normal(random, mean, deviation) {
    const u = Math.max(random(), 1e-9), v = random();
    return mean + deviation * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function carScore(car) { return car.performance + .06 * (car.tyre - 80); }
  function normalizeCar(car) {
    return {
      performance: round1(clamp(Number(car.performance), 45, 99)),
      reliability: round1(clamp(Number(car.reliability), 68, 99)),
      tyre: round1(clamp(Number(car.tyre), 62, 99)),
    };
  }
  function sourceCar(car) {
    return normalizeCar({
      performance: car.performance == null ? car.p : car.performance,
      reliability: car.reliability == null ? car.r : car.reliability,
      tyre: car.tyre == null ? car.t : car.tyre,
    });
  }

  function createRegulationSchedule(startYear, random) {
    const schedule = [], kinds = ['aero', 'power', 'tyre', 'major'];
    let year = startYear + 2 + Math.floor(random() * 2);
    let index = 0;
    while (year <= startYear + 9) {
      let kind = kinds[Math.floor(random() * kinds.length)];
      if (index === 1 && kind === schedule[index - 1].kind) kind = kinds[(kinds.indexOf(kind) + 1) % kinds.length];
      if (index === 2) kind = 'major';
      const template = REGULATIONS[kind];
      schedule.push({ year, kind, title: template.title, description: template.description, affected: [...template.affected] });
      year += 3 + Math.floor(random() * 2);
      index += 1;
    }
    return schedule;
  }

  function createProfile(index, count, random) {
    const strength = 1 - index / Math.max(1, count - 1);
    return {
      technical: clamp(.46 + strength * .16 + normal(random, 0, .12), .22, .88),
      adaptation: clamp(.44 + random() * .36, .35, .88),
      volatility: clamp(.80 + random() * .45, .75, 1.30),
      cycle: 0,
    };
  }

  function newState(cars, random, startYear) {
    if (!Array.isArray(cars) || cars.length !== 11 || new Set(cars.map(entry => entry.team)).size !== 11) throw new Error('Car world requires 11 unique teams');
    if (typeof random !== 'function') throw new Error('Car world requires a random function');
    const year = Number(startYear) || 2026;
    const teams = {}, profiles = {};
    cars.forEach((entry, index) => {
      const car = sourceCar(entry);
      teams[entry.team] = car;
      profiles[entry.team] = createProfile(index, cars.length, random);
    });
    return {
      schemaVersion: SCHEMA_VERSION,
      startYear: year,
      currentYear: year,
      teams,
      initial: clone(teams),
      regulations: createRegulationSchedule(year, random),
      history: [],
      settledYears: {},
      appliedYears: { [String(year)]: true },
      pending: null,
      lastReport: null,
      secrets: { profiles },
    };
  }

  function migrateState(raw, cars, currentYear, random) {
    if (!raw || !raw.teams) return newState(cars, random, currentYear);
    const state = raw;
    state.schemaVersion = SCHEMA_VERSION;
    state.startYear = Number(state.startYear) || Number(currentYear) || 2026;
    state.currentYear = Number(state.currentYear) || Number(currentYear) || state.startYear;
    state.initial = state.initial || Object.fromEntries(cars.map(entry => [entry.team, sourceCar(entry)]));
    state.regulations = Array.isArray(state.regulations) ? state.regulations : createRegulationSchedule(state.startYear, random);
    state.history = Array.isArray(state.history) ? state.history : [];
    state.settledYears = state.settledYears || {};
    state.appliedYears = state.appliedYears || { [String(state.currentYear)]: true };
    state.lastReport = state.lastReport || null;
    state.pending = state.pending || null;
    state.secrets = state.secrets || {};
    state.secrets.profiles = state.secrets.profiles || {};
    const validTeams = new Set(cars.map(entry => entry.team));
    Object.keys(state.teams).forEach(team => { if (!validTeams.has(team)) delete state.teams[team]; });
    Object.keys(state.initial).forEach(team => { if (!validTeams.has(team)) delete state.initial[team]; });
    Object.keys(state.secrets.profiles).forEach(team => { if (!validTeams.has(team)) delete state.secrets.profiles[team]; });
    cars.forEach((entry, index) => {
      const migrated = sourceCar(state.teams[entry.team] || entry);
      state.teams[entry.team] = ATTRS.every(attribute => Number.isFinite(migrated[attribute])) ? migrated : sourceCar(entry);
      const initial = sourceCar(state.initial[entry.team] || entry);
      state.initial[entry.team] = ATTRS.every(attribute => Number.isFinite(initial[attribute])) ? initial : sourceCar(entry);
      if (!state.secrets.profiles[entry.team]) state.secrets.profiles[entry.team] = createProfile(index, cars.length, random);
      const profile = state.secrets.profiles[entry.team];
      if (![profile.technical,profile.adaptation,profile.volatility].every(Number.isFinite)) {
        const fallback = createProfile(index, cars.length, random);
        if (!Number.isFinite(profile.technical)) profile.technical = fallback.technical;
        if (!Number.isFinite(profile.adaptation)) profile.adaptation = fallback.adaptation;
        if (!Number.isFinite(profile.volatility)) profile.volatility = fallback.volatility;
      }
      if (!Number.isFinite(profile.cycle)) profile.cycle = 0;
    });
    return state;
  }

  function rankedCars(cars) {
    return Object.entries(cars).map(([team, car]) => ({ team, ...car, score: carScore(car) }))
      .sort((a, b) => b.score - a.score || a.team.localeCompare(b.team));
  }
  function rankMap(cars) {
    return Object.fromEntries(rankedCars(cars).map((entry, index) => [entry.team, index + 1]));
  }

  function regulationForYear(state, year) {
    const item = (state.regulations || []).find(entry => entry.year === Number(year));
    return item ? clone(item) : null;
  }
  function nextRegulation(state, year) {
    const item = (state.regulations || []).filter(entry => entry.year > Number(year)).sort((a, b) => a.year - b.year)[0];
    return item ? clone(item) : null;
  }
  function regulationStatus(state, year) {
    const next = nextRegulation(state, year);
    return { current: regulationForYear(state, year), next: next && next.year <= Number(year) + 1 ? next : null };
  }

  function focusPreparation(plan, regulation) {
    if (!plan || !regulation) return { performance: 0, reliability: 0, tyre: 0 };
    const focus = plan.focus || 'balanced', affected = new Set(regulation.affected || []);
    const prepared = { performance: 0, reliability: 0, tyre: 0 };
    if (focus === 'performance' && affected.has('performance')) prepared.performance += .34;
    if (focus === 'reliability' && affected.has('reliability')) prepared.reliability += .55;
    if (focus === 'balanced') regulation.affected.forEach(attribute => { prepared[attribute] += attribute === 'reliability' ? .28 : .22; });
    return prepared;
  }

  function applyRegulation(cars, state, regulation, plans, random) {
    if (!regulation) return cars;
    const template = REGULATIONS[regulation.kind], entries = Object.values(cars);
    const means = Object.fromEntries(ATTRS.map(attribute => [attribute, entries.reduce((sum, car) => sum + car[attribute], 0) / entries.length]));
    const output = {};
    Object.entries(cars).forEach(([team, car]) => {
      const profile = state.secrets.profiles[team], early = focusPreparation(team === plans.playerTeam ? plans.preseasonPlan : null, regulation), adjustment = focusPreparation(team === plans.playerTeam ? plans.midseasonPlan : null, regulation);
      const preparation = Object.fromEntries(ATTRS.map(attribute => [attribute, early[attribute] + adjustment[attribute] * .65]));
      const next = {};
      ATTRS.forEach(attribute => {
        const retention = template.retention[attribute];
        const affected = regulation.affected.includes(attribute);
        const adaptationSpread = affected ? (1.45 + (1 - profile.adaptation) * 1.05) : .34;
        const adaptationEdge = affected ? (profile.adaptation - .60) * 1.45 : 0;
        next[attribute] = means[attribute] + (car[attribute] - means[attribute]) * retention
          + normal(random, adaptationEdge, adaptationSpread) + (preparation[attribute] || 0);
      });
      output[team] = normalizeCar(next);
    });
    return output;
  }

  function annualDevelopment(state, context, random) {
    const current = clone(state.teams), beforeRanks = rankMap(current), count = Object.keys(current).length;
    const playerTeam = context.playerTeam, decision = context.decisionSummary || {};
    const preseasonPlan = context.preseasonPlan || null, midseasonPlan = context.midseasonPlan || null;
    const next = {}, cycles = {};
    Object.entries(current).forEach(([team, car]) => {
      const rank = beforeRanks[team], catchup = (rank - 1) / Math.max(1, count - 1), profile = state.secrets.profiles[team];
      const cycle = clamp(profile.cycle * .68 + normal(random, 0, .34), -1.15, 1.15);cycles[team] = cycle;
      const technical = profile.technical - .54;
      const volatility = profile.volatility;
      let performanceDelta = .02 + .74 * catchup + technical * .58 + cycle * .72 + normal(random, 0, .58 * volatility);
      let reliabilityDelta = (86 - car.reliability) * .055 + technical * .20 + normal(random, 0, .42 * volatility);
      let tyreDelta = (83 - car.tyre) * .035 + technical * .20 + normal(random, 0, .46 * volatility);
      if (team === playerTeam) {
        performanceDelta += clamp(Number(decision.performance) || 0, -.15, 1.5) * 1.15;
        reliabilityDelta += clamp(Number(decision.reliability) || 0, -.5, 2.5) * .24;
        const focuses = [preseasonPlan && preseasonPlan.focus, midseasonPlan && midseasonPlan.focus];
        tyreDelta += focuses.filter(focus => focus === 'balanced').length * .10;
        tyreDelta += focuses.filter(focus => focus === 'performance').length * .05;
      }
      if (performanceDelta > 0) performanceDelta *= clamp((101 - car.performance) / 38, .32, 1.22);
      performanceDelta -= .07 + Math.max(0, car.performance - 86) * .012;
      next[team] = normalizeCar({
        performance: car.performance + performanceDelta,
        reliability: car.reliability + reliabilityDelta,
        tyre: car.tyre + tyreDelta,
      });
    });
    return { cars: next, cycles };
  }

  function settleSeason(state, context, random) {
    const year = Number(context.year), key = String(year);
    if (state.settledYears[key]) return clone(state.settledYears[key]);
    if (year !== state.currentYear) throw new Error('Car world year mismatch');
    if (!context.playerTeam || !state.teams[context.playerTeam]) throw new Error('Unknown player team');
    if (typeof random !== 'function') throw new Error('Car world requires a random function');
    Object.keys(state.teams).forEach(team => {
      const profile = state.secrets && state.secrets.profiles && state.secrets.profiles[team];
      if (!profile || ![profile.technical,profile.adaptation,profile.volatility,profile.cycle].every(Number.isFinite)) throw new Error('Invalid hidden team profile: ' + team);
    });
    const before = clone(state.teams), beforeRanks = rankMap(before);
    const regulation = regulationForYear(state, year + 1);
    if (regulation && !REGULATIONS[regulation.kind]) throw new Error('Unknown regulation kind');
    const developed = annualDevelopment(state, context, random);let next = developed.cars;
    next = applyRegulation(next, state, regulation, context, random);
    const afterRanks = rankMap(next), playerTeam = context.playerTeam;
    const playerBefore = before[playerTeam], playerAfter = next[playerTeam];
    const delta = Object.fromEntries(ATTRS.map(attribute => [attribute, round1(playerAfter[attribute] - playerBefore[attribute])]));
    const report = {
      year,
      nextYear: year + 1,
      playerTeam,
      playerBefore: clone(playerBefore),
      playerAfter: clone(playerAfter),
      delta,
      rankBefore: beforeRanks[playerTeam],
      rankAfter: afterRanks[playerTeam],
      regulation,
      direction: delta.performance > .45 ? '研发取得明显进展' : delta.performance >= -.15 ? '赛车竞争力总体稳定' : '研发结果低于预期',
    };
    Object.entries(developed.cycles).forEach(([team, cycle]) => { state.secrets.profiles[team].cycle = cycle; });
    state.pending = { year: year + 1, teams: next, report: clone(report) };
    state.history.push({ year, cars: before, standings: clone(context.standings || []), nextYear: year + 1, regulation: clone(regulation) });
    state.settledYears[key] = clone(report);
    state.lastReport = clone(report);
    return clone(report);
  }

  function beginYear(state, year) {
    const target = Number(year), key = String(target);
    if (state.currentYear === target && state.appliedYears[key]) return state.lastReport ? clone(state.lastReport) : null;
    if (!state.pending || state.pending.year !== target) throw new Error('No prepared car state for ' + target);
    state.teams = clone(state.pending.teams);
    state.currentYear = target;
    state.appliedYears[key] = true;
    state.lastReport = clone(state.pending.report);
    state.pending = null;
    return clone(state.lastReport);
  }

  function publicTeam(state, team) {
    const car = state.teams[team];
    if (!car) return null;
    const ranks = rankMap(state.teams), initial = state.initial[team] || car;
    return {
      team,
      performance: car.performance,
      reliability: car.reliability,
      tyre: car.tyre,
      p: car.performance,
      r: car.reliability,
      t: car.tyre,
      rank: ranks[team],
      changeFromStart: round1(carScore(car) - carScore(initial)),
    };
  }
  function publicGrid(state) { return rankedCars(state.teams).map(entry => publicTeam(state, entry.team)); }
  function publicHistoricalGrid(cars) {
    return rankedCars(cars).map((entry, index) => ({ team: entry.team, performance: entry.performance, reliability: entry.reliability, tyre: entry.tyre, rank: index + 1 }));
  }
  function publicReport(state, year) {
    const report = state.settledYears[String(year)] || state.lastReport;
    return report ? clone(report) : null;
  }
  function publicSnapshot(state) {
    return {
      schemaVersion: state.schemaVersion,
      startYear: state.startYear,
      currentYear: state.currentYear,
      teams: publicGrid(state),
      regulations: clone((state.regulations || []).filter(entry => entry.year <= state.currentYear + 1)),
      history: (state.history || []).map(entry => ({ year: entry.year, cars: publicHistoricalGrid(entry.cars || {}), standings: clone(entry.standings || []), nextYear: entry.nextYear, regulation: clone(entry.regulation) })),
      lastReport: state.lastReport ? clone(state.lastReport) : null,
    };
  }
  function validateState(state) {
    const errors = [], teams = state && state.teams ? Object.keys(state.teams) : [];
    if (!state || state.schemaVersion !== SCHEMA_VERSION) errors.push('Car world schema is invalid');
    if (!state || !Number.isFinite(state.currentYear)) errors.push('Car world year is invalid');
    if (teams.length !== 11) errors.push('Car world must contain 11 teams');
    function checkCars(cars, label) { Object.keys(cars || {}).forEach(team => {
      const car = cars[team];
      if (!car || typeof car !== 'object') { errors.push(team + ' ' + label + ' car is missing');return; }
      if (!Number.isFinite(car.performance) || car.performance < 45 || car.performance > 99) errors.push(team + ' performance out of bounds');
      if (!Number.isFinite(car.reliability) || car.reliability < 68 || car.reliability > 99) errors.push(team + ' reliability out of bounds');
      if (!Number.isFinite(car.tyre) || car.tyre < 62 || car.tyre > 99) errors.push(team + ' tyre out of bounds');
      if (Object.keys(car).some(key => !ATTRS.includes(key))) errors.push(team + ' ' + label + ' car shape is invalid');
    }); }
    checkCars(state && state.teams, 'current');
    if (!state || !state.secrets || !state.secrets.profiles) errors.push('Hidden team profiles missing');
    else teams.forEach(team => { const profile=state.secrets.profiles[team];if(!profile||![profile.technical,profile.adaptation,profile.volatility,profile.cycle].every(Number.isFinite))errors.push(team+' hidden profile is invalid'); });
    if (!state || !Array.isArray(state.regulations) || state.regulations.some(item => !Number.isFinite(item.year) || !REGULATIONS[item.kind])) errors.push('Regulation schedule is invalid');
    if (state.pending && state.pending.year !== state.currentYear + 1) errors.push('Pending car year is invalid');
    if (state.pending) { if (Object.keys(state.pending.teams || {}).length !== 11) errors.push('Pending car grid is incomplete');checkCars(state.pending.teams || {}, 'pending'); }
    return { ok: errors.length === 0, errors, teamCount: teams.length };
  }

  const api = {
    SCHEMA_VERSION, newState, migrateState, settleSeason, beginYear,
    publicTeam, publicGrid, publicReport, publicSnapshot, regulationStatus, validateState, carScore,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1TeamEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
