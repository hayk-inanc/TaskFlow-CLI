# TaskFlow CLI

Простое CLI-приложение на Node.js для управления задачами. Без сторонних зависимостей.

## Требования

- Node.js 18 или новее

## Установка

```bash
cd taskflow-cli
npm link        # необязательно: делает доступной глобальную команду `taskflow`
```

Без `npm link` приложение запускается через `node src/cli.js`.

## Использование

```bash
# Добавить задачу
node src/cli.js add "Купить молоко"

# Показать все задачи
node src/cli.js list

# Справка
node src/cli.js --help
```

После `npm link` то же самое:

```bash
taskflow add "Купить молоко"
taskflow list
taskflow --help
```

Пример вывода `list`:

```
[ ] #1 Купить молоко
[ ] #2 Написать README
```

## Хранение данных

Задачи хранятся в файле `tasks.json` в корне проекта:

```json
[
  {
    "id": 1,
    "title": "Купить молоко",
    "done": false,
    "createdAt": "2026-10-14T12:00:00.000Z"
  }
]
```

## Структура проекта

```
taskflow-cli/
├── src/
│   ├── cli.js     # разбор аргументов командной строки и вывод
│   └── tasks.js   # бизнес-логика: чтение, запись, добавление задач
├── package.json
├── README.md
└── tasks.json     # хранилище задач
```
