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

function addItem(type, groupCount = 1) {
  if (!(type === 'slime' || type === 'bathbomb')) return;
  let count = Number(waitingState.counters[type]) || 0;

  const groupId = Date.now();

  for (let i = 0; i < groupCount; i++) {
    if (count >= 37) count = 1; else count++;
    waitingState.counters[type] = count;
    let item = { type, num: count, ts: Date.now(), groupId };
    waitingState.items.push(item);
  }

  saveState();
  renderWaiting();

  const label = type === 'slime' ? 'スライム' : 'バスボム';
  const startNum = waitingState.counters[type] - groupCount + 1;
  alert(`${label}の${startNum}番～${waitingState.counters[type]}番（${groupCount}人）を発行しました`);

  showList();
}


function removeItem(index) {
  if (index < 0 || index >= waitingState.items.length) return;
  waitingState.items[index].deleted = true;
  saveState();
  renderWaiting();
}

/*function renderWaiting() {
  const slimeListContainer = document.getElementById('slimeListContainer');
  const bathbombListContainer = document.getElementById('bathbombListContainer');
  const countEl = document.getElementById('waitingCount');
  const out1 = document.getElementById('output1');
  const out2 = document.getElementById('output2');
  if (!slimeListContainer || !bathbombListContainer || !countEl) return;

  // 表示中（削除済みでない）データ取得
  const visibleItems = waitingState.items.filter(it => !it.deleted);

  // groupIdごとにグループ化
  function groupItemsByGroupId(items) {
    const groups = [];
    let currentGroupId = null;
    let currentGroup = [];
    items.forEach(it => {
      if (it.groupId !== currentGroupId) {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [it];
        currentGroupId = it.groupId;
      } else {
        currentGroup.push(it);
      }
    });
    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  }

  // 種類ごとに分離
  const slimeItems = visibleItems.filter(it => it.type === 'slime');
  const bathItems = visibleItems.filter(it => it.type === 'bathbomb');

  const slimeGroups = groupItemsByGroupId(slimeItems);
  const bathGroups = groupItemsByGroupId(bathItems);

  // コンテナ初期化
  slimeListContainer.innerHTML = '';
  bathbombListContainer.innerHTML = '';

  // ===== スライムリスト描画 =====
  slimeGroups.forEach((group, index) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('group-wrapper');

    const title = document.createElement('h5');
    title.textContent = `スライム グループ${index + 1}（${group.length}人）`;
    wrapper.appendChild(title);

    const ul = document.createElement('ul');
    ul.classList.add('group-list');

    group.forEach(it => {
      const li = document.createElement('li');
      li.textContent = `スライム${it.num}番`;
      li.classList.add('slime-item');
      li.style.cursor = 'pointer';
      li.title = 'クリックで削除';
      li.onclick = () => {
        if (confirm(`${li.textContent} をリストから削除しますか？`)) removeItem(waitingState.items.indexOf(it));
      };
      ul.appendChild(li);
    });

    wrapper.appendChild(ul);
    slimeListContainer.appendChild(wrapper);
  });

  // ===== バスボムリスト描画 =====
  bathGroups.forEach((group, index) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('group-wrapper');

    const title = document.createElement('h5');
    title.textContent = `バスボム グループ${index + 1}（${group.length}人）`;
    wrapper.appendChild(title);

    const ul = document.createElement('ul');
    ul.classList.add('group-list');

    group.forEach(it => {
      const li = document.createElement('li');
      li.textContent = `バスボム${it.num}番`;
      li.classList.add('bathbomb-item');
      li.style.cursor = 'pointer';
      li.title = 'クリックで削除';
      li.onclick = () => {
        if (confirm(`${li.textContent} をリストから削除しますか？`)) removeItem(waitingState.items.indexOf(it));
      };
      ul.appendChild(li);
    });

    wrapper.appendChild(ul);
    bathbombListContainer.appendChild(wrapper);
  });

  // ===== 待人数・カウント更新 =====
  const total = visibleItems.length;
  countEl.textContent = `${total}人待ち`;

  const slimeCount = slimeItems.length;
  const bathCount = bathItems.length;

  if (out1) out1.textContent = slimeCount + '人';
  if (out2) out2.textContent = bathCount + '人';

  // 背景色も人数によって変化
  const updateColor = (el, val) => {
    if (!el) return;
    if (val >= 10) el.style.backgroundColor = "rgba(222, 34, 1, 0.76)";
    else if (val >= 5) el.style.backgroundColor = "rgba(222, 134, 1, 0.76)";
    else el.style.backgroundColor = "rgba(126, 222, 1, 0.76)";
  };
  updateColor(out1, slimeCount);
  updateColor(out2, bathCount);
}*/

function renderWaiting() {
  const slimeListContainer = document.getElementById('slimeListContainer');
  const bathbombListContainer = document.getElementById('bathbombListContainer');
  const countEl = document.getElementById('waitingCount');
  const out1 = document.getElementById('output1');
  const out2 = document.getElementById('output2');

  if (!slimeListContainer || !bathbombListContainer || !countEl) return;

  // 削除されていない表示対象のアイテムを抽出
  const visibleItems = waitingState.items.filter(item => !item.deleted);

  // groupIdごとに配列を分割するユーティリティ関数
  function groupItemsByGroupId(items) {
    const groups = [];
    let currentGroupId = null;
    let currentGroup = [];
    items.forEach(item => {
      if (item.groupId !== currentGroupId) {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [item];
        currentGroupId = item.groupId;
      } else {
        currentGroup.push(item);
      }
    });
    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  }

  const slimeItems = visibleItems.filter(item => item.type === 'slime');
  const bathItems = visibleItems.filter(item => item.type === 'bathbomb');

  const slimeGroups = groupItemsByGroupId(slimeItems);
  const bathGroups = groupItemsByGroupId(bathItems);

  slimeListContainer.innerHTML = '';
  slimeGroups.forEach((group, index) => {
    const groupWrapper = document.createElement('div');
    groupWrapper.classList.add('group-wrapper');

    const title = document.createElement('h5');
    title.textContent = `スライム グループ${index + 1}（${group.length}人）`;
    groupWrapper.appendChild(title);

    const ul = document.createElement('ul');
    ul.classList.add('group-list');
    group.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `スライム${item.num}番`;
      li.classList.add('slime-item');
      li.style.cursor = 'pointer';
      li.title = 'クリックで削除';
      li.onclick = () => {
        if (confirm(`${li.textContent} をリストから削除しますか？`)) {
          removeItem(waitingState.items.indexOf(item));
        }
      };
      ul.appendChild(li);
    });
    groupWrapper.appendChild(ul);
    slimeListContainer.appendChild(groupWrapper);
  });

  bathbombListContainer.innerHTML = '';
  bathGroups.forEach((group, index) => {
    const groupWrapper = document.createElement('div');
    groupWrapper.classList.add('group-wrapper');

    const title = document.createElement('h5');
    title.textContent = `バスボム グループ${index + 1}（${group.length}人）`;
    groupWrapper.appendChild(title);

    const ul = document.createElement('ul');
    ul.classList.add('group-list');
    group.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `バスボム${item.num}番`;
      li.classList.add('bathbomb-item');
      li.style.cursor = 'pointer';
      li.title = 'クリックで削除';
      li.onclick = () => {
        if (confirm(`${li.textContent} をリストから削除しますか？`)) {
          removeItem(waitingState.items.indexOf(item));
        }
      };
      ul.appendChild(li);
    });
    groupWrapper.appendChild(ul);
    bathbombListContainer.appendChild(groupWrapper);
  });

  // 待ち合計人数
  const total = visibleItems.length;
  countEl.textContent = `${total}人待ち`;

  if (out1) out1.textContent = slimeItems.length + '人';
  if (out2) out2.textContent = bathItems.length + '人';

  // 人数に応じて背景色更新
  function updateColor(el, val) {
    if (!el) return;
    if (val >= 10) el.style.backgroundColor = "rgba(222, 34, 1, 0.76)";
    else if (val >= 5) el.style.backgroundColor = "rgba(222, 134, 1, 0.76)";
    else el.style.backgroundColor = "rgba(126, 222, 1, 0.76)";
  }

  updateColor(out1, slimeItems.length);
  updateColor(out2, bathItems.length);
}




document.addEventListener('DOMContentLoaded', () => {
  const btnS = document.getElementById('select_s');
  const btnB = document.getElementById('select_b');
  if (btnS) btnS.addEventListener('click', () => {
    const val = Math.max(1, Number(document.getElementById('number1').value) || 1);
    addItem('slime', val);
  });
  if (btnB) btnB.addEventListener('click', () => {
    const val = Math.max(1, Number(document.getElementById('number2').value) || 1);
    addItem('bathbomb', val);
  });
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
  if (!tbody) return;
  tbody.innerHTML = '';

  // 削除済み除くアイテム取得
  const itemsToShow = waitingState.items.filter(it => !it.deleted);

  if (itemsToShow.length === 0) {
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.textContent = '現在、待機中の番号はありません。';
    td.style.textAlign = 'center';
    row.appendChild(td);
    tbody.appendChild(row);
  } else {
    itemsToShow.forEach(it => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${it.type === 'slime' ? 'スライム' : 'バスボム'}</td>
        <td>${it.num}番</td>
        <td>${new Date(it.ts).toLocaleTimeString('ja-JP')}</td>
        <td><button onclick="removeItem(${waitingState.items.indexOf(it)})">削除</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  if (!dialog.hasAttribute('open')) dialog.showModal();
}

function showListDelete(){
  document.getElementById('delete').addEventListener('click')
    
}

document.getElementById('closeDialog').addEventListener('click', () => {
  document.getElementById('listDialog').close();
});