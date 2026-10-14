'use strict';

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { addTask, listTasks, loadTasks, saveTasks } = require('../src/tasks');

let tmpDir;
let file;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-test-'));
  file = path.join(tmpDir, 'tasks.json');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('addTask', () => {
  test('добавляет задачу и возвращает её', () => {
    const task = addTask('Купить молоко', file);

    assert.equal(task.id, 1);
    assert.equal(task.title, 'Купить молоко');
    assert.equal(task.done, false);
    assert.ok(!Number.isNaN(Date.parse(task.createdAt)));
  });

  test('присваивает последовательные id', () => {
    const first = addTask('Первая', file);
    const second = addTask('Вторая', file);
    const third = addTask('Третья', file);

    assert.deepEqual([first.id, second.id, third.id], [1, 2, 3]);
  });

  test('продолжает нумерацию от максимального id', () => {
    saveTasks([{ id: 7, title: 'Старая', done: false, createdAt: '2026-01-01T00:00:00.000Z' }], file);

    const task = addTask('Новая', file);

    assert.equal(task.id, 8);
  });

  test('обрезает пробелы в названии', () => {
    const task = addTask('   Задача с пробелами  ', file);

    assert.equal(task.title, 'Задача с пробелами');
  });

  for (const [label, value] of [
    ['пустая строка', ''],
    ['только пробелы', '   '],
    ['undefined', undefined],
    ['не строка', 42],
  ]) {
    test(`отклоняет пустое название: ${label}`, () => {
      assert.throws(() => addTask(value, file), {
        message: 'Название задачи не может быть пустым',
      });
      assert.equal(fs.existsSync(file), false, 'файл не должен создаваться');
    });
  }
});

describe('listTasks', () => {
  test('возвращает пустой массив, если файла нет', () => {
    assert.deepEqual(listTasks(file), []);
  });

  test('возвращает пустой массив для пустого файла', () => {
    fs.writeFileSync(file, '');

    assert.deepEqual(listTasks(file), []);
  });

  test('возвращает задачи в порядке добавления', () => {
    addTask('A', file);
    addTask('B', file);

    const titles = listTasks(file).map((t) => t.title);

    assert.deepEqual(titles, ['A', 'B']);
  });

  test('выбрасывает ошибку, если в файле не массив', () => {
    fs.writeFileSync(file, '{"id": 1}');

    assert.throws(() => listTasks(file), /должен содержать массив задач/);
  });
});

describe('сохранение данных', () => {
  test('addTask записывает задачу в файл', () => {
    const task = addTask('Сохранить меня', file);

    const onDisk = JSON.parse(fs.readFileSync(file, 'utf8'));

    assert.deepEqual(onDisk, [task]);
  });

  test('данные переживают повторную загрузку', () => {
    addTask('Первая', file);
    addTask('Вторая', file);

    const reloaded = loadTasks(file);

    assert.equal(reloaded.length, 2);
    assert.deepEqual(reloaded.map((t) => t.title), ['Первая', 'Вторая']);
  });

  test('saveTasks и loadTasks симметричны', () => {
    const tasks = [
      { id: 1, title: 'Кириллица и "кавычки"', done: true, createdAt: '2026-10-14T00:00:00.000Z' },
    ];

    saveTasks(tasks, file);

    assert.deepEqual(loadTasks(file), tasks);
  });

  test('файл сохраняется в читаемом JSON с переводом строки в конце', () => {
    addTask('Формат', file);

    const raw = fs.readFileSync(file, 'utf8');

    assert.ok(raw.endsWith('\n'));
    assert.match(raw, /^\[\n  \{/);
  });
});
