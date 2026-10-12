const servers = [
  { city: '洛杉矶', country: '美国', flag: '🇺🇸', latency: 28, tag: '推荐节点' },
  { city: '纽约', country: '美国', flag: '🇺🇸', latency: 46, tag: '高速 · 流媒体' },
  { city: '西雅图', country: '美国', flag: '🇺🇸', latency: 39, tag: '高速 · 游戏' },
  { city: '达拉斯', country: '美国', flag: '🇺🇸', latency: 53, tag: '稳定连接' },
  { city: '东京', country: '日本', flag: '🇯🇵', latency: 64, tag: '亚洲入口' },
  { city: '新加坡', country: '新加坡', flag: '🇸🇬', latency: 73, tag: '亚洲入口' }
];

const state = { connected: false, connecting: false, selected: Number(localStorage.getItem('northstar-server')) || 0, started: null, timer: null };
const $ = (selector) => document.querySelector(selector);
const list = $('#server-list');

function renderServers(query = '') {
  const text = query.trim().toLowerCase();
  list.innerHTML = servers.map((server, i) => {
    if (text && !`${server.city}${server.country}`.toLowerCase().includes(text)) return '';
    const selected = i === state.selected;
    return `<button class="server ${selected ? 'selected' : ''}" data-index="${i}"><span class="flag">${server.flag}</span><span class="server-info"><strong>${server.country} · ${server.city}</strong><small>${server.tag}</small></span><span class="latency ${server.latency < 45 ? 'good' : ''}">${server.latency} ms</span>${selected ? '<span class="check">✓</span>' : ''}</button>`;
  }).join('') || '<p class="empty">没有找到匹配的节点。</p>';
}

function updateSelected() {
  const server = servers[state.selected];
  $('#server-name').textContent = `${server.country} · ${server.city}`;
  $('#server-meta').textContent = `${server.tag} · ${server.latency} ms`;
  $('#active-server .flag').textContent = server.flag;
  localStorage.setItem('northstar-server', state.selected);
  renderServers($('#search-input').value);
}

function formatTime(seconds) { return [seconds / 3600, (seconds % 3600) / 60, seconds % 60].map(n => String(Math.floor(n)).padStart(2, '0')).join(':'); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2300); }

function tick() {
  const seconds = Math.floor((Date.now() - state.started) / 1000);
  $('#duration').textContent = formatTime(seconds);
  const amount = Math.max(1, Math.floor(seconds * 0.19));
  $('#traffic').textContent = amount > 1024 ? `${(amount / 1024).toFixed(1)} GB` : `${amount} MB`;
}

function setConnection(value) {
  state.connected = value; state.connecting = false;
  const view = $('.connection-view'); view.classList.toggle('connected', value); view.classList.remove('connecting');
  $('#status-title').textContent = value ? '已安全连接' : '准备连接';
  $('#status-copy').textContent = value ? '你的连接已通过加密隧道受到保护。' : '选择一个节点，保护你的网络连接。';
  $('#button-label').textContent = value ? '断开' : '连接';
  $('#connect-button').setAttribute('aria-label', value ? '断开连接' : '开始连接');
  if (value) { state.started = Date.now(); tick(); state.timer = setInterval(tick, 1000); showToast('安全连接已建立'); }
  else { clearInterval(state.timer); $('#duration').textContent = '00:00:00'; $('#traffic').textContent = '0 MB'; showToast('已断开连接'); }
}

$('#connect-button').addEventListener('click', () => {
  if (state.connected) return setConnection(false);
  if (state.connecting) return;
  state.connecting = true; $('.connection-view').classList.add('connecting'); $('#status-title').textContent = '正在建立安全隧道'; $('#status-copy').textContent = '正在验证并连接到所选节点…'; $('#button-label').textContent = '连接中';
  setTimeout(() => setConnection(true), 1050);
});

list.addEventListener('click', (event) => { const item = event.target.closest('.server'); if (!item) return; state.selected = Number(item.dataset.index); updateSelected(); showToast(`已选择 ${servers[state.selected].city} 节点`); });
$('#change-server').addEventListener('click', () => $('#locations').scrollIntoView({ behavior: 'smooth' }));
$('#auto-select').addEventListener('click', () => { state.selected = servers.reduce((best, server, i) => server.latency < servers[best].latency ? i : best, 0); updateSelected(); showToast('已为你选择延迟最低的节点'); });
$('#search-input').addEventListener('input', (event) => renderServers(event.target.value));
document.querySelectorAll('.switch').forEach(button => button.addEventListener('click', () => { const on = button.classList.toggle('is-on'); button.setAttribute('aria-pressed', on); showToast(on ? '偏好已启用' : '偏好已关闭'); }));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { document.querySelector('.nav-link.active').classList.remove('active'); link.classList.add('active'); }));
renderServers(); updateSelected();
