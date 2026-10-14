(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');
  const root = document.documentElement;
  const base = document.body.dataset.baseurl || '';
  const dialog = document.querySelector('#command-dialog');
  const search = document.querySelector('#command-search');
  const items = [...document.querySelectorAll('[data-command-item]')];
  const empty = document.querySelector('#command-empty');
  const announcement = document.querySelector('#command-announcement');
  let selected = 0;
  let previouslyFocused = null;

  function updateThemeButtons() {
    const light = root.dataset.theme === 'light';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      button.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = light ? '#f3f5ef' : '#0b1014';
  }
  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('yanwen-theme', root.dataset.theme); } catch (_) {}
    updateThemeButtons();
  }
  updateThemeButtons();
  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', toggleTheme));

  function visibleItems() { return items.filter(item => !item.hidden); }
  function updateSelection() {
    const visible = visibleItems();
    selected = Math.max(0, Math.min(selected, visible.length - 1));
    items.forEach(item => item.classList.remove('is-selected'));
    if (visible[selected]) visible[selected].classList.add('is-selected');
    empty.hidden = visible.length > 0;
    if (announcement) announcement.textContent = visible[selected] ? visible[selected].textContent.trim().replace(/\s+/g, ' ') + ', ' + (selected + 1) + ' of ' + visible.length : 'No matching commands.';
  }
  function filterCommands() {
    const query = search.value.trim().toLowerCase();
    items.forEach(item => { item.hidden = !item.dataset.search.includes(query) && !item.textContent.toLowerCase().includes(query); });
    selected = 0;
    updateSelection();
  }
  function openCommands() {
    if (!dialog || typeof dialog.showModal !== 'function' || dialog.open) return;
    previouslyFocused = document.activeElement;
    search.value = '';
    filterCommands();
    dialog.showModal();
    search.focus();
  }
  function closeCommands() { if (dialog && dialog.open) dialog.close(); }
  document.querySelectorAll('[data-open-command]').forEach(button => button.addEventListener('click', openCommands));
  document.querySelectorAll('[data-close-command]').forEach(button => button.addEventListener('click', closeCommands));
  search.addEventListener('input', filterCommands);
  search.addEventListener('keydown', event => {
    const visible = visibleItems();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!visible.length) return;
      selected = (selected + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length;
      updateSelection();
      visible[selected].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (visible[selected]) visible[selected].click();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCommands();
  });
  dialog.addEventListener('close', () => {
    if (previouslyFocused && previouslyFocused.isConnected) previouslyFocused.focus();
  });
  items.forEach(item => item.addEventListener('click', () => {
    if (item.hasAttribute('data-palette-theme')) toggleTheme();
    closeCommands();
    if (item.hasAttribute('data-palette-fortune')) {
      printFortune('fortune');
      if (input) input.focus();
    }
  }));
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog && dialog.open) closeCommands(); else openCommands();
    }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    document.querySelectorAll('[data-shortcut]').forEach(label => { label.textContent = '⌘ K'; });
  }

  const form = document.querySelector('#terminal-form');
  const input = document.querySelector('#terminal-input');
  const history = document.querySelector('#terminal-history');
  const fortuneData = document.querySelector('#terminal-fortunes');
  let fortunes = [];
  let previousFortune = -1;
  try {
    const data = JSON.parse(fortuneData ? fortuneData.textContent : '[]');
    if (Array.isArray(data)) fortunes = [...new Set(data.filter(value => typeof value === 'string' && value.trim()).map(value => value.trim()))];
  } catch (_) {}
  const typedCommands = [];
  let historyIndex = 0;
  function printResult(command, output) {
    const row = document.createElement('div');
    row.className = 'terminal-result';
    const line = document.createElement('p');
    line.className = 'result-command';
    const prefix = document.createElement('span');
    prefix.className = 'terminal-prompt';
    prefix.textContent = '$';
    line.append(prefix, document.createTextNode(' ' + command));
    const result = document.createElement('p');
    result.className = 'result-output';
    result.textContent = output;
    row.append(line, result);
    history.append(row);
    while (history.children.length > 6) history.firstElementChild.remove();
    history.scrollTop = history.scrollHeight;
  }
  function printFortune(command) {
    if (!history) return;
    if (!fortunes.length) {
      printResult(command, 'The fortune cookie is empty. Try again after the next bake.');
      return;
    }
    let next;
    if (fortunes.length > 1 && previousFortune >= 0) {
      next = Math.floor(Math.random() * (fortunes.length - 1));
      if (next >= previousFortune) next += 1;
    } else {
      next = Math.floor(Math.random() * fortunes.length);
    }
    previousFortune = next;
    printResult(command, '🥠 ' + fortunes[next]);
  }
  const routes = {
    about: '/#about', approach: '/#approach', work: '/#work', personal: '/#personal',
    research: '/publications/', papers: '/publications/', publications: '/publications/',
    cv: '/cv/', contact: '/#contact', email: '/#contact'
  };
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const command = input.value.trim();
    const key = command.toLowerCase().replace(/\s+/g, ' ').replace(/\/$/, '');
    if (!key) return;
    input.value = '';
    typedCommands.push(command);
    if (typedCommands.length > 50) typedCommands.shift();
    historyIndex = typedCommands.length;
    if (key === 'clear') { history.replaceChildren(); return; }
    if (key === 'help') {
      printResult(command, 'about · approach · work · personal · contact\nwhoami · ls · cat approach.txt · cat interests.txt\npapers · cv · github · scholar · theme · fortune · clear\nCtrl / ⌘ K opens the command menu.');
    } else if (key === 'fortune') {
      printFortune(command);
    } else if (key === 'whoami') {
      printResult(command, 'Yanwen Xia / 夏彦文\nSystems, tools, and curious exploration\nPhD student · ICT, CAS & UCAS · Beijing, China');
    } else if (key === 'ls') {
      printResult(command, 'about/  approach/  work/  personal/  contact/\nResearch archive: papers · Background: cv\nEnter a name to open it.');
    } else if (key === 'cat approach.txt' || key === 'cat principles.txt') {
      printResult(command, 'Build solid systems. Share usable work.\nMake results checkable. Credit collaborators.\nOpen whenever possible; clear about limits.');
    } else if (key === 'cat interests.txt') {
      printResult(command, 'Systems & tools · AI agents\nFar memory · Fault tolerance · Runtimes\nRTS games · Hiking · J-pop / Punk · VOCALOID\nCrime films · Action anime');
    } else if (key === 'theme') {
      toggleTheme();
      printResult(command, 'Theme: ' + root.dataset.theme);
    } else if (key === 'github' || key === 'scholar') {
      const item = items.find(item => item.dataset.search.startsWith(key));
      const target = item ? item.href : null;
      if (target) window.location.assign(target);
    } else if (routes[key]) {
      window.location.assign(base + routes[key]);
    } else {
      printResult(command, 'Unknown command. Type help to see what this profile terminal can do.');
    }
  });
  if (input) input.addEventListener('keydown', event => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    historyIndex = Math.max(0, Math.min(typedCommands.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
    input.value = typedCommands[historyIndex] || '';
  });
  document.querySelectorAll('[data-print-cv]').forEach(button => button.addEventListener('click', () => window.print()));
})();
