document.addEventListener('DOMContentLoaded', function() {
const swiper = new Swiper('.swiper', {
  loop: true,
  speed: 600,
  effect: 'slide',
  autoplay: { delay: 5000 },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    slideChangeTransitionEnd: function () {
      this.slides.forEach(slide => (slide.style.opacity = ''));
    },
  },
});
});

function options(){
  document.getElementById("optionmenue").style.display = "flex";
}
function optionend(){
  document.getElementById("optionmenue").style.display = "none";
}

function showNumber1() {
  const outEl = document.getElementById('output1');
  const numInput = document.getElementById('number1');
  let val = 0;
  if(numInput && numInput.value !== undefined){
    val = Number(numInput.value) || 0;
  } else if(window.waitingState){
    val = (window.waitingState.items || []).filter(it=>it.type==='slime').length;
  } else if(outEl){
    val = Number((outEl.textContent || '').replace(/[^0-9]/g, '')) || 0;
  }
  if(outEl) outEl.textContent = val + '人';
  if(!outEl) return;
  if(val >= 10){
    outEl.style.backgroundColor = "rgba(222, 34, 1, 0.76)";
  }else if(val >= 5){
    outEl.style.backgroundColor = "rgba(222, 134, 1, 0.76)";
  }else{
    outEl.style.backgroundColor = "rgba(126, 222, 1, 0.76)";
  }
}
function showNumber2() {
  const outEl = document.getElementById('output2');
  const numInput = document.getElementById('number2');
  let val = 0;
  if(numInput && numInput.value !== undefined){
    val = Number(numInput.value) || 0;
  } else if(window.waitingState){
    val = (window.waitingState.items || []).filter(it=>it.type==='bathbomb').length;
  } else if(outEl){
    val = Number((outEl.textContent || '').replace(/[^0-9]/g, '')) || 0;
  }
  if(outEl) outEl.textContent = val + '人';
  if(!outEl) return;
  if(val >= 10){
    outEl.style.backgroundColor = "rgba(222, 34, 1, 0.76)";
  }else if(val >= 5){
    outEl.style.backgroundColor = "rgba(222, 134, 1, 0.76)";
  }else{
    outEl.style.backgroundColor = "rgba(126, 222, 1, 0.76)";
  }
}
showNumber1();
showNumber2();

const STATE_KEY = 'waitingState_v1';
let waitingState = {
  items: [], 
  counters: { slime: 0, bathbomb: 0 }
};

function loadState(){
  try{
    const raw = localStorage.getItem(STATE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      waitingState = parsed;
    }
  }catch(e){
    console.error('state load error', e);
    waitingState = { items: [], counters: { slime:0, bathbomb:0 } };
  }
  renderWaiting();
}

function saveState(){
  try{
    localStorage.setItem(STATE_KEY, JSON.stringify(waitingState));
  }catch(e){
    console.error('state save error', e);
  }
}

function addItem(type){
  if(!(type === 'slime' || type === 'bathbomb')) return;
  waitingState.counters[type] = (waitingState.counters[type] || 0) + 1;
  const num = waitingState.counters[type];
  const item = { type, num, ts: Date.now() };
  waitingState.items.push(item);
  saveState();
  renderWaiting();
  const label = type === 'slime' ? 'スライム' : 'バスボム';
  alert(`${label}の${num}番を発行しました`);
}

function removeItem(index){
  if(index < 0 || index >= waitingState.items.length) return;
  waitingState.items.splice(index,1);
  saveState();
  renderWaiting();
}

function renderWaiting(){
  const list = document.getElementById('waitingList');
  const countEl = document.getElementById('waitingCount');
  const out1 = document.getElementById('output1');
  const out2 = document.getElementById('output2');
  const n1 = document.getElementById('number1');
  const n2 = document.getElementById('number2');
  if(!list || !countEl) return;
  list.innerHTML = '';
  const limit = waitingState.items.slice(0,3);
  limit.forEach((it, i) =>{
    const li = document.createElement('li');
    const label = it.type === 'slime' ? 'スライム' : 'バスボム';
    li.textContent = `${label}の${it.num}番`;
    li.style.cursor = 'pointer';
    li.title = 'クリックで削除';
    li.onclick = () => { if(confirm(`${li.textContent} をリストから削除しますか？`)) removeItem(i); };
    list.appendChild(li);
  });
  const total = waitingState.items.length;
  countEl.textContent = `${total}人待ち`;
  const slimeCount = waitingState.items.filter(it=>it.type==='slime').length;
  const bathCount = waitingState.items.filter(it=>it.type==='bathbomb').length;
  if(out1) out1.textContent = slimeCount + '人';
  if(out2) out2.textContent = bathCount + '人';
  if(n1) n1.value = slimeCount;
  if(n2) n2.value = bathCount;
  showNumber1();
  showNumber2();
}


document.addEventListener('DOMContentLoaded', ()=>{
  const btnS = document.getElementById('select_s');
  const btnB = document.getElementById('select_b');
  if(btnS) btnS.addEventListener('click', ()=> addItem('slime'));
  if(btnB) btnB.addEventListener('click', ()=> addItem('bathbomb'));
  loadState();
});

function updateclock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById("clock").textContent = "時刻：" + timeString;
}

updateclock();
setInterval(updateclock, 1000);