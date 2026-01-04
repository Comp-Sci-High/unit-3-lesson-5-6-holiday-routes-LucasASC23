const words = [
  {
    word: 'obstreperous',
    correct: 'Noisy and difficult to control',
    wrong: ['Having few words; terse', 'Causing doubt or uncertainty', 'Able to be handled easily']
  },
  {
    word: 'mellifluous',
    correct: 'Sweet or musical; pleasant to hear',
    wrong: ['Extremely harsh sounding', 'Relating to honey production', 'Tending to break into parts']
  },
  {
    word: 'perspicacious',
    correct: 'Having keen mental perception and understanding',
    wrong: ['Slow to perceive or understand', 'Marked by excessive pride', 'Full of small holes']
  },
  {
    word: 'laconic',
    correct: 'Using very few words',
    wrong: ['Full of elaborate detail', 'Very talkative', 'Carefully measured pronunciation']
  },
  {
    word: 'pellucid',
    correct: 'Transparently clear in style or meaning',
    wrong: ['Extremely heavy', 'Rough or uneven texture', 'Tending to cause sleep']
  }
];

let qIndex = 0;
let score = 0;
let total = words.length;

const wordEl = document.getElementById('word');
const optionsEl = document.getElementById('options');
const qIndexEl = document.getElementById('qIndex');
const qTotalEl = document.getElementById('qTotal');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const landingEl = document.getElementById('landing');
const gamePanel = document.getElementById('game');
const pageBanner = document.querySelector('.page-banner');

function shuffle(arr){
  for(let i = arr.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startGame(){
  qIndex = 0;
  score = 0;
  shuffle(words);
  qTotalEl.textContent = total;
  scoreEl.textContent = score;
  showQuestion();
}

function showQuestion(){
  clearOptions();
  const current = words[qIndex];
  qIndexEl.textContent = qIndex+1;
  wordEl.textContent = current.word;

  const choices = [current.correct, ...current.wrong.slice()];
  shuffle(choices);

  choices.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.type = 'button';
    btn.textContent = text;
    btn.setAttribute('role','listitem');
    btn.addEventListener('click', () => selectOption(btn, current.correct));
    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = true;
}

function clearOptions(){
  optionsEl.innerHTML = '';
}

function selectOption(btn, correctText){
  // disable other buttons
  const all = Array.from(optionsEl.children);
  all.forEach(b => b.classList.add('disabled'));

  if(btn.textContent === correctText){
    btn.classList.add('correct');
    score += 1;
    scoreEl.textContent = score;
  } else {
    btn.classList.add('incorrect');
    // highlight correct one
    const correctBtn = all.find(b => b.textContent === correctText);
    if(correctBtn) correctBtn.classList.add('correct');
  }

  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', ()=>{
  qIndex += 1;
  if(qIndex >= total){
    showResults();
  } else {
    showQuestion();
    window.scrollTo({top:0,behavior:'smooth'});
  }
});

restartBtn.addEventListener('click', ()=>{
  startGame();
});

function showResults(){
  clearOptions();
  wordEl.textContent = 'Results';
  const msg = document.createElement('p');
  msg.textContent = `You scored ${score} out of ${total}.`;
  msg.style.marginTop = '8px';
  msg.style.color = 'var(--muted)';
  optionsEl.appendChild(msg);

  const tips = document.createElement('p');
  tips.textContent = 'Tip: revisit words you missed to grow your garden.';
  tips.style.marginTop = '6px';
  tips.style.fontSize = '13px';
  tips.style.color = 'var(--muted)';
  optionsEl.appendChild(tips);

  nextBtn.disabled = true;
}

// initialize

// Start button: transition from landing to game
if(startBtn){
  startBtn.addEventListener('click', ()=>{
    landingEl.classList.add('hide');
    landingEl.setAttribute('aria-hidden','true');
    // allow CSS transition then reveal game
    setTimeout(()=>{
      landingEl.style.display = 'none';
      gamePanel.classList.remove('hidden');
      gamePanel.classList.add('fade-in');
      gamePanel.setAttribute('aria-hidden','false');
      startGame();
    },420);
  });
}

// create subtle random letter texture in background
const textureEl = document.getElementById('texture');
if(textureEl){
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  for(let i=0;i<18;i++){
    const s = document.createElement('span');
    s.textContent = letters[Math.floor(Math.random()*letters.length)];
    s.style.left = Math.random()*90 + '%';
    s.style.top = Math.random()*82 + '%';
    s.style.fontSize = (30 + Math.random()*80) + 'px';
    s.style.transform = `rotate(${(-40 + Math.random()*80).toFixed(2)}deg)`;
    textureEl.appendChild(s);
  }
}

// Wordle-style game
const goWordleBtn = document.getElementById('goWordleBtn');
const wordlePanel = document.getElementById('wordle');
const wordleGrid = document.getElementById('wordleGrid');
const wordleKeyboard = document.getElementById('wordleKeyboard');
const wordleRestart = document.getElementById('wordleRestart');
const toVocabBtn = document.getElementById('toVocab');

const WORDLE_WORDS = ['apple','grace','shine','crane','flute','grain','sound','blend','brain','charm','pride','savor','trace','glory','brave'];
let solution = '';
let wRow = 0, wCol = 0, wOver = false;

function chooseSolution(){
  solution = WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)].toUpperCase();
}

function initWordle(){
  wRow = 0; wCol = 0; wOver = false;
  wordleGrid.innerHTML = '';
  wordleKeyboard.innerHTML = '';
  chooseSolution();
  // build grid
  for(let r=0;r<6;r++){
    const row = document.createElement('div'); row.className = 'wordle-row';
    for(let c=0;c<5;c++){
      const cell = document.createElement('div'); cell.className = 'cell'; cell.dataset.row = r; cell.dataset.col = c;
      row.appendChild(cell);
    }
    wordleGrid.appendChild(row);
  }
  // keyboard
  const rows = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
  rows.forEach((r,i)=>{
    const kr = document.createElement('div'); kr.className = 'kb-row';
    if(i===2){
      const ent = document.createElement('button'); ent.className='kb-key'; ent.textContent='Enter'; ent.addEventListener('click',()=>handleKey('Enter'));
      kr.appendChild(ent);
    }
    for(const ch of r){
      const k = document.createElement('button'); k.className='kb-key'; k.textContent=ch; k.addEventListener('click',()=>handleKey(ch)); kr.appendChild(k);
    }
    if(i===2){
      const bk = document.createElement('button'); bk.className='kb-key'; bk.textContent='←'; bk.addEventListener('click',()=>handleKey('Backspace')); kr.appendChild(bk);
    }
    wordleKeyboard.appendChild(kr);
  });
  document.getElementById('wAttempts').textContent = wRow;
}

function handleKey(key){
  if(wOver) return;
  key = key.toString();
  if(key === 'Backspace'){
    if(wCol>0){
      wCol -=1;
      const cell = wordleGrid.children[wRow].children[wCol];
      cell.textContent = '';
      cell.classList.remove('filled');
    }
    return;
  }
  if(key === 'Enter'){
    if(wCol !== 5) return;
    // read guess
    let guess = '';
    for(let c=0;c<5;c++) guess += (wordleGrid.children[wRow].children[c].textContent || '');
    guess = guess.toUpperCase();
    if(guess.length!==5) return;
    evaluateGuess(guess);
    return;
  }
  if(/^[A-Z]$/.test(key) && wCol<5){
    const cell = wordleGrid.children[wRow].children[wCol];
    cell.textContent = key;
    cell.classList.add('filled');
    wCol +=1;
  }
}

function evaluateGuess(guess){
  const solArr = solution.split('');
  const res = Array(5).fill('absent');
  // first pass for correct
  for(let i=0;i<5;i++){
    if(guess[i] === solArr[i]){ res[i] = 'correct'; solArr[i] = null; }
  }
  // second pass for present
  for(let i=0;i<5;i++){
    if(res[i]==='correct') continue;
    const idx = solArr.indexOf(guess[i]);
    if(idx !== -1){ res[i] = 'present'; solArr[idx] = null; }
  }
  // apply to cells and keyboard
  for(let c=0;c<5;c++){
    const cell = wordleGrid.children[wRow].children[c];
    cell.classList.add(res[c]);
    // update keyboard key state
    const keyButtons = Array.from(document.querySelectorAll('.kb-key'));
    const kb = keyButtons.find(k=>k.textContent===guess[c]);
    if(kb){
      kb.classList.remove('used-absent','used-present','used-correct');
      if(res[c]==='correct') kb.classList.add('used-correct');
      else if(res[c]==='present') kb.classList.add('used-present');
      else kb.classList.add('used-absent');
    }
  }

  wRow +=1; wCol = 0; document.getElementById('wAttempts').textContent = wRow;
  if(guess === solution){
    wOver = true; alert(`Nice! You guessed ${solution}.`);
    return;
  }
  if(wRow >= 6){
    wOver = true; alert(`Out of attempts — the word was ${solution}.`);
  }
}

// global keyboard listener
window.addEventListener('keydown', (e)=>{
  if(wordlePanel && !wordlePanel.classList.contains('hidden')){
    if(e.key === 'Backspace' || e.key === 'Enter' || /^[a-zA-Z]$/.test(e.key)){
      handleKey(e.key === 'Backspace' ? 'Backspace' : e.key === 'Enter' ? 'Enter' : e.key.toUpperCase());
      e.preventDefault();
    }
  }
});

// Stats persistence for Wordle-style game
const STATS_KEY = 'wordleStats';
let wordleStats = {1:0,2:0,3:0,4:0,5:0,6:0,fail:0};

function loadStats(){
  try{
    const raw = localStorage.getItem(STATS_KEY);
    if(raw) wordleStats = Object.assign(wordleStats, JSON.parse(raw));
  }catch(e){}
}

function saveStats(){
  try{ localStorage.setItem(STATS_KEY, JSON.stringify(wordleStats)); }catch(e){}
}

function recordWordleResult(attempts){
  if(attempts>=1 && attempts<=6) wordleStats[attempts] = (wordleStats[attempts]||0) + 1;
  saveStats();
}

function recordWordleFail(){ wordleStats.fail = (wordleStats.fail||0) + 1; saveStats(); }

function renderWordleStats(){
  loadStats();
  const container = document.getElementById('wordleStats');
  if(!container) return;
  const total = Object.values(wordleStats).reduce((a,b)=>a+b,0) || 1;
  container.innerHTML = '';
  for(let i=1;i<=6;i++){
    const row = document.createElement('div'); row.className='stat-row';
    const label = document.createElement('div'); label.className='stat-label'; label.textContent = i;
    const bar = document.createElement('div'); bar.className='stat-bar';
    const fill = document.createElement('div'); fill.className='stat-fill';
    const pct = (wordleStats[i]||0)/total;
    fill.style.width = Math.max(6, Math.round(pct*100)) + '%';
    bar.appendChild(fill);
    const count = document.createElement('div'); count.className='stat-count'; count.textContent = wordleStats[i]||0;
    row.appendChild(label); row.appendChild(bar); row.appendChild(count);
    container.appendChild(row);
  }
  // failures
  const failRow = document.createElement('div'); failRow.className='stat-row';
  const failLabel = document.createElement('div'); failLabel.className='stat-label'; failLabel.textContent = 'X';
  const failBar = document.createElement('div'); failBar.className='stat-bar'; const failFill = document.createElement('div'); failFill.className='stat-fill';
  const fpct = (wordleStats.fail||0)/total; failFill.style.width = Math.max(6, Math.round(fpct*100)) + '%'; failFill.style.background='rgba(200,50,50,0.7)';
  failBar.appendChild(failFill);
  const failCount = document.createElement('div'); failCount.className='stat-count'; failCount.textContent = wordleStats.fail||0;
  failRow.appendChild(failLabel); failRow.appendChild(failBar); failRow.appendChild(failCount);
  container.appendChild(failRow);
}

// improve keyboard state upgrades (don't downgrade a key)
function updateKeyboardState(letter, state){
  const keyButtons = Array.from(document.querySelectorAll('.kb-key'));
  const kb = keyButtons.find(k=>k.textContent===letter);
  if(!kb) return;
  if(kb.classList.contains('used-correct')) return; // keep best state
  if(state === 'correct'){
    kb.classList.remove('used-present','used-absent'); kb.classList.add('used-correct');
  } else if(state === 'present'){
    if(!kb.classList.contains('used-present')){
      kb.classList.remove('used-absent'); kb.classList.add('used-present');
    }
  } else if(state === 'absent'){
    if(!kb.classList.contains('used-present') && !kb.classList.contains('used-correct')){
      kb.classList.add('used-absent');
    }
  }
}

// panel helpers
function hideAllPanels(){
  // hide landing and banner
  if(landingEl){ landingEl.style.display = 'none'; landingEl.classList.add('hide'); landingEl.setAttribute('aria-hidden','true'); }
  if(pageBanner){ pageBanner.style.display = 'none'; }
  if(gamePanel){ gamePanel.style.display = 'none'; gamePanel.classList.add('hidden'); gamePanel.setAttribute('aria-hidden','true'); }
  if(wordlePanel){ wordlePanel.style.display = 'none'; wordlePanel.classList.add('hidden'); wordlePanel.setAttribute('aria-hidden','true'); }
}

function showPanel(panelEl){
  hideAllPanels();
  panelEl.style.display = ''; panelEl.classList.remove('hidden'); panelEl.classList.add('fade-in'); panelEl.setAttribute('aria-hidden','false');
}

// wire up navigation buttons
if(goWordleBtn){
  goWordleBtn.addEventListener('click', ()=>{
    hideAllPanels();
    setTimeout(()=>{
      showPanel(wordlePanel);
      initWordle();
    },120);
  });
}

if(startBtn){
  startBtn.addEventListener('click', ()=>{
    hideAllPanels();
    setTimeout(()=>{
      showPanel(gamePanel);
      startGame();
    },120);
  });
}

const backHomeVocab = document.getElementById('backHomeVocab');
const backHomeWordle = document.getElementById('backHomeWordle');
if(backHomeVocab) backHomeVocab.addEventListener('click', ()=>{ hideAllPanels(); landingEl.style.display=''; landingEl.classList.remove('hide'); landingEl.setAttribute('aria-hidden','false'); });
if(backHomeWordle) backHomeWordle.addEventListener('click', ()=>{ hideAllPanels(); landingEl.style.display=''; landingEl.classList.remove('hide'); landingEl.setAttribute('aria-hidden','false'); });
// ensure banner shown when returning home
if(backHomeVocab) backHomeVocab.addEventListener('click', ()=>{ if(pageBanner) pageBanner.style.display=''; });
if(backHomeWordle) backHomeWordle.addEventListener('click', ()=>{ if(pageBanner) pageBanner.style.display=''; });

if(wordleRestart) wordleRestart.addEventListener('click', ()=> initWordle());
if(toVocabBtn) toVocabBtn.addEventListener('click', ()=>{ hideAllPanels(); showPanel(gamePanel); startGame(); });

// validate guess against our small allowed list
function isValidGuess(word){
  // Allow any 5-letter alphabetical word (client-side). This lets users enter any real word;
  // further server-side or API validation could be added later if desired.
  return /^[a-zA-Z]{5}$/.test(word);
}

// enhance evaluateGuess to use updateKeyboardState and stats
const originalEvaluate = evaluateGuess;
evaluateGuess = function(guess){
  if(!isValidGuess(guess)){
    alert('Guess not in word list. Try another 5-letter word.');
    return;
  }
  const solArr = solution.split('');
  const res = Array(5).fill('absent');
  for(let i=0;i<5;i++){
    if(guess[i] === solArr[i]){ res[i] = 'correct'; solArr[i] = null; }
  }
  for(let i=0;i<5;i++){
    if(res[i]==='correct') continue;
    const idx = solArr.indexOf(guess[i]);
    if(idx !== -1){ res[i] = 'present'; solArr[idx] = null; }
  }
  for(let c=0;c<5;c++){
    const cell = wordleGrid.children[wRow].children[c];
    cell.classList.add(res[c]);
    updateKeyboardState(guess[c], res[c]);
  }
  wRow +=1; wCol = 0; document.getElementById('wAttempts').textContent = wRow;
  if(guess === solution){
    wOver = true;
    recordWordleResult(wRow);
    renderWordleStats();
    setTimeout(()=>alert(`Nice! You guessed ${solution} in ${wRow} attempt${wRow>1?'s':''}.`),80);
    return;
  }
  if(wRow >= 6){
    wOver = true;
    recordWordleFail();
    renderWordleStats();
    setTimeout(()=>alert(`Out of attempts — the word was ${solution}.`),80);
  }
};

// initial stats render
loadStats(); renderWordleStats();
