'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = path.join(__dirname, '..', 'tasks.json');

function loadTasks(file = DEFAULT_FILE) {
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, 'utf8').trim();
  if (raw === '') {
    return [];
  }
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error(`Файл ${file} должен содержать массив задач`);
  }
  return data;
}

function saveTasks(tasks, file = DEFAULT_FILE) {
  fs.writeFileSync(file, JSON.stringify(tasks, null, 2) + '\n', 'utf8');
}

function addTask(title, file = DEFAULT_FILE) {
  const trimmed = typeof title === 'string' ? title.trim() : '';
  if (trimmed === '') {
    throw new Error('Название задачи не может быть пустым');
  }
  const tasks = loadTasks(file);
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task = {
    id: nextId,
    title: trimmed,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks, file);
  return task;
}

function listTasks(file = DEFAULT_FILE) {
  return loadTasks(file);
}

module.exports = { loadTasks, saveTasks, addTask, listTasks, DEFAULT_FILE };
