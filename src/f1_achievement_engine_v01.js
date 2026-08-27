/* F1 Team Principal — achievement engine V0.1
 * Pure save-state logic. No DOM, storage, clock or random-number dependency.
 */
(function (root) {
  'use strict';

  const SCHEMA_VERSION = 1;
  const MASKED_TITLE = '？？？';
  const MASKED_DESCRIPTION = '完成一段特殊历史后揭晓。';

  const DEFINITIONS = [
    achievement('points_opened', 'regular', '积分开张', '首次为车队取得积分。', '◆', facts => maximum(facts.careerPoints, facts.seasonPoints) > 0),
    achievement('first_podium', 'regular', '香槟时刻', '首次登上领奖台。', '▲', facts => maximum(facts.careerPodiums, facts.seasonPodiums) > 0),
    achievement('first_victory', 'regular', '最高领奖台', '首次赢得一场大奖赛。', '★', facts => maximum(facts.careerWins, facts.seasonWins) > 0),
    achievement('drivers_crown', 'regular', '世界之巅', '带领一名车手赢得世界车手冠军。', '♛', facts => truthy(facts.driverChampion) || number(facts.driverTitles) > 0),
    achievement('constructors_crown', 'regular', '团队王冠', '带领车队赢得世界车队冠军。', '♜', facts => truthy(facts.constructorsChampion) || maximum(facts.constructorTitles, facts.constructorsTitles) > 0),

    achievement('monza_miracle', 'hidden', '蒙扎奇迹', '以赛前实力排名第七或更低的车队赢下一场大奖赛。', '✦', facts => truthy(facts.raceWon) && number(facts.preRaceTeamRank) >= 7),
    achievement('sakhir_comeback', 'hidden', '萨基尔归来', '从第十八位或更后方取胜，或在“后排反击”取得突破后赢下比赛。', '↟', facts => truthy(facts.raceWon) && (number(facts.winnerStartPosition) >= 18 || recoveryBreakthrough(facts))),
    achievement('hungary_survivor', 'hidden', '匈牙利幸存者', '在至少五人退赛的极端乱战中赢得比赛。', '⚑', facts => truthy(facts.raceWon) && chaosRace(facts.raceType) && number(facts.raceDnfCount) >= 5),
    achievement('one_point_crown', 'hidden', '一分封王', '以不超过一分的优势赢得世界车手冠军。', 'Ⅰ', facts => (truthy(facts.driverChampion) || number(facts.driverTitles) > 0) && finite(facts.championshipMargin) && Number(facts.championshipMargin) <= 1),
    achievement('fairytale_team', 'hidden', '童话赛季', '从赛季初赛车实力第九或更低的位置夺得车队冠军。', '∞', facts => truthy(facts.constructorsChampion) && number(facts.startCarRank) >= 9),
  ];

  const BY_ID = Object.fromEntries(DEFINITIONS.map(definition => [definition.id, definition]));
  const ACHIEVEMENT_IDS = Object.freeze(DEFINITIONS.map(definition => definition.id));

  function achievement(id, category, title, description, icon, condition) {
    return Object.freeze({ id, category, title, description, icon, condition });
  }

  function number() {
    for (const value of arguments) if (finite(value)) return Number(value);
    return 0;
  }

  function maximum() {
    const values = [...arguments].filter(finite).map(Number);
    return values.length ? Math.max(...values) : 0;
  }

  function finite(value) {
    return value !== '' && value != null && Number.isFinite(Number(value));
  }

  function truthy(value) {
    return value === true || value === 1 || value === 'true';
  }

  function chaosRace(value) {
    return ['chaos', '乱战', '极端乱战'].includes(String(value || '').toLowerCase());
  }

  function recoveryBreakthrough(facts) {
    if (facts.decisionEventId === 'recovery_drive' && facts.decisionOutcome === 'breakthrough') return true;
    return (Array.isArray(facts.eventFlags) ? facts.eventFlags : []).some(flag => /^recovery_drive:.*:breakthrough$/.test(String(flag)));
  }

  function newState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      serial: 0,
      unlocked: {},
      pending: [],
      acknowledged: [],
    };
  }

  function migrateState(raw) {
    const state = raw && typeof raw === 'object' ? raw : newState();
    const sourceUnlocked = Array.isArray(state.unlocked)
      ? Object.fromEntries(state.unlocked.map((id, index) => [id, { id, sequence: index + 1, context: null }]))
      : state.unlocked && typeof state.unlocked === 'object' ? state.unlocked : {};
    const unlocked = {};
    let serial = Math.max(0, Math.round(Number(state.serial) || 0));
    Object.entries(sourceUnlocked).forEach(([key, value]) => {
      const id = BY_ID[key] ? key : value && BY_ID[value.id] ? value.id : null;
      if (!id || unlocked[id]) return;
      const sequence = Math.max(1, Math.round(Number(value && value.sequence) || serial + 1));
      serial = Math.max(serial, sequence);
      unlocked[id] = {
        id,
        sequence,
        unlockedAt: primitive(value && value.unlockedAt),
        context: publicContext(value && value.context),
      };
    });
    const pending = uniqueKnown(state.pending).filter(id => unlocked[id]);
    const acknowledged = uniqueKnown(state.acknowledged).filter(id => unlocked[id] && !pending.includes(id));
    state.schemaVersion = SCHEMA_VERSION;
    state.serial = serial;
    state.unlocked = unlocked;
    state.pending = pending;
    state.acknowledged = acknowledged;
    return state;
  }

  function primitive(value) {
    return ['string', 'number', 'boolean'].includes(typeof value) ? value : null;
  }

  function publicContext(value) {
    if (!value || typeof value !== 'object') return null;
    const result = {};
    ['year', 'round', 'eventId', 'source'].forEach(key => {
      const item = primitive(value[key]);
      if (item != null) result[key] = item;
    });
    return Object.keys(result).length ? result : null;
  }

  function uniqueKnown(values) {
    const seen = new Set();
    return (Array.isArray(values) ? values : []).filter(id => {
      if (!BY_ID[id] || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function publicAchievement(state, definition) {
    const entry = state.unlocked[definition.id] || null;
    const unlocked = !!entry;
    const masked = definition.category === 'hidden' && !unlocked;
    return {
      id: definition.id,
      category: definition.category,
      hidden: definition.category === 'hidden',
      unlocked,
      masked,
      title: masked ? MASKED_TITLE : definition.title,
      description: masked ? MASKED_DESCRIPTION : definition.description,
      icon: masked ? '?' : definition.icon,
      unlockedAt: entry ? entry.unlockedAt : null,
    };
  }

  function catalog(state, category) {
    const current = migrateState(state);
    const requested = category || 'all';
    if (!['all', 'regular', 'hidden'].includes(requested)) throw new Error('Invalid achievement category');
    return DEFINITIONS
      .filter(definition => requested === 'all' || definition.category === requested)
      .map(definition => publicAchievement(current, definition));
  }

  function regularCatalog(state) {
    return catalog(state, 'regular');
  }

  function hiddenCatalog(state) {
    return catalog(state, 'hidden');
  }

  function unlock(state, achievementId, context) {
    const current = migrateState(state);
    const definition = BY_ID[achievementId];
    if (!definition) throw new Error('Unknown achievement: ' + achievementId);
    if (current.unlocked[achievementId]) {
      return { unlocked: false, alreadyUnlocked: true, achievement: publicAchievement(current, definition), pendingCount: current.pending.length };
    }
    current.serial += 1;
    current.unlocked[achievementId] = {
      id: achievementId,
      sequence: current.serial,
      unlockedAt: primitive(context && context.unlockedAt),
      context: publicContext(context),
    };
    if (!current.pending.includes(achievementId)) current.pending.push(achievementId);
    return { unlocked: true, alreadyUnlocked: false, achievement: publicAchievement(current, definition), pendingCount: current.pending.length };
  }

  function evaluate(state, facts) {
    const current = migrateState(state);
    const input = facts && typeof facts === 'object' ? facts : {};
    const context = {
      year: input.year,
      round: input.round,
      eventId: input.eventId || input.decisionEventId,
      source: input.source || 'evaluation',
      unlockedAt: input.unlockedAt,
    };
    const newlyUnlocked = [];
    DEFINITIONS.forEach(definition => {
      if (current.unlocked[definition.id] || !definition.condition(input)) return;
      const result = unlock(current, definition.id, context);
      if (result.unlocked) newlyUnlocked.push(result.achievement);
    });
    return { newlyUnlocked, pendingCount: current.pending.length };
  }

  function pendingQueue(state) {
    const current = migrateState(state);
    return current.pending.map(id => publicAchievement(current, BY_ID[id]));
  }

  function nextPopup(state) {
    const queue = pendingQueue(state);
    return queue.length ? queue[0] : null;
  }

  function confirmPopup(state, achievementId) {
    const current = migrateState(state);
    const id = achievementId == null ? current.pending[0] : achievementId;
    const index = current.pending.indexOf(id);
    if (index < 0) return { confirmed: false, achievement: null, pendingCount: current.pending.length };
    current.pending.splice(index, 1);
    if (!current.acknowledged.includes(id)) current.acknowledged.push(id);
    return { confirmed: true, achievement: publicAchievement(current, BY_ID[id]), pendingCount: current.pending.length };
  }

  const api = {
    SCHEMA_VERSION,
    ACHIEVEMENT_IDS,
    newState,
    migrateState,
    unlock,
    evaluate,
    catalog,
    regularCatalog,
    hiddenCatalog,
    pendingQueue,
    nextPopup,
    confirmPopup,
    confirmPending: confirmPopup,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1AchievementEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
