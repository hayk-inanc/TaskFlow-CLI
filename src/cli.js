#!/usr/bin/env node
'use strict';

const { addTask, listTasks } = require('./tasks');

const HELP = `TaskFlow — простой менеджер задач

Использование:
  taskflow add "Название задачи"   Добавить задачу
  taskflow list                    Показать все задачи
  taskflow --help                  Показать эту справку
`;

function run(argv) {
  const [command, ...args] = argv;

  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    return 0;
  }

  switch (command) {
    case 'add': {
      const title = args.join(' ');
      const task = addTask(title);
      console.log(`Добавлена задача #${task.id}: ${task.title}`);
      return 0;
    }
    case 'list': {
      const tasks = listTasks();
      if (tasks.length === 0) {
        console.log('Задач пока нет.');
        return 0;
      }
      for (const task of tasks) {
        const mark = task.done ? 'x' : ' ';
        console.log(`[${mark}] #${task.id} ${task.title}`);
      }
      return 0;
    }
    default:
      console.error(`Неизвестная команда: ${command}\n`);
      console.error(HELP);
      return 1;
  }
}

try {
  process.exitCode = run(process.argv.slice(2));
} catch (err) {
  console.error(`Ошибка: ${err.message}`);
  process.exitCode = 1;
}
