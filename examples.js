// 🎮 ПРИМЕРЫ ИГРЫ НА ПРОСТОМ ДВИЖКЕ
const { Game, GameObject } = require('./engine');

// ============================================
// ПРИМЕР 1: Бегающий квадрат
// ============================================
function example1_RunningSquare() {
  console.log('\n🟢 ПРИМЕР 1: Бегающий квадрат');
  console.log('Квадрат бегает туда-сюда\n');

  const game = new Game(40, 10, 5);
  const hero = game.add(new GameObject(20, 5, '█'));
  hero.setVelocity(1, 0); // движется вправо

  game.start(() => {
    // Отскакиваем от стен
    if (hero.x <= 0 || hero.x >= game.width - 1) {
      hero.vx *= -1; // переворачиваем направление
    }
  });

  // Остановить через 10 секунд
  setTimeout(() => {
    game.stop();
    console.log('✅ Пример 1 завершён!\n');
    example2_CatchEnemy();
  }, 10000);
}

// ============================================
// ПРИМЕР 2: Ловля врага (система очков)
// ============================================
function example2_CatchEnemy() {
  console.log('\n🟡 ПРИМЕР 2: Ловля врага');
  console.log('Ловите врага (E) своим квадратом (█)\n');

  const game = new Game(40, 10, 5);
  const hero = game.add(new GameObject(20, 5, '█'));
  const enemy = game.add(new GameObject(10, 5, 'E'));

  let heroDirection = 1;

  game.start(() => {
    // Управление героем: меняет направление случайно
    if (Math.random() < 0.1) {
      heroDirection *= -1;
    }
    hero.vx = heroDirection;

    // Враг движется туда-сюда
    if (enemy.x <= 0 || enemy.x >= game.width - 1) {
      enemy.vx *= -1;
    }

    // Проверяем столкновение
    if (hero.collidesWith(enemy)) {
      game.score += 10;
      // Телепортируем врага в случайное место
      enemy.x = Math.random() * game.width;
      enemy.y = Math.random() * game.height;
    }
  });

  setTimeout(() => {
    game.stop();
    console.log(`✅ Пример 2 завершён! Финальный счёт: ${game.score}\n`);
    example3_FallingBlocks();
  }, 15000);
}

// ============================================
// ПРИМЕР 3: Падающие блоки
// ============================================
function example3_FallingBlocks() {
  console.log('\n🔴 ПРИМЕР 3: Падающие блоки');
  console.log('Ловите падающие блоки (■) своим квадратом (█)\n');

  const game = new Game(40, 15, 8);
  const hero = game.add(new GameObject(20, 13, '█'));
  let lastBlockTime = 0;

  game.start(() => {
    // Управление: герой следует за мышью/случайно
    if (Math.random() < 0.2) {
      hero.vx = (Math.random() > 0.5) ? 1 : -1;
    }

    // Стены
    if (hero.x <= 0) hero.x = 0;
    if (hero.x >= game.width - 1) hero.x = game.width - 1;

    // Генерируем падающие блоки
    if (game.frame - lastBlockTime > 8) {
      const block = game.add(new GameObject(
        Math.random() * game.width,
        0,
        '■'
      ));
      block.setVelocity(0, 0.5);
      lastBlockTime = game.frame;
    }

    // Проверяем столкновения
    game.objects.forEach(obj => {
      if (obj !== hero && hero.collidesWith(obj)) {
        game.score += 5;
        obj.active = false; // удаляем блок
      }
      // Удаляем блоки, упавшие вниз
      if (obj.y > game.height) {
        obj.active = false;
      }
    });
  });

  setTimeout(() => {
    game.stop();
    console.log(`✅ Пример 3 завершён! Финальный счёт: ${game.score}\n`);
    example4_SimpleSnake();
  }, 20000);
}

// ============================================
// ПРИМЕР 4: Простая змейка
// ============================================
function example4_SimpleSnake() {
  console.log('\n🟣 ПРИМЕР 4: Простая змейка');
  console.log('Змейка (◇) ест еду (●) и растёт\n');

  const game = new Game(40, 15, 5);

  // Змейка - это массив сегментов
  let snake = [
    new GameObject(20, 10, '◇'),
    new GameObject(19, 10, '○'),
    new GameObject(18, 10, '○')
  ];
  snake.forEach(seg => game.add(seg));

  let food = game.add(new GameObject(
    Math.random() * game.width,
    Math.random() * game.height,
    '●'
  ));

  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };

  game.start(() => {
    // Случайно меняем направление
    if (Math.random() < 0.15) {
      const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];
      nextDirection = directions[Math.floor(Math.random() * directions.length)];
    }

    // Проверяем, что не идём в противоположное направление
    if (!(nextDirection.x === -direction.x && nextDirection.y === -direction.y)) {
      direction = nextDirection;
    }

    // Двигаем голову
    const head = snake[0];
    head.x += direction.x;
    head.y += direction.y;

    // Обёртывание (выходим слева - появляемся справа)
    if (head.x < 0) head.x = game.width - 1;
    if (head.x >= game.width) head.x = 0;
    if (head.y < 0) head.y = game.height - 1;
    if (head.y >= game.height) head.y = 0;

    // Проверяем столкновение с едой
    if (head.collidesWith(food)) {
      game.score += 10;
      // Добавляем новый сегмент
      const tail = snake[snake.length - 1];
      const newSegment = new GameObject(tail.x, tail.y, '○');
      snake.push(newSegment);
      game.add(newSegment);

      // Новая еда
      game.remove(food);
      food = game.add(new GameObject(
        Math.random() * game.width,
        Math.random() * game.height,
        '●'
      ));
    }

    // Двигаем хвост
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }
  });

  setTimeout(() => {
    game.stop();
    console.log(`✅ Пример 4 завершён! Финальный счёт: ${game.score}\n`);
    console.log('\n🎉 ВСЕ ПРИМЕРЫ ЗАВЕРШЕНЫ! Теперь создавай СВОЮ игру!');
  }, 25000);
}

// ============================================
// ЗАПУСК ВСЕХ ПРИМЕРОВ
// ============================================
if (require.main === module) {
  console.log('\n' + '='.repeat(50));
  console.log('🎮 SUPER SIMPLE 2D Console Engine - ПРИМЕРЫ');
  console.log('='.repeat(50));
  example1_RunningSquare();
}

module.exports = { example1_RunningSquare, example2_CatchEnemy, example3_FallingBlocks, example4_SimpleSnake };