(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
  }

  const journal = document.querySelector('[data-journal]');
  if (!journal) return;

  const key = `gertvy:journal:${journal.dataset.journal}:v1`;
  const form = journal.querySelector('[data-journal-form]');
  const text = form.elements.namedItem('entry');
  const mood = form.elements.namedItem('mood');
  const submit = form.querySelector('[type="submit"]');
  const cancel = form.querySelector('[data-cancel]');
  const status = form.querySelector('[data-status]');
  const list = journal.querySelector('[data-entries]');
  const empty = journal.querySelector('[data-empty]');
  const editorTitle = journal.querySelector('#editor-title');
  const historyTitle = journal.querySelector('#history-title');
  const defaultTitle = editorTitle.textContent;
  const dateFormat = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' });
  let editing = null;

  function load() {
    const entries = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    if (!Array.isArray(entries) || entries.some((entry) => !entry || typeof entry.id !== 'string'
      || typeof entry.text !== 'string' || typeof entry.mood !== 'string'
      || typeof entry.date !== 'string' || !Number.isFinite(Date.parse(entry.date)))) {
      throw new Error('Invalid local journal');
    }
    return entries;
  }

  function write(entries) {
    window.localStorage.setItem(key, JSON.stringify(entries));
  }

  function resetEditor() {
    editing = null;
    form.reset();
    editorTitle.textContent = defaultTitle;
    submit.textContent = '保存日记';
    cancel.hidden = true;
  }

  function node(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function historyAction(action, label, timestamp) {
    const button = node('button', 'quiet-button quiet-button--small', label);
    button.type = 'button';
    button.dataset.action = action;
    button.setAttribute('aria-label', `${label} ${timestamp}的记录`);
    return button;
  }

  function render(entries) {
    const fragment = document.createDocumentFragment();
    for (const entry of entries) {
      const item = node('li', 'entry');
      item.dataset.entryId = entry.id;
      const timestamp = dateFormat.format(new Date(entry.date));
      const time = node('time', '', timestamp);
      time.dateTime = entry.date;
      const meta = node('div', 'entry__meta');
      meta.append(time);
      if (entry.mood) meta.append(node('span', 'entry__mood', entry.mood));
      const actions = node('div', 'entry__actions');
      actions.append(historyAction('edit', '编辑', timestamp), historyAction('delete', '删除', timestamp));
      item.append(meta, node('p', 'entry__text', entry.text), actions);
      fragment.append(item);
    }
    list.replaceChildren(fragment);
    empty.hidden = entries.length > 0;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = text.value.trim();
    if (!content) {
      status.textContent = '请先写一点内容。';
      text.focus();
      return;
    }
    try {
      const entries = load();
      const index = editing === null ? -1 : entries.findIndex((entry) => entry.id === editing);
      if (editing !== null && index < 0) {
        status.textContent = '这条记录已不存在。可以取消编辑后重新写入。';
        return;
      }
      const fields = { text: content, mood: mood ? mood.value : '' };
      if (index >= 0) entries[index] = { ...entries[index], ...fields };
      else entries.unshift({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, date: new Date().toISOString(), ...fields });
      write(entries);
      const wasEditing = editing !== null;
      resetEditor();
      render(entries);
      status.textContent = wasEditing ? '已更新这条记录。' : '日记已保存在当前浏览器。';
    } catch {
      status.textContent = '无法保存。请检查浏览器的网站存储设置或剩余空间，当前输入未丢失。';
    }
  });

  cancel.addEventListener('click', () => {
    resetEditor();
    status.textContent = '已取消编辑。';
    text.focus();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    try {
      const entries = load();
      const id = button.closest('[data-entry-id]').dataset.entryId;
      const entry = entries.find((item) => item.id === id);
      if (!entry) {
        render(entries);
        historyTitle.focus();
        status.textContent = '这条记录已不存在。';
        return;
      }
      if (button.dataset.action === 'edit') {
        if (editing === id) {
          text.focus();
          return;
        }
        const original = entries.find((item) => item.id === editing);
        const hasDraft = text.value.trim() !== (original?.text ?? '') || (mood && mood.value !== (original?.mood ?? ''));
        if (hasDraft && !window.confirm('编辑另一条日记？当前未保存的内容将丢失。')) return;
        editing = id;
        editorTitle.textContent = '编辑这条日记';
        submit.textContent = '保存修改';
        cancel.hidden = false;
        text.value = entry.text;
        if (mood) mood.value = entry.mood;
        status.textContent = '';
        text.focus();
      } else if (window.confirm('删除这条日记？此操作无法撤销。')) {
        const next = load().filter((item) => item.id !== id);
        write(next);
        if (editing === id) resetEditor();
        render(next);
        historyTitle.focus();
        status.textContent = '已删除这条记录。';
      }
    } catch {
      status.textContent = '无法操作这条记录，请检查浏览器的网站存储设置。';
    }
  });

  function refresh() {
    try {
      render(load());
    } catch {
      status.textContent = '无法读取本地日记。请检查浏览器的网站存储设置。';
    }
  }

  window.addEventListener('storage', (event) => {
    if (event.key === key || event.key === null) refresh();
  });
  journal.querySelector('.journal-layout').hidden = false;
  refresh();
})();
