(() => {
  'use strict';

  /* ---------------------------------------------------------
     维度定义
     参考量表：AAI / SAAS（容貌）、IUS-12（不确定性）、LSAS（社交）、
     TAI / MBI（学业工作）、FAS（经济）、SHAI（健康）、
     ASA-27（分离）、DAS（死亡）
     --------------------------------------------------------- */
  const DIMS = [
    { key: 'appearance',  name: '容貌焦虑',        short: '容貌',   ref: 'AAI · SAAS' },
    { key: 'uncertainty', name: '未来不确定性焦虑', short: '未来',   ref: 'IUS-12' },
    { key: 'social',      name: '社交焦虑',        short: '社交',   ref: 'LSAS' },
    { key: 'performance', name: '学业/工作焦虑',    short: '学业工作', ref: 'TAI · MBI' },
    { key: 'financial',   name: '经济焦虑',        short: '经济',   ref: 'FAS' },
    { key: 'health',      name: '健康焦虑',        short: '健康',   ref: 'SHAI' },
    { key: 'separation',  name: '分离焦虑',        short: '分离',   ref: 'ASA-27' },
    { key: 'death',       name: '死亡焦虑',        short: '死亡',   ref: 'DAS' }
  ];

  /* 5 点李克特：分值 0–4，左起「非常符合」到「非常不符合」 */
  const SCALE = [
    ['非常符合', 4],
    ['符合', 3],
    ['不确定', 2],
    ['不符合', 1],
    ['非常不符合', 0]
  ];

  /* 标准版：8 维度 × 6 题 = 48 题，每维 2 道反向题。
     题目按维度轮转排列，正反向题分散在六轮里。 */
  const QUESTIONS_SHORT = [
    { dim: 'appearance', text: '拍完照，我会先放大看自己哪里不好看。' },
    { dim: 'uncertainty', text: '计划突然改变时，我需要马上知道新的安排才能安心。' },
    { dim: 'social', text: '需要当众发言时，我基本能自然地讲完。', reverse: true },
    { dim: 'performance', text: '任务没做完的时候，我很难真正放松下来。' },
    { dim: 'financial', text: '我会反复查看账户余额。' },
    { dim: 'health', text: '体检报告上的小问题，我很快就能放下。', reverse: true },
    { dim: 'separation', text: '一个人待着的时候，我挺自在。', reverse: true },
    { dim: 'death', text: '深夜想到死亡这件事，我会难以入睡。' },

    { dim: 'appearance', text: '别人夸我好看的时候，我通常直接接受，不会多想。', reverse: true },
    { dim: 'uncertainty', text: '事情还没有定论的时候，我很难把注意力放到别处。' },
    { dim: 'social', text: '在人多的地方，我希望自己不要被注意到。' },
    { dim: 'performance', text: '我会用「还不够好」来推着自己继续做。' },
    { dim: 'financial', text: '花钱的时候我基本能按计划来，不太纠结。', reverse: true },
    { dim: 'health', text: '身体有一点不舒服，我就忍不住上网查。' },
    { dim: 'separation', text: '重要的人回消息变慢，我会想是不是自己哪里做错了。' },
    { dim: 'death', text: '谈论死亡对我来说不算困难。', reverse: true },

    { dim: 'appearance', text: '出门前觉得今天状态不好，我会想换掉整套衣服。' },
    { dim: 'uncertainty', text: '「到时候再说」这种状态，我可以接受。', reverse: true },
    { dim: 'social', text: '和不太熟的人相处，我常担心自己说错话。' },
    { dim: 'performance', text: '看到同龄人进展更快，我会怀疑自己已经落后。' },
    { dim: 'financial', text: '想到未来几年的收入，我觉得怎么算都不够。' },
    { dim: 'health', text: '我相信自己的身体基本上是健康的。', reverse: true },
    { dim: 'separation', text: '和亲近的人分开一段时间，我会明显不安。' },
    { dim: 'death', text: '看到意外或讣告的新闻，我会想很久。' },

    { dim: 'appearance', text: '我会因为担心外形，推掉一些需要露面的场合。' },
    { dim: 'uncertainty', text: '做决定之前，我会反复确认所有可能出问题的地方。' },
    { dim: 'social', text: '主动和不熟的人搭话，对我来说不算难事。', reverse: true },
    { dim: 'performance', text: '休息日我能把工作或学习完全放下。', reverse: true },
    { dim: 'financial', text: '因为钱的事，我会推掉一些朋友的邀约。' },
    { dim: 'health', text: '我会经常留意心跳、呼吸这类身体信号。' },
    { dim: 'separation', text: '我会频繁确认对方的状态，才觉得安心。' },
    { dim: 'death', text: '去医院或葬礼这样的场合，我会明显不舒服。' },

    { dim: 'appearance', text: '看到镜子里的自己，我大多数时候是满意的。', reverse: true },
    { dim: 'uncertainty', text: '即使未来不确定，我也能照常过日子。', reverse: true },
    { dim: 'social', text: '聊完天之后，我会反复回想自己刚才的表现。' },
    { dim: 'performance', text: '交出去的东西没有反馈，我会往坏处想。' },
    { dim: 'financial', text: '我对自己的财务状况是放心的。', reverse: true },
    { dim: 'health', text: '看到讲疾病的文章，我会对照自己的情况。' },
    { dim: 'separation', text: '想到有一天会和重要的人走散，我会心里发紧。' },
    { dim: 'death', text: '想到自己终将被遗忘，我会觉得一切没有意义。' },

    { dim: 'appearance', text: '合照里我的样子，会在我脑子里停留很久。' },
    { dim: 'uncertainty', text: '别人说「晚点告诉你」，我会一直惦记着这件事。' },
    { dim: 'social', text: '进入一个已经坐满人的房间，我会先找角落的位置。' },
    { dim: 'performance', text: '只要完成任务，我就能接受它不够完美。', reverse: true },
    { dim: 'financial', text: '突然多出一笔支出，我会慌一阵。' },
    { dim: 'health', text: '身体出现新的感觉，我会想是不是严重的问题。' },
    { dim: 'separation', text: '关系里出现的小冷淡，我很快就能过去。', reverse: true },
    { dim: 'death', text: '死亡是遥远的事，不太影响我的日常。', reverse: true }
  ];

  /* 完整版追加的 80 题（每维 10 题，其中 3 道反向），
     按 10 轮排布，每轮每个维度各一题。 */
  const QUESTIONS_EXTRA = [
    { dim: 'appearance', text: '看到别人好看，我不会拿来和自己比。', reverse: true },
    { dim: 'uncertainty', text: '我常为还没发生的事担心。' },
    { dim: 'social', text: '我能在聚会里放松下来。', reverse: true },
    { dim: 'performance', text: '我常觉得自己做得不够好。' },
    { dim: 'financial', text: '我会因为钱的事失眠。' },
    { dim: 'health', text: '我会担心自己得了没被发现的病。' },
    { dim: 'separation', text: '我害怕被重要的人丢下。' },
    { dim: 'death', text: '我不太去想死亡这件事。', reverse: true },

    { dim: 'appearance', text: '我在意别人怎么评价我的长相。' },
    { dim: 'uncertainty', text: '我能接受生活里有悬而未决的部分。', reverse: true },
    { dim: 'social', text: '我担心自己在别人眼里很无趣。' },
    { dim: 'performance', text: '任务开始前，我会拖到最后一刻。' },
    { dim: 'financial', text: '我对自己的消费是有掌控感的。', reverse: true },
    { dim: 'health', text: '身体不适时，我会先想到最坏的可能。' },
    { dim: 'separation', text: '对方情绪不好时，我会觉得是自己的问题。' },
    { dim: 'death', text: '我会突然想到自己会死。' },

    { dim: 'appearance', text: '我会花不少时间研究护肤、发型或穿搭。' },
    { dim: 'uncertainty', text: '没有明确计划时，我会不踏实。' },
    { dim: 'social', text: '和陌生人吃饭，我会紧张。' },
    { dim: 'performance', text: '我能接受自己偶尔效率低。', reverse: true },
    { dim: 'financial', text: '我担心自己存不下钱。' },
    { dim: 'health', text: '我对自己的身体状况基本放心。', reverse: true },
    { dim: 'separation', text: '我会因为对方没回复而反复看手机。' },
    { dim: 'death', text: '想到亲人会离开，我会难受很久。' },

    { dim: 'appearance', text: '发照片前，我会修图或挑很久。' },
    { dim: 'uncertainty', text: '我会反复设想最坏的结果。' },
    { dim: 'social', text: '我不太在意别人对我的看法。', reverse: true },
    { dim: 'performance', text: '我会在下班后继续想工作的事。' },
    { dim: 'financial', text: '看到同龄人买房买车，我会焦虑。' },
    { dim: 'health', text: '我不太会去想疾病的事。', reverse: true },
    { dim: 'separation', text: '分别之后，我需要很久才能平静。' },
    { dim: 'death', text: '我会回避和死亡有关的话题。' },

    { dim: 'appearance', text: '我能坦然接受自己现在的样子。', reverse: true },
    { dim: 'uncertainty', text: '我需要知道每一步会发生什么。' },
    { dim: 'social', text: '我常觉得别人在注意我的小失误。' },
    { dim: 'performance', text: '出错时，我会反复责怪自己。' },
    { dim: 'financial', text: '我会为未来的大额支出发愁。' },
    { dim: 'health', text: '我会反复摸或按压不舒服的地方。' },
    { dim: 'separation', text: '我能安心地一个人待着。', reverse: true },
    { dim: 'death', text: '我担心死后一切归于虚无。' },

    { dim: 'appearance', text: '被镜头对着的时候，我会不自在。' },
    { dim: 'uncertainty', text: '变化来的时候，我通常能很快适应。', reverse: true },
    { dim: 'social', text: '需要麻烦别人时，我会犹豫很久。' },
    { dim: 'performance', text: '我对自己的表现大体满意。', reverse: true },
    { dim: 'financial', text: '谈钱让我不舒服。' },
    { dim: 'health', text: '看到别人生病，我会担心自己也会。' },
    { dim: 'separation', text: '我担心关系会突然结束。' },
    { dim: 'death', text: '我能平静地谈论生命的有限。', reverse: true },

    { dim: 'appearance', text: '我会因为某个身体部位反复照镜子。' },
    { dim: 'uncertainty', text: '不确定的时候，我会不停地找人确认。' },
    { dim: 'social', text: '我害怕在电话里和不熟的人说话。' },
    { dim: 'performance', text: '我担心自己随时会被替代。' },
    { dim: 'financial', text: '我不太担心突然失业或断收入。', reverse: true },
    { dim: 'health', text: '我相信身体能自己恢复。', reverse: true },
    { dim: 'separation', text: '我会努力让对方离不开我。' },
    { dim: 'death', text: '看到老人的样子，我会想到自己。' },

    { dim: 'appearance', text: '外形对我来说，不决定我一天的心情。', reverse: true },
    { dim: 'uncertainty', text: '我会因为「还不知道结果」而睡不好。' },
    { dim: 'social', text: '我参加社交活动后常觉得累。' },
    { dim: 'performance', text: '我会为了不出错而反复检查。' },
    { dim: 'financial', text: '我会比较价格很久才决定。' },
    { dim: 'health', text: '我会因为身体的小变化改变计划。' },
    { dim: 'separation', text: '我很少担心亲近的人会离开。', reverse: true },
    { dim: 'death', text: '死亡对我来说不是禁忌。', reverse: true },

    { dim: 'appearance', text: '别人对我的外形开玩笑，我会记很久。' },
    { dim: 'uncertainty', text: '我对未来的大致方向是有信心的。', reverse: true },
    { dim: 'social', text: '我担心自己接不上别人的话。' },
    { dim: 'performance', text: '工作和生活之间，我能划清界线。', reverse: true },
    { dim: 'financial', text: '我常觉得钱不够用。' },
    { dim: 'health', text: '体检前我会明显紧张。' },
    { dim: 'separation', text: '独处时，我会觉得空。' },
    { dim: 'death', text: '我会因为想到死亡而失眠。' },

    { dim: 'appearance', text: '我担心自己看起来比实际年龄老。' },
    { dim: 'uncertainty', text: '计划外的事会让我一整天心神不宁。' },
    { dim: 'social', text: '在人群中我能做自己。', reverse: true },
    { dim: 'performance', text: '竞争让我喘不过气。' },
    { dim: 'financial', text: '我的经济状况在我的预期之内。', reverse: true },
    { dim: 'health', text: '我会向不同的人反复确认同一个症状。' },
    { dim: 'separation', text: '我相信关系是稳固的。', reverse: true },
    { dim: 'death', text: '我害怕来不及做完想做的事。' }
  ];

  const QUESTIONS_LONG = [...QUESTIONS_SHORT, ...QUESTIONS_EXTRA];
  const BANKS = { short: QUESTIONS_SHORT, long: QUESTIONS_LONG };
  const MODES = {
    short: { label: '标准版', minutes: 6 },
    long: { label: '完整版', minutes: 15 }
  };

  const DIM_INDEX = Object.fromEntries(DIMS.map((d, i) => [d.key, i]));
  const BANDS = ['舒缓', '起伏', '紧绷'];
  const BAND_VARS = ['var(--lv-0)', 'var(--lv-1)', 'var(--lv-2)'];

  /* 每个维度三档解读 */
  const DIM_TEXT = {
    appearance: [
      '你对「看起来怎么样」大体是够用就好的态度，镜子不太占用你的时间。这种松弛很难得。',
      '你会在意别人眼里的自己，偶尔为此多花一点时间，多数时候仍在可控范围。',
      '外形在你心里占的分量偏重，拍照、出门、被注视都可能带来明显压力。你看到的自己，往往比旁人看到的苛刻得多。'
    ],
    uncertainty: [
      '你能和「还不知道」共处，计划变了也能重新安排。这种对模糊的耐受度是很厚的缓冲。',
      '不确定会让你多想一会儿，需要一点确认才能安心，但通常不影响你继续做事。',
      '「悬着」的状态对你消耗很大，你会反复确认、反复预演。想提前拿到确定感，是大脑在保护你，不是你不坚强。'
    ],
    social: [
      '和人相处对你来说比较自然，沉默和被拒绝不会让你过度不安。',
      '你会在意别人的反应，事后偶尔复盘几句对话，但还能正常来往。',
      '被看见、被评价的场合会让你明显紧张，你可能因此回避一些本来可以参加的事。回避带来短暂的轻松，也让下一次更难。'
    ],
    performance: [
      '你能把「任务」和「我这个人行不行」分开看，休息时也真的休息得下去。',
      '截止日期和比较会推着你往前，偶尔侵占休息时间，但还在你能调节的范围内。',
      '学业或工作的压力已经渗进休息和睡眠，你可能习惯用「还不够好」来驱动自己。长期如此，效率反而会掉。'
    ],
    financial: [
      '钱是你生活的一部分，而不是悬在头顶的东西，你能比较平静地做取舍。',
      '你会算账、会对一些花销犹豫，但基本能按计划生活。',
      '经济的不安全感占了不少注意力，可能让你回避社交或反复查看余额。它常常和「我能不能照顾好自己」绑在一起。'
    ],
    health: [
      '你对身体信号的关注是适度的：不舒服会处理，而不是反复搜索。',
      '你会留意身体变化，偶尔上网查一查，通常能回到日常。',
      '你会反复扫描身体、反复查资料，越查越不安。搜索给的确定感很短，焦虑很快会被下一条信息重新点燃。'
    ],
    separation: [
      '你能在关系里保持自己的节奏，短暂的分开不会动摇安全感。',
      '你在意重要的人，对方冷淡或离开时会不安，但能自我安抚。',
      '分离的预感会带来强烈不安，你可能频繁确认对方的状态。这常和「我会不会被丢下」的早期经验有关。'
    ],
    death: [
      '你能接受有限性这件事，它不太干扰你的日常。',
      '偶尔想到终点会有些沉重，但很快能回到生活里。',
      '关于死亡的想法会反复出现并带来明显恐惧，甚至影响睡眠。这类恐惧常在夜深、独处或生活变动时被放大。'
    ]
  };

  const DIM_TIP = {
    appearance: '记录一周里「我因为外形想回避」的次数，只记录、不评判；再对比别人对你的评价和你对自己的评价差了多少。',
    uncertainty: '把担心分两栏写：「我能控制的 / 我不能控制的」，只对左栏做一件小事；给「等消息」设一个固定查看时间。',
    social: '从一次低风险的互动开始，比如在群里回一句话。把目标从「被认可」改成「完成一次交流」。',
    performance: '给工作设一个明确的结束时间；把「必须做好」换成「先交出一个能用的版本」。',
    financial: '做一张三个月的现金流表，把模糊的恐惧变成具体数字。数字通常比想象温和。',
    health: '给「查症状」设上限，比如每天一次、五分钟；持续不适请就医，而不是搜索。',
    separation: '分开前和对方约定一个联系节奏，把「随时确认」换成「固定报平安」；练习独处时完整地做完一件小事。',
    death: '把恐惧写下来，或和家人认真聊一次。如果它反复打断生活，找专业人士谈比独自消化有效。'
  };

  const root = document.querySelector('[data-anxiety]');
  if (!root) return;

  const screens = {
    intro: root.querySelector('[data-screen="intro"]'),
    quiz: root.querySelector('[data-screen="quiz"]'),
    result: root.querySelector('[data-screen="result"]')
  };
  const startBtn = root.querySelector('[data-start]');
  const draftNote = root.querySelector('[data-draft-note]');
  const versionBox = root.querySelector('[data-versions]');
  const versionButtons = versionBox ? [...versionBox.querySelectorAll('[data-mode]')] : [];
  const qnum = root.querySelector('[data-qnum]');
  const qtotal = root.querySelector('[data-qtotal]');
  const qtext = root.querySelector('[data-question]');
  const optionsBox = root.querySelector('[data-options]');
  const progressBar = root.querySelector('[data-progress]');
  const progressWrap = root.querySelector('.quiz__progress');
  const prevBtn = root.querySelector('[data-prev]');
  const overallEl = root.querySelector('[data-overall]');
  const bandEl = root.querySelector('[data-band]');
  const peaksEl = root.querySelector('[data-peaks]');
  const summaryEl = root.querySelector('[data-summary]');
  const modeLabel = root.querySelector('[data-mode-label]');
  const radarBox = root.querySelector('[data-radar]');
  const dimsBox = root.querySelector('[data-dims]');
  const readingBox = root.querySelector('[data-reading]');
  const copyBtn = root.querySelector('[data-copy]');
  const copyStatus = root.querySelector('[data-copy-status]');
  const restartBtn = root.querySelector('[data-restart]');

  const DRAFT_KEY = 'gertvy:anxiety:draft:v3';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mode = 'short';
  let questions = BANKS[mode];
  let total = questions.length;
  let answers = new Array(total).fill(null);
  let index = 0;
  let advancing = null;

  /* ---------------- 版本 ---------------- */
  function setMode(next, reset) {
    if (!BANKS[next]) return;
    mode = next;
    questions = BANKS[next];
    total = questions.length;

    if (qtotal) qtotal.textContent = String(total);
    progressWrap.setAttribute('aria-valuemax', String(total));

    versionButtons.forEach((btn) => {
      const on = btn.dataset.mode === next;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-checked', String(on));
    });

    if (reset) {
      answers = new Array(total).fill(null);
      index = 0;
      clearDraft();
      startBtn.textContent = '开始作答';
      draftNote.textContent = `${MODES[next].minutes} 分钟 · ${total} 题 · 本地计算`;
    }
  }

  /* ---------------- 草稿 ---------------- */
  function saveDraft() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ mode, answers, index }));
    } catch { /* 忽略存储失败 */ }
  }

  function readDraft() {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !BANKS[data.mode] || !Array.isArray(data.answers)) return null;
      if (data.answers.length !== BANKS[data.mode].length) return null;
      const valid = data.answers.every((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 4));
      if (!valid) return null;
      return data;
    } catch { return null; }
  }

  function clearDraft() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* 忽略 */ }
  }

  /* ---------------- 屏幕切换 ---------------- */
  function show(name) {
    Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
  }

  function answeredCount() {
    return answers.filter((v) => v !== null).length;
  }

  /* ---------------- 作答 ---------------- */
  function renderQuestion() {
    const q = questions[index];

    qnum.textContent = String(index + 1);
    qtext.textContent = q.text;

    const fragment = document.createDocumentFragment();
    SCALE.forEach(([label, value], i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scale__item';
      btn.setAttribute('role', 'radio');
      btn.dataset.value = String(value);
      btn.setAttribute('aria-checked', String(answers[index] === value));

      const dot = document.createElement('span');
      dot.className = 'scale__dot';
      dot.setAttribute('aria-hidden', 'true');
      dot.textContent = String(i + 1);

      const text = document.createElement('span');
      text.className = 'scale__label';
      text.textContent = label;

      btn.append(dot, text);
      if (answers[index] === value) btn.classList.add('is-selected');
      fragment.append(btn);
    });
    optionsBox.replaceChildren(fragment);

    const done = index + 1;
    progressBar.style.width = `${(done / total) * 100}%`;
    progressWrap.setAttribute('aria-valuenow', String(done));
    prevBtn.disabled = index === 0;

    qtext.focus({ preventScroll: true });
  }

  function select(value) {
    answers[index] = value;
    saveDraft();

    optionsBox.querySelectorAll('.scale__item').forEach((btn) => {
      const on = Number(btn.dataset.value) === value;
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-checked', String(on));
    });

    if (advancing) clearTimeout(advancing);
    advancing = setTimeout(() => {
      advancing = null;
      if (index < total - 1) {
        index += 1;
        saveDraft();
        renderQuestion();
      } else if (answers.every((v) => v !== null)) {
        renderResult();
      }
    }, reduceMotion ? 60 : 190);
  }

  function go(delta) {
    if (advancing) { clearTimeout(advancing); advancing = null; }
    const next = index + delta;
    if (next < 0 || next >= total) return;
    index = next;
    saveDraft();
    renderQuestion();
  }

  /* ---------------- 计分 ---------------- */
  function score() {
    const sums = DIMS.map(() => 0);
    questions.forEach((q, i) => {
      const raw = answers[i] ?? 2;
      sums[DIM_INDEX[q.dim]] += q.reverse ? 4 - raw : raw;
    });
    const maxPerDim = (total / DIMS.length) * 4;
    const pct = sums.map((s) => Math.round((s / maxPerDim) * 100));
    const overall = Math.round(pct.reduce((a, b) => a + b, 0) / DIMS.length);
    return { sums, pct, overall };
  }

  function bandOf(value) {
    return value <= 33 ? 0 : value <= 66 ? 1 : 2;
  }

  /* ---------------- 蛛网图 ---------------- */
  function radarGeom() {
    const compact = radarBox.clientWidth > 0 && radarBox.clientWidth < 460;
    return compact
      ? { W: 380, H: 384, cx: 190, cy: 186, R: 116, gap: 24, name: 12, val: 10 }
      : { W: 640, H: 600, cx: 320, cy: 296, R: 172, gap: 27, name: 14, val: 11 };
  }

  function renderRadar(pct, animate = true) {
    const { W, H, cx, cy, R, gap, name: nameSize, val: valSize } = radarGeom();
    const n = DIMS.length;
    const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const point = (i, r) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];
    const ring = (r) => DIMS.map((_, i) => point(i, r).map((v) => v.toFixed(1)).join(',')).join(' ');

    const parts = [];
    parts.push(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="八维度焦虑蛛网图：${DIMS.map((d, i) => `${d.name}${pct[i]}`).join('，')}">`);
    parts.push('<defs>'
      + '<radialGradient id="radarBg" cx="50%" cy="48%" r="58%">'
      + '<stop offset="0%" stop-color="rgba(74,142,212,.20)"/>'
      + '<stop offset="100%" stop-color="rgba(74,142,212,0)"/>'
      + '</radialGradient>'
      + '<linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0%" stop-color="rgba(169,188,255,.45)"/>'
      + '<stop offset="100%" stop-color="rgba(74,142,212,.14)"/>'
      + '</linearGradient>'
      + '</defs>');
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${(R * 1.14).toFixed(1)}" fill="url(#radarBg)"/>`);

    [0.25, 0.5, 0.75, 1].forEach((k) => {
      const dash = k === 0.5 ? ' stroke-dasharray="3 6"' : '';
      const alpha = k === 0.5 ? 0.24 : 0.13;
      parts.push(`<polygon points="${ring(R * k)}" fill="none" stroke="rgba(74,142,212,${alpha})" stroke-width="1"${dash}/>`);
    });

    for (let i = 0; i < n; i += 1) {
      const [x, y] = point(i, R);
      parts.push(`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(74,142,212,.12)" stroke-width="1"/>`);
    }

    parts.push('<g data-shape>');
    parts.push(`<polygon data-poly points="${ring(1)}" fill="url(#radarFill)" stroke="#a9bcff" stroke-width="2" stroke-linejoin="round"/>`);
    DIMS.forEach((d, i) => {
      const [x, y] = point(i, R);
      const color = BAND_VARS[bandOf(pct[i])];
      parts.push(`<circle data-dot cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${color}" stroke="#071224" stroke-width="2"><title>${d.name} ${pct[i]}</title></circle>`);
    });
    parts.push('</g>');

    const labelR = R + gap;
    DIMS.forEach((d, i) => {
      const a = angle(i);
      const cos = Math.cos(a);
      const [x, y] = point(i, labelR);
      const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
      const dy = Math.sin(a) > 0.5 ? nameSize * 0.85 : Math.sin(a) < -0.5 ? -nameSize * 0.4 : 0;
      const fill = BAND_VARS[bandOf(pct[i])];
      parts.push(`<text x="${x.toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}" fill="#dde4f2" font-size="${nameSize}" font-weight="600" font-family="PingFang SC, Helvetica Neue, sans-serif">${d.short}</text>`);
      parts.push(`<text x="${x.toFixed(1)}" y="${(y + dy + nameSize + 2).toFixed(1)}" text-anchor="${anchor}" fill="${fill}" font-size="${valSize}" font-weight="700" font-family="PingFang SC, Helvetica Neue, sans-serif">${pct[i]}</text>`);
    });

    parts.push('</svg>');
    radarBox.innerHTML = parts.join('');

    const svg = radarBox.querySelector('svg');
    const poly = svg.querySelector('[data-poly]');
    const dots = [...svg.querySelectorAll('[data-dot]')];
    const target = pct.map((v) => (v / 100) * R);

    const drawAt = (e) => {
      poly.setAttribute('points', DIMS.map((_, i) => point(i, Math.max(target[i] * e, 0.01)).map((v) => v.toFixed(1)).join(',')).join(' '));
      dots.forEach((dot, i) => {
        const [x, y] = point(i, target[i] * e);
        dot.setAttribute('cx', x.toFixed(1));
        dot.setAttribute('cy', y.toFixed(1));
      });
    };

    if (reduceMotion || !animate) {
      drawAt(1);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 700);
      drawAt(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- 结果 ---------------- */
  function renderDims(pct) {
    const fragment = document.createDocumentFragment();
    DIMS.forEach((d, i) => {
      const band = bandOf(pct[i]);
      const row = document.createElement('div');
      row.className = 'dim-row';
      row.style.setProperty('--c', BAND_VARS[band]);

      const name = document.createElement('span');
      name.className = 'dim-row__name';
      name.textContent = d.name;

      const track = document.createElement('span');
      track.className = 'dim-row__track';
      const fill = document.createElement('span');
      fill.className = 'dim-row__fill';
      track.append(fill);

      const val = document.createElement('span');
      val.className = 'dim-row__score';
      val.textContent = String(pct[i]);
      val.setAttribute('aria-label', `${pct[i]} 分，${BANDS[band]}`);

      const text = document.createElement('p');
      text.className = 'dim-row__text';
      text.textContent = DIM_TEXT[d.key][band];

      row.append(name, track, val, text);
      fragment.append(row);

      requestAnimationFrame(() => {
        fill.style.width = `${pct[i]}%`;
      });
    });
    dimsBox.replaceChildren(fragment);
  }

  function overallSummary(pct, overall) {
    const ranked = DIMS.map((d, i) => ({ dim: d, pct: pct[i] })).sort((a, b) => b.pct - a.pct);
    const top = ranked[0];
    const second = ranked[1];
    const band = bandOf(overall);

    if (band === 0) {
      return `总体指数 ${overall}，落在「舒缓」区间。八个方向大多平缓，说明你现在有不错的缓冲：压力出现时，通常能自己消化掉。相对高一点的是${top.dim.name}（${top.pct}），不影响整体，顺手照顾一下就好。`;
    }
    if (band === 1) {
      return `总体指数 ${overall}，落在「起伏」区间，这也是大多数人的位置。你能应付日常，但有些方向已经在持续消耗你：${top.dim.name}（${top.pct}）和${second.dim.name}（${second.pct}）最明显。它们不是「毛病」，更像提醒你哪里需要多一点余地。`;
    }
    return `总体指数 ${overall}，落在「紧绷」区间。八个方向的平均分偏高，意味着焦虑可能已经在影响睡眠、注意力或人际关系。其中${top.dim.name}（${top.pct}）和${second.dim.name}（${second.pct}）最突出。这种状态下，「再撑一撑」往往不是好办法，先把负担减下来更重要。`;
  }

  function renderTips(pct) {
    const ranked = DIMS.map((d, i) => ({ dim: d, pct: pct[i] })).sort((a, b) => b.pct - a.pct);
    const low = ranked[ranked.length - 1];
    const tips = ranked.filter((item) => item.pct >= 50).slice(0, 3);

    const fragment = document.createDocumentFragment();
    const tipBlock = document.createElement('div');
    tipBlock.className = 'reading__block';
    const tipTitle = document.createElement('h3');
    tipTitle.textContent = tips.length ? '可以先做的几件小事' : '保持现在的节奏';
    const list = document.createElement('ul');
    list.className = 'reading__list';

    const items = tips.length ? tips : [{ dim: DIMS[0], pct: 0, generic: true }];
    items.forEach((item) => {
      const li = document.createElement('li');
      const label = document.createElement('b');
      label.textContent = item.generic ? '维持' : item.dim.short;
      const desc = document.createElement('p');
      desc.textContent = item.generic
        ? '规律睡眠、每周留出几段真正不被打断的休息、把担心写下来而不是反复想。你现在做得不错，继续保持。'
        : DIM_TIP[item.dim.key];
      li.append(label, desc);
      list.append(li);
    });

    const foot = document.createElement('p');
    foot.className = 'reading__foot';
    foot.textContent = `最稳的方向是${low.dim.name}（${low.pct}）——可以把它当成恢复的起点：状态差的时候，先回到这里。`;

    tipBlock.append(tipTitle, list, foot);
    fragment.append(tipBlock);
    readingBox.replaceChildren(fragment);
  }

  function resultText(pct, overall) {
    const lines = [
      `焦虑地形图 · ${MODES[mode].label}（${total} 题） · ${new Date().toLocaleDateString('zh-CN')}`,
      `总体指数 ${overall}/100（${BANDS[bandOf(overall)]}）`,
      '',
      ...DIMS.map((d, i) => `${d.name}：${pct[i]}（${BANDS[bandOf(pct[i])]}）`)
    ];
    return lines.join('\n');
  }

  let lastScore = null;

  function renderResult() {
    const { pct, overall } = score();
    lastScore = { pct, overall };
    show('result');
    overallEl.textContent = String(overall);
    bandEl.textContent = BANDS[bandOf(overall)];
    bandEl.style.color = BAND_VARS[bandOf(overall)];
    if (modeLabel) modeLabel.textContent = `${MODES[mode].label} · ${total} 题`;

    const ranked = DIMS.map((d, i) => ({ d, p: pct[i] })).sort((a, b) => b.p - a.p);
    const spread = ranked[0].p - ranked[ranked.length - 1].p;
    peaksEl.textContent = spread <= 3
      ? '八个方向的分数基本持平'
      : `最高：${ranked[0].d.name} ${ranked[0].p} · 最低：${ranked[ranked.length - 1].d.name} ${ranked[ranked.length - 1].p}`;

    renderRadar(pct);
    renderDims(pct);
    summaryEl.textContent = overallSummary(pct, overall);
    renderTips(pct);
    clearDraft();
    copyStatus.textContent = '';

    const top = root.querySelector('.result__top');
    top.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (screens.result.hidden || !lastScore) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (lastScore) renderRadar(lastScore.pct, false);
    }, 180);
  });

  /* ---------------- 事件 ---------------- */
  versionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode === mode) return;
      setMode(btn.dataset.mode, true);
    });
  });

  startBtn.addEventListener('click', () => {
    show('quiz');
    index = Math.min(index, total - 1);
    renderQuestion();
  });

  optionsBox.addEventListener('click', (event) => {
    const btn = event.target.closest('.scale__item');
    if (!btn) return;
    select(Number(btn.dataset.value));
  });

  prevBtn.addEventListener('click', () => go(-1));

  document.addEventListener('keydown', (event) => {
    if (screens.quiz.hidden) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return;

    if (/^[1-5]$/.test(event.key)) {
      const btn = optionsBox.children[Number(event.key) - 1];
      if (btn) {
        event.preventDefault();
        select(Number(btn.dataset.value));
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!lastScore) return;
    const text = resultText(lastScore.pct, lastScore.overall);
    try {
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = '已复制结果。';
    } catch {
      copyStatus.textContent = '无法自动复制，请手动选择文字。';
    }
  });

  restartBtn.addEventListener('click', () => {
    answers = new Array(total).fill(null);
    index = 0;
    lastScore = null;
    clearDraft();
    show('intro');
    startBtn.textContent = '开始作答';
    draftNote.textContent = `${MODES[mode].minutes} 分钟 · ${total} 题 · 本地计算`;
    root.querySelector('.anxiety-intro').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------------- 初始化 ---------------- */
  const draft = readDraft();
  if (draft) {
    setMode(draft.mode, false);
    answers = draft.answers;
    index = Math.min(Math.max(0, Number(draft.index) || 0), total - 1);
    const done = answeredCount();
    if (done > 0) {
      startBtn.textContent = '继续上次作答';
      draftNote.textContent = `上次答到第 ${index + 1} 题（已完成 ${done}/${total}），草稿只存在本机。`;
    }
  } else {
    setMode('short', false);
  }

  show('intro');
})();
