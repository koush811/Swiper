document.addEventListener('DOMContentLoaded', function () {
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

function options() {
  document.getElementById("optionmenue").style.display = "flex";
}
function optionend() {
  document.getElementById("optionmenue").style.display = "none";
}

function showNumber1() {
  const outEl = document.getElementById('output1');
  const numInput = document.getElementById('number1');
  let val = 0;
  if (numInput && numInput.value !== undefined) {
    val = Number(numInput.value) || 0;
  } else if (window.waitingState) {
    val = (window.waitingState.items || []).filter(it => it.type === 'slime').length;
  } else if (outEl) {
    val = Number((outEl.textContent || '').replace(/[^0-9]/g, '')) || 0;
  }
  if (outEl) outEl.textContent = val + '人';
  if (!outEl) return;
  if (val >= 10) {
    outEl.style.backgroundColor = "rgba(222, 34, 1, 0.76)";
  } else if (val >= 5) {
    outEl.style.backgroundColor = "rgba(222, 134, 1, 0.76)";
  } else {
    outEl.style.backgroundColor = "rgba(126, 222, 1, 0.76)";
  }
}
function showNumber2() {
  const outEl = document.getElementById('output2');
  const numInput = document.getElementById('number2');
  let val = 0;
  if (numInput && numInput.value !== undefined) {
    val = Number(numInput.value) || 0;
  } else if (window.waitingState) {
    val = (window.waitingState.items || []).filter(it => it.type === 'bathbomb').length;
  } else if (outEl) {
    val = Number((outEl.textContent || '').replace(/[^0-9]/g, '')) || 0;
  }
  if (outEl) outEl.textContent = val + '人';
  if (!outEl) return;
  if (val >= 10) {
    outEl.style.backgroundColor = "rgba(222, 34, 1, 0.76)";
  } else if (val >= 5) {
    outEl.style.backgroundColor = "rgba(222, 134, 1, 0.76)";
  } else {
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

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      waitingState = parsed;
    }
  } catch (e) {
    console.error('state load error', e);
    waitingState = { items: [], counters: { slime: 0, bathbomb: 0 } };
  }
  renderWaiting();
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(waitingState));
  } catch (e) {
    console.error('state save error', e);
  }
}

function addItem(type) {
  if (!(type === 'slime' || type === 'bathbomb')) return;

  let count = Number(waitingState.counters[type]) || 0;

  if (count >= 37) {
    count = 1;
  } else {
    count++;
  }

  waitingState.counters[type] = count;

  const item = { type, num: count, ts: Date.now() };
  waitingState.items.push(item);
  saveState();
  renderWaiting();

  const label = type === 'slime' ? 'スライム' : 'バスボム';
  alert(`${label}の${count}番を発行しました`);
}




function removeItem(index) {
  if (index < 0 || index >= waitingState.items.length) return;
  waitingState.items[index].deleted = true;
  saveState();
  renderWaiting();
}

function renderWaiting() {
  const slimeList = document.getElementById('slimeWaitingList');
  const bathbombList = document.getElementById('bathbombWaitingList');
  const countEl = document.getElementById('waitingCount');
  const out1 = document.getElementById('output1');
  const out2 = document.getElementById('output2');
  if (!slimeList || !bathbombList || !countEl) return;

  slimeList.innerHTML = '';
  bathbombList.innerHTML = '';

  const visibleItems = waitingState.items.filter(it => !it.deleted);

  const slimeItems = visibleItems.filter(it => it.type === 'slime');
  const bathItems = visibleItems.filter(it => it.type === 'bathbomb');

  slimeItems.forEach(it => {
    const li = document.createElement('li');
    li.textContent = `スライム${it.num}番`;
    li.classList.add('slime-item');
    li.style.cursor = 'pointer';
    li.title = 'クリックで削除';
    li.onclick = () => {
      if (confirm(`${li.textContent} をリストから削除しますか？`)) removeItem(waitingState.items.indexOf(it));
    };
    slimeList.appendChild(li);
  });

  bathItems.forEach(it => {
    const li = document.createElement('li');
    li.textContent = `バスボム${it.num}番`;
    li.classList.add('bathbomb-item');
    li.style.cursor = 'pointer';
    li.title = 'クリックで削除';
    li.onclick = () => {
      if (confirm(`${li.textContent} をリストから削除しますか？`)) removeItem(waitingState.items.indexOf(it));
    };
    bathbombList.appendChild(li);
  });

  const total = visibleItems.length;
  countEl.textContent = `${total}人待ち`;

  if (out1) out1.textContent = slimeItems.length + '人';
  if (out2) out2.textContent = bathItems.length + '人';

  showNumber1();
  showNumber2();
}


document.addEventListener('DOMContentLoaded', () => {
  const btnS = document.getElementById('select_s');
  const btnB = document.getElementById('select_b');
  if (btnS) btnS.addEventListener('click', () => addItem('slime'));
  if (btnB) btnB.addEventListener('click', () => addItem('bathbomb'));
  loadState();
});

function updateclock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById("clock").textContent = "時刻：" + timeString;
}

function reset() {
  if (!confirm('待ち人数をすべてリセットしますか？')) return;

  waitingState = { items: [], counters: { slime: 0, bathbomb: 0 } };

  localStorage.removeItem(STATE_KEY);
  renderWaiting();

  alert('待ち人数をリセットしました。');
}

document.addEventListener('DOMContentLoaded', () => {
  const btnReset = document.getElementById('resetbtn');
  if (btnReset) btnReset.addEventListener('click', reset);
});


updateclock();
setInterval(updateclock, 1000);

function showList() {
  const dialog = document.getElementById('listDialog');
  const tbody = document.querySelector('#listTable tbody');
  tbody.innerHTML = '';

  waitingState.items.forEach(it => {
    const row = document.createElement('tr');
    const typeLabel = it.type === 'slime' ? 'スライム' : 'バスボム';
    const ts = new Date(it.ts).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const status = it.deleted ? '(削除済)' : '';
    row.innerHTML = `<td>${typeLabel}</td><td>${it.num}番 ${status}</td><td>${ts}</td>`;
    tbody.appendChild(row);
  });

  dialog.showModal();
}

document.getElementById('closeDialog').addEventListener('click', () => {
  document.getElementById('listDialog').close();
});