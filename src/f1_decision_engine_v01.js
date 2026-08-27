/* F1 Team Principal — decision engine V0.2
 * Pure game logic: no UI, no lap simulation, no hidden formula shown to players.
 */
(function (root) {
  'use strict';

  const PROFILES = {
    aggressive: {
      outcomes: [
        { key: 'breakthrough', probability: 0.40, multiplier: 1.55 },
        { key: 'progress', probability: 0.35, multiplier: 0.75 },
        { key: 'setback', probability: 0.25, multiplier: -0.35 },
      ],
      risk: 'High',
    },
    balanced: {
      outcomes: [
        { key: 'success', probability: 0.55, multiplier: 1.15 },
        { key: 'progress', probability: 0.35, multiplier: 0.62 },
        { key: 'setback', probability: 0.10, multiplier: -0.12 },
      ],
      risk: 'Medium',
    },
    conservative: {
      outcomes: [
        { key: 'success', probability: 0.75, multiplier: 0.72 },
        { key: 'progress', probability: 0.23, multiplier: 0.32 },
        { key: 'no_change', probability: 0.02, multiplier: 0 },
      ],
      risk: 'Low',
    },
  };

  const DEFAULT_ENGINE_SUPPLIER = 'ferrari';
  const ENGINE_SUPPLIERS = Object.freeze([
    Object.freeze({
      id: 'mercedes',
      label: '梅赛德斯',
      price: '昂贵',
      performance: '领先',
      reliability: '良好',
      description: '动力表现略占优势，但会明显压缩后续研发余地。',
    }),
    Object.freeze({
      id: 'ferrari',
      label: '法拉利',
      price: '适中',
      performance: '强劲',
      reliability: '稳定',
      description: '性能、可靠性与资源消耗较为均衡。',
    }),
    Object.freeze({
      id: 'honda',
      label: '本田',
      price: '亲民',
      performance: '稳健',
      reliability: '优秀',
      description: '绝对性能稍弱，但可靠性更好并保留更多预算空间。',
    }),
  ]);

  // Kept private so the UI communicates trade-offs qualitatively.
  const ENGINE_SUPPLIER_EFFECTS = Object.freeze({
    mercedes: Object.freeze({ performance: 0.110, reliability: 0.130, budgetPressure: 1.25 }),
    ferrari: Object.freeze({ performance: 0.080, reliability: 0.150, budgetPressure: 0.65 }),
    honda: Object.freeze({ performance: 0.055, reliability: 0.180, budgetPressure: 0.25 }),
  });

  const DEFAULT_COMMERCIAL_BUDGET = 'balanced';
  const COMMERCIAL_BUDGET_OPTIONS = Object.freeze([
    Object.freeze({
      id: 'slight_burden',
      label: '轻微负担',
      tone: 'warning',
      description: '车手组合的商业吸引力有限，车队需要承担少量额外预算压力。',
    }),
    Object.freeze({
      id: 'balanced',
      label: '收支平衡',
      tone: 'neutral',
      description: '车手组合带来的商业收入与相关成本大致相抵。',
    }),
    Object.freeze({
      id: 'modest_relief',
      label: '略有补充',
      tone: 'positive',
      description: '车手组合为赛季预算带来小幅支持。',
    }),
    Object.freeze({
      id: 'useful_relief',
      label: '明显支持',
      tone: 'positive',
      description: '车手组合能够明显拓宽车队的赛季资源空间。',
    }),
    Object.freeze({
      id: 'strong_relief',
      label: '强力支持',
      tone: 'positive',
      description: '车手组合拥有突出的商业号召力，为车队带来可观支持。',
    }),
  ]);

  // Kept private: callers choose a qualitative commercial tier, never a raw value.
  const COMMERCIAL_BUDGET_EFFECTS = Object.freeze({
    slight_burden: 0.15,
    balanced: 0,
    modest_relief: -0.12,
    useful_relief: -0.24,
    strong_relief: -0.35,
  });

  const EVENT_TEMPLATES = [
    event('upgrade_rush', 'development', '紧急升级窗口', '工程部门可以提前带来一套尚未完全验证的升级。', 'performance'),
    event('floor_revision', 'development', '底板方案修订', '新方案展现出潜力，但会占用后续开发资源。', 'performance'),
    event('correlation_issue', 'development', '风洞数据偏差', '模拟数据与赛道反馈出现差异，需要决定修正幅度。', 'momentum'),
    event('cooling_package', 'development', '冷却系统改进', '可靠性团队提出了一套低风险的改良方案。', 'reliability'),
    event('tyre_window', 'development', '轮胎工作窗口', '工程师找到了改善长距离表现的新方向。', 'performance'),
    event('late_stop', 'race', '迟来的进站机会', '你的车手正处于积分区边缘，新胎可能带来反击机会。', 'race'),
    event('track_position', 'race', '守住赛道位置', '身后赛车更快，但你的车手仍有机会坚持到终点。', 'race'),
    event('recovery_drive', 'race', '后排反击', '糟糕的发车位置迫使车队选择不同的比赛方案。', 'race'),
    event('split_strategy', 'race', '双车策略分流', '两名车手位置接近，车队可以选择不同风险路线。', 'race'),
    event('points_gamble', 'race', '积分区赌博', '一次主动选择可能把普通完赛变成重要积分。', 'race'),
    event('podium_chance', 'race', '领奖台窗口', '前方竞争者出现问题，车队获得一次难得机会。', 'race'),
    event('difficult_weekend', 'race', '困难周末', '赛车状态低于预期，需要决定如何限制损失。', 'race'),
    event('driver_feedback', 'driver', '车手反馈分歧', '两名车手对下一步调校方向给出了不同意见。', 'driver'),
    event('extra_simulator', 'driver', '额外模拟器计划', '车队获得了有限的额外准备时间。', 'driver'),
    event('young_driver_run', 'driver', '年轻车手测试', '一次额外测试可以用于当前赛季或未来培养。', 'driver'),
    event('team_role', 'driver', '车手资源优先级', '赛季形势要求车队重新考虑两名车手的资源分配。', 'driver'),
    event('supplier_offer', 'special', '供应商合作机会', '合作伙伴愿意加速一个项目，但结果存在不确定性。', 'momentum'),
    event('factory_push', 'special', '工厂冲刺计划', '团队愿意投入额外精力完成一次集中开发。', 'performance'),
    event('reliability_warning', 'special', '可靠性预警', '工程师发现了尚未造成退赛的潜在技术问题。', 'reliability'),
    event('rival_concept', 'special', '竞争对手的新概念', '车队可以快速跟进，也可以坚持原有开发路线。', 'momentum'),
  ];

  function event(id, category, title, description, target) {
    return { id, category, title, description, target };
  }

  function newDecisionState(options) {
    const requested = options && options.engineSupplier;
    const engineSupplier = requested == null ? DEFAULT_ENGINE_SUPPLIER : validSupplierId(requested);
    const requestedCommercial = options && options.commercialBudgetId;
    const commercialBudgetId = requestedCommercial == null
      ? DEFAULT_COMMERCIAL_BUDGET
      : validCommercialBudgetId(requestedCommercial);
    return {
      performance: 0,
      reliability: 0,
      momentum: 0,
      driverBonus: {},
      raceBonuses: {},
      budgetPressure: 0,
      storyFlags: [],
      history: [],
      schedule: [],
      preseason: null,
      midseason: null,
      engineSupplier,
      engineSupplierHistory: [],
      commercialBudgetId,
      commercialBudgetHistory: [],
    };
  }

  function validSupplierId(value) {
    const id = String(value || '').toLowerCase();
    if (!ENGINE_SUPPLIER_EFFECTS[id]) throw new Error('Invalid engine supplier');
    return id;
  }

  function validCommercialBudgetId(value) {
    const id = String(value || '').toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(COMMERCIAL_BUDGET_EFFECTS, id)) {
      throw new Error('Invalid commercial budget tier');
    }
    return id;
  }

  function migrateState(state) {
    if (!state || typeof state !== 'object') throw new Error('Decision state is required');
    if (!ENGINE_SUPPLIER_EFFECTS[state.engineSupplier]) state.engineSupplier = DEFAULT_ENGINE_SUPPLIER;
    if (!Array.isArray(state.engineSupplierHistory)) state.engineSupplierHistory = [];
    if (!Object.prototype.hasOwnProperty.call(COMMERCIAL_BUDGET_EFFECTS, state.commercialBudgetId)) {
      state.commercialBudgetId = DEFAULT_COMMERCIAL_BUDGET;
    }
    if (!Array.isArray(state.commercialBudgetHistory)) state.commercialBudgetHistory = [];
    return state;
  }

  function engineSupplierOptions() {
    return ENGINE_SUPPLIERS.map((supplier) => ({ ...supplier }));
  }

  function engineSupplier(id) {
    const normalized = validSupplierId(id);
    return { ...ENGINE_SUPPLIERS.find((supplier) => supplier.id === normalized) };
  }

  function currentEngineSupplier(state) {
    const id = state && ENGINE_SUPPLIER_EFFECTS[state.engineSupplier] ? state.engineSupplier : DEFAULT_ENGINE_SUPPLIER;
    return engineSupplier(id);
  }

  function commercialBudgetOptions() {
    return COMMERCIAL_BUDGET_OPTIONS.map((option) => ({ ...option }));
  }

  function commercialBudget(id) {
    const normalized = validCommercialBudgetId(id);
    return { ...COMMERCIAL_BUDGET_OPTIONS.find((option) => option.id === normalized) };
  }

  function currentCommercialBudget(state) {
    const id = state && Object.prototype.hasOwnProperty.call(COMMERCIAL_BUDGET_EFFECTS, state.commercialBudgetId)
      ? state.commercialBudgetId
      : DEFAULT_COMMERCIAL_BUDGET;
    return commercialBudget(id);
  }

  function applyEngineSupplier(state, supplierId) {
    const id = validSupplierId(supplierId);
    const effect = ENGINE_SUPPLIER_EFFECTS[id];
    state.performance += effect.performance;
    state.reliability += effect.reliability;
    state.budgetPressure += effect.budgetPressure;
    state.engineSupplier = id;
    state.engineSupplierHistory.push(id);
    return currentEngineSupplier(state);
  }

  function applyCommercialBudget(state, commercialBudgetId) {
    const id = validCommercialBudgetId(commercialBudgetId);
    state.budgetPressure += COMMERCIAL_BUDGET_EFFECTS[id];
    state.commercialBudgetId = id;
    state.commercialBudgetHistory.push(id);
    return currentCommercialBudget(state);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function weightedPick(items, weights, random) {
    let cursor = random() * weights.reduce((sum, value) => sum + value, 0);
    for (let index = 0; index < items.length; index += 1) {
      cursor -= weights[index];
      if (cursor <= 0) return items[index];
    }
    return items[items.length - 1];
  }

  function createSchedule(random) {
    // One event in each half of the season. Together with pre-season,
    // mid-season and an optional finale this keeps the hard five-node cap.
    const rounds = [
      4 + Math.floor(random() * 7),  // R4-R10
      14 + Math.floor(random() * 8), // R14-R21
    ];
    const racePool = EVENT_TEMPLATES.filter((item) => item.category === 'race');
    const used = new Set();
    return rounds.map((round) => {
      const candidates = racePool.filter((item) => !used.has(item.id));
      const template = candidates[Math.floor(random() * candidates.length)];
      used.add(template.id);
      return { round, eventId: template.id, resolved: false };
    });
  }

  function preseasonPlan(state, plan, random) {
    migrateState(state);
    const investmentProfile = { high: 'aggressive', medium: 'balanced', low: 'conservative' }[plan.investment];
    if (!investmentProfile) throw new Error('Invalid preseason investment');
    const supplierId = plan.engineSupplier == null ? state.engineSupplier : validSupplierId(plan.engineSupplier);
    const commercialBudgetId = plan.commercialBudgetId == null
      ? state.commercialBudgetId
      : validCommercialBudgetId(plan.commercialBudgetId);
    const effectivePlan = { ...plan, engineSupplier: supplierId, commercialBudgetId };
    const base = { high: 0.46, medium: 0.32, low: 0.20 }[plan.investment];
    const result = resolveProfile(investmentProfile, base, random);
    applyFocus(state, plan.focus, result.value);
    state.budgetPressure += { high: 2, medium: 1, low: 0 }[plan.investment];
    state.momentum += { high: -0.05, medium: 0.04, low: 0.16 }[plan.investment];
    applyDriverPriority(state, plan.driverPriority || [], 0.16);
    const supplier = applyEngineSupplier(state, supplierId);
    const commercialBudget = applyCommercialBudget(state, commercialBudgetId);
    state.preseason = { plan: effectivePlan, outcome: result.key, supplier, commercialBudget };
    state.schedule = createSchedule(random);
    state.history.push({ phase: 'preseason', plan: effectivePlan, outcome: result.key, value: result.value, engineSupplier: supplierId, commercialBudgetId });
    normalize(state);
    return { ...result, supplier, commercialBudget };
  }

  function midseasonAdjustment(state, plan, random) {
    migrateState(state);
    const investmentProfile = { push: 'aggressive', maintain: 'balanced', reduce: 'conservative' }[plan.investment];
    if (!investmentProfile) throw new Error('Invalid midseason investment');
    const pressurePenalty = Math.max(0, state.budgetPressure - 2) * 0.025;
    const base = { push: 0.38, maintain: 0.28, reduce: 0.18 }[plan.investment];
    const result = resolveProfile(investmentProfile, base, random);
    applyFocus(state, plan.focus, result.value - pressurePenalty);
    state.budgetPressure += { push: 2, maintain: 1, reduce: -1 }[plan.investment];
    state.momentum += { push: -0.04, maintain: 0.05, reduce: 0.14 }[plan.investment];
    applyDriverPriority(state, plan.driverPriority || [], 0.12);
    state.midseason = { plan, outcome: result.key };
    state.history.push({ phase: 'midseason', plan, outcome: result.key, value: result.value });
    normalize(state);
    return result;
  }

  function resolveEvent(state, eventId, choice, random, context) {
    migrateState(state);
    const template = EVENT_TEMPLATES.find((item) => item.id === eventId);
    if (!template) throw new Error('Unknown event: ' + eventId);
    if (!PROFILES[choice]) throw new Error('Unknown choice profile: ' + choice);
    const affinity = contextAffinity(template, choice, context || {});
    const momentumFactor = 1 + clamp(state.momentum, -0.25, 0.35);
    const pressurePenalty = Math.max(0, state.budgetPressure - 3) * 0.018;
    const base = ({ race: 0.24, development: 0.30, driver: 0.22, special: 0.32 })[template.category];
    const result = resolveProfile(choice, base * momentumFactor, random);
    const value = result.value + affinity - pressurePenalty;
    applyTarget(state, template.target, value, context || {});
    state.budgetPressure += choice === 'aggressive' ? 0.45 : choice === 'balanced' ? 0.18 : -0.08;
    state.momentum += result.key === 'setback' ? -0.05 : result.key === 'breakthrough' ? 0.09 : 0.035;
    const flag = `${template.id}:${choice}:${result.key}`;
    state.storyFlags.push(flag);
    state.history.push({ phase: 'random', eventId, choice, outcome: result.key, value });
    const slot = state.schedule.find((entry) => entry.eventId === eventId && !entry.resolved);
    if (slot) slot.resolved = true;
    normalize(state);
    return { ...result, value, template, flag };
  }

  function resolveProfile(profileName, base, random) {
    const profile = PROFILES[profileName];
    const outcome = weightedPick(profile.outcomes, profile.outcomes.map((item) => item.probability), random);
    return { key: outcome.key, value: base * outcome.multiplier, risk: profile.risk };
  }

  function applyFocus(state, focus, value) {
    if (focus === 'performance') {
      state.performance += value;
      state.reliability -= Math.max(0, value) * 0.10;
    } else if (focus === 'reliability') {
      state.reliability += value * 2.6;
      state.performance += Math.max(0, value) * 0.18;
    } else if (focus === 'balanced') {
      state.performance += value * 0.62;
      state.reliability += value * 1.05;
    } else {
      throw new Error('Invalid development focus');
    }
  }

  function applyTarget(state, target, value, context) {
    if (target === 'performance') state.performance += value;
    else if (target === 'reliability') state.reliability += value * 2.5;
    else if (target === 'momentum') state.momentum += value * 0.7;
    else if (target === 'race') {
      const round = String(context.round || 'next');
      state.raceBonuses[round] = (state.raceBonuses[round] || 0) + value;
    }
    else if (target === 'driver') {
      const driver = context.driver || 'team';
      state.driverBonus[driver] = (state.driverBonus[driver] || 0) + value * 0.45;
    }
  }

  function applyDriverPriority(state, drivers, scale) {
    drivers.forEach((entry) => {
      const multiplier = { high: 1, medium: 0.6, low: 0.25 }[entry.level];
      if (multiplier == null) return;
      state.driverBonus[entry.name] = (state.driverBonus[entry.name] || 0) + scale * multiplier;
    });
  }

  function contextAffinity(template, choice, context) {
    let affinity = 0;
    if (template.target === 'reliability' && context.lowReliability && choice !== 'aggressive') affinity += 0.055;
    if (template.target === 'performance' && context.chasing && choice === 'aggressive') affinity += 0.06;
    if (template.category === 'race' && context.protectingLead && choice === 'conservative') affinity += 0.05;
    if (template.category === 'driver' && context.highTeamwork && choice !== 'aggressive') affinity += 0.04;
    return affinity;
  }

  function normalize(state) {
    migrateState(state);
    state.performance = clamp(state.performance, -0.15, 1.50);
    state.reliability = clamp(state.reliability, -0.50, 2.50);
    state.momentum = clamp(state.momentum, -0.25, 0.35);
    state.budgetPressure = clamp(state.budgetPressure, 0, 6);
    Object.keys(state.driverBonus).forEach((name) => {
      state.driverBonus[name] = clamp(state.driverBonus[name], 0, 0.45);
    });
    Object.keys(state.raceBonuses).forEach((round) => {
      state.raceBonuses[round] = clamp(state.raceBonuses[round], -0.10, 0.65);
    });
  }

  function scheduledEventForRound(state, round) {
    const slot = state.schedule.find((entry) => entry.round === round && !entry.resolved);
    return slot ? EVENT_TEMPLATES.find((item) => item.id === slot.eventId) : null;
  }

  function consumeRaceBonus(state, round) {
    const direct = state.raceBonuses[String(round)] || 0;
    const fallback = state.raceBonuses.next || 0;
    delete state.raceBonuses[String(round)];
    delete state.raceBonuses.next;
    return direct + fallback;
  }

  function midseasonFeedback(state) {
    const performance = state.performance >= 0.55 ? '速度提升超过预期' : state.performance >= 0.25 ? '赛车取得了稳定进步' : '性能提升低于最初预期';
    const reliability = state.reliability >= 0.8 ? '可靠性工作效果明显' : state.reliability >= 0.2 ? '可靠性略有改善' : '技术风险仍未完全解决';
    const resources = state.budgetPressure >= 4 ? '剩余开发空间非常有限' : state.budgetPressure >= 2 ? '剩余资源需要谨慎分配' : '车队仍保留充足调整空间';
    return { performance, reliability, resources };
  }

  function budgetStatus(state, projectedDelta) {
    const pressure = clamp((Number(state && state.budgetPressure) || 0) + (Number(projectedDelta) || 0), 0, 6);
    if (pressure <= .9) return { id:'ample', label:'充裕', tone:'positive', description:'车队仍有充分空间应对后续开发与突发状况。' };
    if (pressure <= 2.2) return { id:'stable', label:'稳定', tone:'neutral', description:'当前计划可持续，但连续追加投入会开始压缩余地。' };
    if (pressure <= 3.8) return { id:'tight', label:'吃紧', tone:'warning', description:'剩余资源需要谨慎分配，激进方案的代价会更加明显。' };
    if (pressure <= 5) return { id:'strained', label:'紧张', tone:'danger', description:'可用开发空间已经很有限，应优先保证关键项目。' };
    return { id:'critical', label:'告急', tone:'danger', description:'资源几乎耗尽，继续追加投入会显著放大失败风险。' };
  }

  function projectedBudgetStatus(state, phase, plan) {
    const draft = plan || {};
    let delta = 0;
    if (phase === 'preseason') {
      const investment = { high: 2, medium: 1, low: 0 }[draft.investment];
      if (investment == null) throw new Error('Invalid preseason investment');
      const currentId = state && ENGINE_SUPPLIER_EFFECTS[state.engineSupplier] ? state.engineSupplier : DEFAULT_ENGINE_SUPPLIER;
      const supplierId = draft.engineSupplier == null ? currentId : validSupplierId(draft.engineSupplier);
      const currentCommercialId = state && Object.prototype.hasOwnProperty.call(COMMERCIAL_BUDGET_EFFECTS, state.commercialBudgetId)
        ? state.commercialBudgetId
        : DEFAULT_COMMERCIAL_BUDGET;
      const commercialBudgetId = draft.commercialBudgetId == null
        ? currentCommercialId
        : validCommercialBudgetId(draft.commercialBudgetId);
      delta = investment + ENGINE_SUPPLIER_EFFECTS[supplierId].budgetPressure + COMMERCIAL_BUDGET_EFFECTS[commercialBudgetId];
    } else if (phase === 'midseason') {
      const investment = { push: 2, maintain: 1, reduce: -1 }[draft.investment];
      if (investment == null) throw new Error('Invalid midseason investment');
      delta = investment;
    }
    return budgetStatus(state, delta);
  }

  function seasonSummary(state) {
    return {
      performance: state.performance,
      reliability: state.reliability,
      momentum: state.momentum,
      decisions: state.history.length,
      successes: state.history.filter((item) => !['setback', 'no_change'].includes(item.outcome)).length,
      setbacks: state.history.filter((item) => item.outcome === 'setback').length,
      storyFlags: [...state.storyFlags],
      engineSupplier: currentEngineSupplier(state),
      commercialBudget: currentCommercialBudget(state),
    };
  }

  const api = {
    PROFILES,
    EVENT_TEMPLATES,
    DEFAULT_ENGINE_SUPPLIER,
    ENGINE_SUPPLIERS,
    DEFAULT_COMMERCIAL_BUDGET,
    COMMERCIAL_BUDGET_OPTIONS,
    newDecisionState,
    migrateState,
    engineSupplierOptions,
    engineSupplier,
    currentEngineSupplier,
    commercialBudgetOptions,
    commercialBudget,
    currentCommercialBudget,
    createSchedule,
    preseasonPlan,
    midseasonAdjustment,
    resolveEvent,
    midseasonFeedback,
    budgetStatus,
    projectedBudgetStatus,
    seasonSummary,
    scheduledEventForRound,
    consumeRaceBonus,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1DecisionEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
