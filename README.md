# 🎮 SUPER SIMPLE 2D Console Engine

**Настолько простой 2D движок на JavaScript, что даже Паша Уткин из 1 класса сможет сделать игру!**

> Забудь про complex фреймворки. Это - боевой 2D движок в ~100 строк кода для консоли.

## 🚀 Быстрый старт

```bash
# 1. Клонируй репо
git clone <repo-url>
cd console-2d-engine

# 2. Запусти примеры
node examples.js

# 3. Пройди обучение
node tutorial.js
```

## 📚 Основные концепции

### GameObject - объект на сцене

```javascript
const { GameObject } = require('./engine');

// Создаём объект в позиции (x=20, y=10) с символом '█'
const hero = new GameObject(20, 10, '█');

// Установить скорость движения
hero.setVelocity(1, 0);  // движется вправо с скоростью 1 пиксель/фрейм

// Проверить столкновение с другим объектом
if (hero.collidesWith(enemy)) {
  console.log('БУМ!');
}
```

### Game - контейнер для всех объектов

```javascript
const { Game } = require('./engine');

// Создаём игру: 40 символов в ширину, 20 в высоту, 10 FPS
const game = new Game(40, 20, 10);

// Добавляем объект на сцену
const hero = game.add(new GameObject(20, 10, '█'));

// Запускаем основной цикл
game.start(() => {
  // Эта функция вызывается каждый фрейм
  // Здесь вся логика игры!
});

// Остановить игру
game.stop();
```

## 🎮 API Reference

### GameObject

| Свойство | Описание |
|----------|----------|
| `x, y` | Позиция на сцене |
| `vx, vy` | Скорость (px/frame) |
| `char` | Символ для отображения |
| `active` | Активен ли объект (true/false) |

| Метод | Описание |
|-------|----------|
| `setVelocity(vx, vy)` | Установить скорость |
| `update()` | Обновить позицию |
| `collidesWith(other)` | Проверить столкновение |

### Game

| Свойство | Описание |
|----------|----------|
| `width` | Ширина консоли |
| `height` | Высота консоли |
| `fps` | Кадры в секунду |
| `score` | Текущий счёт |
| `frame` | Номер текущего фрейма |

| Метод | Описание |
|-------|----------|
| `add(obj)` | Добавить объект на сцену |
| `remove(obj)` | Удалить объект со сцены |
| `get(index)` | Получить объект по индексу |
| `getAll()` | Получить все объекты |
| `start(callback)` | Запустить игровой цикл |
| `stop()` | Остановить игру |
| `clear()` | Очистить консоль |
| `render()` | Нарисовать текущий кадр |

## 💡 Примеры

### 1️⃣ Квадрат, бегающий туда-сюда

```javascript
const { Game, GameObject } = require('./engine');

const game = new Game(40, 10, 5);
const hero = game.add(new GameObject(20, 5, '█'));
hero.setVelocity(1, 0);

game.start(() => {
  // Отскакиваем от стен
  if (hero.x <= 0 || hero.x >= game.width - 1) {
    hero.vx *= -1;  // переворачиваем направление
  }
});
```

### 2️⃣ Ловля врага

```javascript
const { Game, GameObject } = require('./engine');

const game = new Game(40, 10, 5);
const hero = game.add(new GameObject(20, 5, '█'));
const enemy = game.add(new GameObject(10, 5, 'E'));

game.start(() => {
  // Враг движется
  enemy.vx = 1;
  
  // Проверяем столкновение
  if (hero.collidesWith(enemy)) {
    game.score += 10;
    enemy.x = Math.random() * game.width;
  }
});
```

### 3️⃣ Падающие блоки

```javascript
const { Game, GameObject } = require('./engine');

const game = new Game(40, 15, 8);
const hero = game.add(new GameObject(20, 13, '█'));

game.start(() => {
  // Создаём падающие блоки каждый N фрейм
  if (game.frame % 10 === 0) {
    const block = game.add(new GameObject(
      Math.random() * game.width,
      0,
      '■'
    ));
    block.setVelocity(0, 0.5);
  }
  
  // Проверяем столкновения
  game.getAll().forEach(obj => {
    if (obj !== hero && hero.collidesWith(obj)) {
      game.score += 5;
      obj.active = false;
    }
  });
});
```

### 4️⃣ Простая змейка

```javascript
const { Game, GameObject } = require('./engine');

const game = new Game(40, 15, 5);

// Змейка - массив сегментов
let snake = [
  new GameObject(20, 10, '◇'),
  new GameObject(19, 10, '○'),
  new GameObject(18, 10, '○')
];
snake.forEach(seg => game.add(seg));

let food = game.add(new GameObject(10, 5, '●'));
let direction = { x: 1, y: 0 };

game.start(() => {
  const head = snake[0];
  head.x += direction.x;
  head.y += direction.y;
  
  // Проверяем столкновение с едой
  if (head.collidesWith(food)) {
    game.score += 10;
    // Добавляем новый сегмент
    const tail = snake[snake.length - 1];
    const newSeg = new GameObject(tail.x, tail.y, '○');
    snake.push(newSeg);
    game.add(newSeg);
  }
});
```

## 🎨 Символы для использования

```
█ ■ ○ ● ◇ E @ * + - | / \ ~ ?
```

## ⚙️ Как работает игровой цикл

```
1. updateCallback() - твоя логика
   ↓
2. Обновляют позиции все объекты (x += vx, y += vy)
   ↓
3. Удаляют неактивные объекты (active == false)
   ↓
4. render() - рисуют кадр на консоль
   ↓
5. frame++ - счётчик фреймов
   ↓
6. ждут 1/FPS секунд
   ↓
РЕПИТ (back to 1)
```

## 📋 Структура файлов

```
console-2d-engine/
├── engine.js      # Основной движок (100 строк)
├── examples.js    # 4 готовые игры
├── tutorial.js    # Интерактивное обучение
├── README.md      # Эта документация
└── package.json   # Конфиг проекта
```

## 🎯 Идеи для своих игр

- [ ] **Пинг-понг** - два игрока отбивают мяч
- [ ] **Лабиринт** - лабиринт и враги
- [ ] **Тетрис** - падающие фигуры
- [ ] **Flappy Bird** - прыгаем между стенами
- [ ] **Roguelike dungeon** - случайный подземелье
- [ ] **Таймер игра** - соберись в отведённое время
- [ ] **Жизненный цикл** - симуляция экосистемы

## 🐛 Troubleshooting

### Объект не видно
- Проверь координаты: x должен быть 0 до width-1, y от 0 до height-1
- Проверь char - используй символы типа █, ■, ○ и т.д.

### Объект не двигается
- Вызвал ли ты `setVelocity()`?
- Объект обновляется в game.start() автоматически

### Игра работает очень медленно
- Увеличь FPS (4-й параметр Game): `new Game(40, 20, 20)` для 20 FPS
- Не создавай слишком много объектов за раз

## 📖 Дальнейшее развитие

Хочешь расширить движок?

- Добавь `rotation` для поворота объектов
- Добавь `scale` для размера
- Добавь `color` для цветов (ANSI codes)
- Добавь `onCollide()` callback
- Добавь звуковые эффекты через `beep`
- Добавь сохранение рекордов

## 🤝 Контрибьют

Найшёл баг? Создавай Issue!

Хочешь улучшить? Отправляй PR!

## 📄 Лицензия

MIT - используй как угодно!

---

**Created with ❤️ for game developers of all skill levels**

> "Лучший способ научиться - это сделать что-то." © Паша Уткин, вероятно