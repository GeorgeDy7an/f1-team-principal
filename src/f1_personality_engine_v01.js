/* F1 Team Principal — personality engine V0.2
 * Hidden values drive stories and a deliberately small commercial-budget effect.
 * They never enter race pace, finishing order or DNF math.
 * Profiles for real-world names are save-specific fictional game templates, not factual claims.
 */
(function (root) {
  'use strict';

  const ATTRIBUTE_KEYS = [
    'professionalism', 'ambition', 'loyalty', 'ego',
    'resilience', 'teamwork', 'temperament', 'commercialAppeal',
  ];

  const ATTRIBUTE_META = {
    professionalism: { name: '职业态度' }, ambition: { name: '野心' },
    loyalty: { name: '忠诚' }, ego: { name: '自我意识' },
    resilience: { name: '心理韧性' }, teamwork: { name: '团队性' },
    temperament: { name: '情绪稳定性' }, commercialAppeal: { name: '商业价值' },
  };

  const LABELS = [
    label('lacks_motivation', '缺乏动力', '他似乎需要车队持续推动，才能充分投入职业发展。', 130, v => v.professionalism <= 2),
    label('mercenary', '利益导向型', '职业选择似乎更容易受到待遇、机会与个人利益影响。', 126, v => v.loyalty <= 2 && v.commercialAppeal >= 7 && v.ambition >= 7),
    label('self_centered', '自我中心', '他非常重视个人地位，与强势队友共事可能带来挑战。', 124, v => v.ego >= 8 && v.teamwork <= 3),
    label('volatile', '易冲动型', '他对争议和压力的反应可能比较直接，需要谨慎沟通。', 122, v => v.temperament <= 2 && v.ego >= 7),
    label('emotional', '情绪化', '近期事件可能明显影响他的情绪和对外表达。', 120, v => v.temperament <= 3 && v.resilience <= 4),
    label('fragile_confidence', '信心敏感型', '连续挫折可能令他开始怀疑自己的职业方向。', 118, v => v.resilience <= 2 && v.temperament <= 5),
    label('complacent', '易满足型', '他似乎不会主动为自己的职业发展设定很高标准。', 116, v => v.ambition <= 3 && v.professionalism <= 4),

    label('model_professional', '模范职业车手', '他在围场内拥有出色的职业声誉，也能自然融入团队。', 110, v => v.professionalism >= 9 && v.teamwork >= 8 && v.temperament >= 8 && v.ego <= 7),
    label('team_first', '团队至上', '他愿意为了车队整体目标调整自己的个人计划。', 108, v => v.teamwork >= 9 && v.ego <= 4),
    label('natural_leader', '自然领袖', '他兼具进取心、韧性和团队影响力，容易成为更衣室核心。', 106, v => v.teamwork >= 8 && v.resilience >= 8 && v.ambition >= 7 && v.ego >= 4 && v.ego <= 7),
    label('self_motivated', '自我激励型', '他对自己的职业发展有明确要求，通常不需要车队持续督促。', 104, v => v.professionalism >= 8 && v.ambition >= 7 && v.temperament >= 5),
    label('resilient', '坚韧型', '困难很少长期改变他的职业态度。', 102, v => v.resilience >= 9 && v.professionalism >= 6),
    label('loyalist', '忠诚型', '他重视长期关系，不会轻易放弃已经建立的车队纽带。', 100, v => v.loyalty >= 9 && v.teamwork >= 6),
    label('quiet_professional', '低调职业型', '他把主要精力放在工作本身，对外界关注兴趣有限。', 98, v => v.professionalism >= 8 && v.commercialAppeal <= 3 && v.ego <= 6),
    label('calm_operator', '沉稳型', '他通常能够冷静处理争议、压力和复杂沟通。', 96, v => v.temperament >= 9 && v.resilience >= 7),

    label('strong_willed', '强势型', '他对自己在车队中的地位有清晰看法，并不习惯长期从属。', 90, v => v.ego >= 8 && v.ambition >= 8 && v.professionalism >= 5),
    label('ambitious', '雄心勃勃', '他显然期待争夺最高荣誉，不会长期满足于普通目标。', 88, v => v.ambition >= 9 && v.professionalism >= 5),
    label('independent', '独立型', '他习惯按照自己的判断行事，更关注个人职业规划。', 86, v => v.ego >= 7 && v.teamwork <= 5 && v.temperament >= 5),
    label('commercial_star', '商业明星', '他天然容易获得媒体、粉丝和商业合作伙伴的关注。', 84, v => v.commercialAppeal >= 9),
    label('charismatic', '高人气型', '他在围场外拥有明显吸引力，公共活动通常能获得积极反馈。', 72, v => v.commercialAppeal >= 8),
    label('competitive', '竞争型', '他对成绩和队内比较保持着强烈关注。', 70, v => v.ambition >= 7 && v.ego >= 6),
    label('cooperative', '合作型', '他通常愿意听取团队意见，并配合车队整体安排。', 68, v => v.teamwork >= 7 && v.ego <= 6),
    label('professional', '职业型', '他以较为稳定、认真的方式对待自己的工作。', 66, v => v.professionalism >= 7),
    label('balanced', '平衡型', '暂时没有某一项性格特征完全主导他的围场形象。', 1, () => true),
  ];

  const OBSERVATIONS = {
    professionalism: {
      high: '对训练和准备工作的要求似乎很高。',
      low: '有时需要外界推动，才会充分投入发展计划。',
    },
    ambition: {
      high: '对未来抱有很高期待，并希望尽快竞争最高荣誉。',
      low: '似乎更重视稳定席位，而不是不断追求更高位置。',
    },
    loyalty: {
      high: '非常重视车队长期给予的支持和信任。',
      low: '在面对更好机会时，未必会把现有关系放在首位。',
    },
    ego: {
      high: '对自己在车队中的地位有比较明确的要求。',
      low: '不太执着于个人地位，通常愿意接受团队安排。',
    },
    resilience: {
      high: '很少让短期失败长期影响自己的职业态度。',
      low: '连续不利结果可能明显影响他的信心。',
    },
    teamwork: {
      high: '与车队工作人员和队友的合作反馈非常积极。',
      low: '更倾向独立处理问题，不一定主动考虑队友需要。',
    },
    temperament: {
      high: '面对争议时通常能够保持冷静和克制。',
      low: '压力下的对外表达有时会比较直接。',
    },
    commercialAppeal: {
      high: '媒体和商业合作伙伴对他表现出明显兴趣。',
      low: '目前在赛道外受到的关注相对有限。',
    },
  };

  const RARITY = {
    model_professional:'legendary',
    mercenary:'epic',natural_leader:'epic',team_first:'epic',
    quiet_professional:'rare',calm_operator:'rare',volatile:'rare',self_centered:'rare',fragile_confidence:'rare',strong_willed:'rare',
    loyalist:'uncommon',resilient:'uncommon',emotional:'uncommon',commercial_star:'uncommon',self_motivated:'uncommon',ambitious:'uncommon',complacent:'uncommon',lacks_motivation:'uncommon',
    independent:'common',charismatic:'common',competitive:'common',cooperative:'common',professional:'common',balanced:'common',
  };
  const RARITY_NAMES={common:'常见',uncommon:'少见',rare:'稀有',epic:'罕见',legendary:'传奇'};
  const DRIVER_PRESET_VERSION=1;
  const DRIVER_PRESETS=Object.freeze({
    'Max Verstappen':preset(7,9,7,9,8,5,8,8),
    'Kimi Antonelli':preset(8,8,6,5,7,6,7,6),
    'Charles Leclerc':preset(7,8,9,5,8,7,7,7),
    'George Russell':preset(8,8,7,6,8,8,8,7),
    'Lewis Hamilton':preset(9,8,7,6,9,9,9,10),
    'Lando Norris':preset(7,6,6,5,7,6,7,9),
    'Oscar Piastri':preset(7,7,7,5,8,7,9,5),
    'Fernando Alonso':preset(7,8,6,7,8,5,8,7),
    'Pierre Gasly':preset(7,7,6,5,9,7,7,7),
    'Isack Hadjar':preset(6,8,6,7,6,6,6,6),
    'Liam Lawson':preset(7,9,6,5,7,7,7,6),
    'Carlos Sainz':preset(7,6,7,5,7,6,7,7),
    'Alexander Albon':preset(6,6,7,4,7,8,8,6),
    'Oliver Bearman':preset(8,8,6,6,7,6,7,6),
    'Arvid Lindblad':preset(7,9,6,6,6,6,6,6),
    'Esteban Ocon':preset(6,8,6,7,7,6,6,6),
    'Gabriel Bortoleto':preset(8,8,6,5,7,6,7,6),
    'Nico Hulkenberg':preset(8,6,6,5,8,6,8,3),
    'Franco Colapinto':preset(6,7,6,5,6,6,6,8),
    'Valtteri Bottas':preset(8,7,8,4,8,9,8,7),
    'Sergio Perez':preset(7,7,7,6,9,7,7,8),
    'Lance Stroll':preset(6,6,8,5,7,6,9,7),
  });

  const REACTION_TEXT = {
    supportive: '他公开支持车队安排，并强调团队目标高于个人得失。',
    accepts: '他接受了车队解释，暂时不会进一步扩大问题。',
    private_concern: '他在内部表达了担忧，但仍然保持职业态度。',
    public_discontent: '他在公开场合质疑了车队决定，事件开始受到媒体关注。',
    motivated: '他把这次经历视为继续证明自己的动力。',
    shaken: '近期结果似乎正在影响他的信心。',
    calm: '他冷静回应了外界质疑，没有让事件继续发酵。',
    defensive: '他对批评作出了较为强硬的回应。',
    interested: '他愿意了解对方计划，并未立即承诺留队。',
    dismisses_offer: '他迅速淡化了转会传闻，并重申对当前项目的投入。',
    enthusiastic_mentor: '他主动投入时间帮助年轻车手适应车队。',
    reluctant_mentor: '他会完成车队要求，但对导师角色兴趣有限。',
    grounded: '他把成功归功于整个团队，并继续保持原有工作方式。',
    emboldened: '这次成功明显提高了他对未来和自身地位的期待。',
  };

  function label(id, name, summary, priority, when) {
    return { id, name, summary, priority, when };
  }

  function preset(professionalism, ambition, loyalty, ego, resilience, teamwork, temperament, commercialAppeal) {
    return Object.freeze({professionalism,ambition,loyalty,ego,resilience,teamwork,temperament,commercialAppeal});
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

  function generateValue(random, conservative) {
    const values = [1,2,3,4,5,6,7,8,9,10];
    const weights = conservative ? [0,1,4,12,21,25,20,12,5,0] : [2,3,8,12,22,23,14,11,3,2];
    return weightedPick(values, weights, random);
  }

  function newPersonality(random, options) {
    const settings = options || {};
    const values = {};
    ATTRIBUTE_KEYS.forEach(key => { values[key] = generateValue(random, !!settings.conservative); });
    values.ego = clamp(Math.round(values.ego * 0.78 + values.ambition * 0.22), 1, 10);
    if (values.ego >= 8 && values.teamwork >= 8 && random() < 0.55) values.teamwork -= 1;
    const profile = {
      version: 2,
      values,
      observationSeed: Math.floor(random() * 1000000),
      knowledge: settings.knowledge == null ? 1 : settings.knowledge,
      changeHistory: [],
      changedThisSeason: {},
      currentLabel: null,
    };
    if (settings.name) applyDriverPreset(profile, settings.name);
    profile.currentLabel = resolveLabel(profile.values).id;
    return profile;
  }

  function applyDriverPreset(profile, driverName) {
    migrateProfile(profile);
    const source=DRIVER_PRESETS[driverName];
    if(!profile||!source||Number(profile.presetVersion)>=DRIVER_PRESET_VERSION)return false;
    const history=Array.isArray(profile.changeHistory)?profile.changeHistory:[];
    profile.values={...source};
    history.forEach(change=>{if(!change||!ATTRIBUTE_KEYS.includes(change.key))return;const delta=Number(change.to)-Number(change.from);if(Number.isFinite(delta))profile.values[change.key]=clamp(profile.values[change.key]+delta,1,10)});
    profile.changeHistory=history;profile.changedThisSeason=profile.changedThisSeason&&typeof profile.changedThisSeason==='object'?profile.changedThisSeason:{};profile.presetVersion=DRIVER_PRESET_VERSION;profile.currentLabel=resolveLabel(profile.values).id;
    return true;
  }

  function migrateProfile(profile) {
    if(!profile||typeof profile!=='object')return profile;
    if(!profile.values||typeof profile.values!=='object')profile.values={};
    ATTRIBUTE_KEYS.forEach(key=>{const value=Number(profile.values[key]);profile.values[key]=Number.isFinite(value)?clamp(Math.round(value),1,10):5});
    if(!Array.isArray(profile.changeHistory))profile.changeHistory=[];
    if(!profile.changedThisSeason||typeof profile.changedThisSeason!=='object')profile.changedThisSeason={};
    if(!Number.isFinite(Number(profile.observationSeed)))profile.observationSeed=0;
    if(!Number.isFinite(Number(profile.knowledge)))profile.knowledge=1;
    profile.version=2;
    profile.currentLabel=resolveLabel(profile.values).id;
    return profile;
  }

  function commercialValue(profile) {
    migrateProfile(profile);
    const value=clamp(Math.round(Number(profile&&profile.values&&profile.values.commercialAppeal)||5),1,10);
    if(value>=9)return {id:'star',label:'明星',tone:'star',description:'能够显著扩大车队的赞助与商业合作空间。'};
    if(value>=7)return {id:'standout',label:'突出',tone:'standout',description:'拥有明显的市场号召力。'};
    if(value>=5)return {id:'steady',label:'稳定',tone:'steady',description:'商业影响大致处于围场常规水平。'};
    return {id:'limited',label:'有限',tone:'limited',description:'暂时难以为预算带来明显额外支持。'};
  }

  function teamCommercialPackage(profiles) {
    const rows=(Array.isArray(profiles)?profiles:[]).slice(0,2).filter(Boolean);
    if(rows.length<2)return {id:'balanced',label:'常规',tone:'neutral',description:'需要确定两名正赛车手后，才能评估阵容的商业回报。',drivers:rows.map(commercialValue)};
    const scores=rows.map(profile=>{migrateProfile(profile);const value=profile.values.commercialAppeal;return value>=10?4:value>=9?3:value>=8?2:value>=7?1:value>=6?.4:value>=5?0:value>=4?-.5:-1}).sort((a,b)=>b-a);
    const total=scores[0]+scores[1]*.55;
    const result=total>=4.5?['strong_relief','强力','positive','双车强大的商业号召力会明显缓解本赛季资源压力。']:
      total>=2.5?['useful_relief','有力','positive','双车商业组合会为本赛季预算提供有力支持。']:
      total>=.55?['modest_relief','小幅','positive','双车商业组合会小幅改善本赛季预算空间。']:
      total>=-.5?['balanced','常规','neutral','双车商业回报大致处于围场常规水平。']:
      ['slight_burden','有限','warning','双车商业回报有限，本赛季预算空间会略受压力。'];
    return {id:result[0],label:result[1],tone:result[2],description:result[3],drivers:rows.map(commercialValue)};
  }

  function resolveLabel(values) {
    return LABELS.filter(item => item.when(values)).sort((a,b) => b.priority - a.priority)[0];
  }

  function publicProfile(profile, knowledge) {
    migrateProfile(profile);
    const level = knowledge == null ? profile.knowledge : knowledge;
    const current = resolveLabel(profile.values);
    const threshold = level >= 3 ? 1 : level >= 2 ? 1.5 : 2;
    const limit = level >= 3 ? 4 : level >= 2 ? 3 : 2;
    const candidates = [];
    ATTRIBUTE_KEYS.forEach((key, index) => {
      const value = profile.values[key];
      const distance = Math.abs(value - 5.5);
      if (distance >= threshold) {
        candidates.push({
          key,
          text: value >= 6 ? OBSERVATIONS[key].high : OBSERVATIONS[key].low,
          strength: distance,
          tie: (profile.observationSeed + index * 7919) % 997,
        });
      }
    });
    candidates.sort((a,b) => b.strength - a.strength || a.tie - b.tie);
    const observations = candidates.slice(0, limit).map(item => item.text);
    const generic = [
      '目前没有单一行为特征持续主导外界评价。',
      '车队仍需要更多合作经历，才能形成更清晰的长期判断。',
    ];
    while (observations.length < Math.min(2, limit)) observations.push(generic[observations.length]);
    return {
      labelId: current.id,
      label: current.name,
      rarity: RARITY[current.id] || 'common',
      rarityLabel: RARITY_NAMES[RARITY[current.id] || 'common'],
      summary: current.summary,
      observations,
      commercialValue: commercialValue(profile),
      knowledge: level,
    };
  }

  function improveKnowledge(profile, amount) {
    profile.knowledge = clamp(profile.knowledge + (amount || 1), 1, 3);
    return publicProfile(profile);
  }

  function reaction(profile, eventId, random, context) {
    const v = profile.values;
    const ctx = context || {};
    let id;
    if (eventId === 'resource_overlooked' || eventId === 'team_orders') {
      const protest = v.ego * 1.15 + v.ambition * .65 - v.teamwork * .75 - v.loyalty * .35 - v.temperament * .25 + (ctx.repeated ? 2 : 0);
      if (protest >= 8.5 && random() < .55) id = 'public_discontent';
      else if (protest >= 4.2) id = 'private_concern';
      else id = v.teamwork >= 8 ? 'supportive' : 'accepts';
    } else if (eventId === 'low_investment') {
      const concern = v.ambition + v.ego * .45 - v.loyalty * .45 - v.temperament * .2;
      id = concern >= 6.5 ? (random() < .35 ? 'public_discontent' : 'private_concern') : 'accepts';
    } else if (eventId === 'losing_streak') {
      const recovery = v.resilience * 1.2 + v.professionalism * .45 + v.temperament * .35;
      id = recovery >= 12 ? 'motivated' : recovery <= 7 ? 'shaken' : 'accepts';
    } else if (eventId === 'media_criticism') {
      id = v.temperament >= 7 ? 'calm' : v.temperament <= 3 || v.ego >= 8 ? 'defensive' : 'accepts';
    } else if (eventId === 'rival_offer') {
      const interest = v.ambition * .8 + (10-v.loyalty) * .9 + v.ego * .25 + (ctx.rivalIsFaster ? 2 : 0);
      id = interest >= 11 ? 'interested' : v.loyalty >= 8 ? 'dismisses_offer' : 'accepts';
    } else if (eventId === 'mentoring') {
      id = v.teamwork >= 7 && v.ego <= 7 ? 'enthusiastic_mentor' : v.teamwork <= 3 || v.ego >= 9 ? 'reluctant_mentor' : 'accepts';
    } else if (eventId === 'first_win' || eventId === 'championship') {
      const growth = v.ego + v.ambition - v.teamwork * .35;
      id = growth >= 12 ? 'emboldened' : 'grounded';
    } else {
      id = 'accepts';
    }
    return { id, text: REACTION_TEXT[id], eventId };
  }

  function startNewSeason(profile) {
    profile.changedThisSeason = {};
    return profile;
  }

  function applyCareerEvent(profile, eventId, reactionId, random, options) {
    const settings = options || {};
    const candidates = careerCandidates(eventId, reactionId);
    const beforeLabel = resolveLabel(profile.values).id;
    const maxChanges = settings.major ? 2 : 1;
    const changes = [];
    for (const candidate of candidates) {
      if (changes.length >= maxChanges) break;
      if (profile.changedThisSeason[candidate.key]) continue;
      if (random() > candidate.probability) continue;
      const oldValue = profile.values[candidate.key];
      const amount = settings.major ? candidate.amount * 2 : candidate.amount;
      const newValue = clamp(oldValue + amount, 1, 10);
      if (newValue === oldValue) continue;
      profile.values[candidate.key] = newValue;
      profile.changedThisSeason[candidate.key] = true;
      const change = { key: candidate.key, attribute: ATTRIBUTE_META[candidate.key].name, from: oldValue, to: newValue, eventId };
      profile.changeHistory.push(change);
      changes.push(change);
    }
    const afterLabel = resolveLabel(profile.values).id;
    profile.currentLabel = afterLabel;
    return { changes, labelBefore: beforeLabel, labelAfter: afterLabel, labelChanged: beforeLabel !== afterLabel };
  }

  function careerCandidates(eventId, reactionId) {
    if (eventId === 'first_win') return [{key:'ambition',amount:1,probability:.45},{key:'ego',amount:1,probability:.28}];
    if (eventId === 'championship') return [{key:'ego',amount:1,probability:.65},{key:'ambition',amount:1,probability:.48}];
    if (eventId === 'setback_recovery' || (eventId === 'losing_streak' && reactionId === 'motivated')) return [{key:'resilience',amount:1,probability:.55}];
    if (eventId === 'resource_overlooked') return [{key:'loyalty',amount:-1,probability:reactionId === 'public_discontent' ? .62 : .28},{key:'ego',amount:1,probability:.20}];
    if (eventId === 'team_orders') return [{key:'teamwork',amount:reactionId === 'supportive'?1:-1,probability:.30}];
    if (eventId === 'mentoring') return [{key:'teamwork',amount:1,probability:reactionId === 'enthusiastic_mentor' ? .52 : .18}];
    if (eventId === 'media_criticism') return [{key:'temperament',amount:reactionId === 'calm'?1:-1,probability:.24}];
    if (eventId === 'low_investment') return [{key:'loyalty',amount:-1,probability:reactionId === 'public_discontent' ? .50 : .16}];
    if (eventId === 'development_support') return [{key:'loyalty',amount:1,probability:.30},{key:'professionalism',amount:1,probability:.14}];
    return [];
  }

  function decisionFlagToStoryEvent(flag) {
    const id = String(flag || '').split(':')[0];
    return {
      team_role: 'resource_overlooked',
      driver_feedback: 'team_orders',
      young_driver_run: 'mentoring',
      extra_simulator: 'development_support',
      difficult_weekend: 'losing_streak',
    }[id] || null;
  }

  const api = {
    ATTRIBUTE_KEYS,
    ATTRIBUTE_META,
    RARITY,
    DRIVER_PRESET_VERSION,
    DRIVER_PRESET_NAMES:Object.freeze(Object.keys(DRIVER_PRESETS)),
    LABELS: LABELS.map(({when, priority, ...item}) => item),
    newPersonality,
    applyDriverPreset,
    migrateProfile,
    commercialValue,
    teamCommercialPackage,
    resolveLabel,
    publicProfile,
    improveKnowledge,
    reaction,
    startNewSeason,
    applyCareerEvent,
    decisionFlagToStoryEvent,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.F1PersonalityEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
