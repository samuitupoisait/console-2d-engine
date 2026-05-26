// 📚 ИНТЕРАКТИВНОЕ ОБУЧЕНИЕ
const { Game, GameObject } = require('./engine');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function tutorial() {
  console.log(`
╔════════════════════════════════════════╗
║  📚 ОБУЧЕНИЕ: Создавай свою игру!     ║
╚════════════════════════════════════════╝
`);

  console.log('Шаг 1️⃣: Создание объекта');
  console.log('────────────────────────────');
  console.log(`
Каждый объект в игре - это GameObject:

const hero = new GameObject(20, 10, '█');
  ↑        ↑   ↑       ↑    ↑     ↑
имя     класс  x       y   сим   волл
`);
  
  await ask('\nНажми Enter чтобы продолжить...');

  console.log('\nШаг 2️⃣: Создание игры');
  console.log('────────────────────────────');
  console.log(`
Игра - это контейнер для всех объектов:

const game = new Game(40, 20);
               ↑   ↑   ↑
              ширина  высота
`);
  
  await ask('\nНажми Enter чтобы продолжить...');

  console.log('\nШаг 3️⃣: Добавление объекта');
  console.log('────────────────────────────');
  console.log(`
Добавляем объект на сцену:

game.add(hero);
`);
  
  await ask('\nНажми Enter чтобы продолжить...');

  console.log('\nШаг 4️⃣: Установка скорости');
  console.log('────────────────────────────');
  console.log(`
Объект может двигаться:

hero.setVelocity(1, 0);  // вправо
hero.setVelocity(-1, 0); // влево
hero.setVelocity(0, 1);  // вниз
hero.setVelocity(0, -1); // вверх
hero.setVelocity(1, 1);  // вправо-вниз
`);
  
  await ask('\nНажми Enter чтобы продолжить...');

  console.log('\nШаг 5️⃣: Игровой цикл');
  console.log('────────────────────────────');
  console.log(`
Основной цикл - это МОЗГ игры:

game.start(() => {
  // вся логика здесь
  hero.x += 1;  // двигаем героя
  if (hero.x > 40) hero.x = 0;  // обёртываем
});

Эта функция вызывается каждый фрейм!
`);
  
  await ask('\nНажми Enter чтобы продолжить...');

  console.log('\nШаг 6️⃣: Столкновения');
  console.log('────────────────────────────');
  console.log(`
Проверяем столкновение:

if (hero.collidesWith(enemy)) {
  game.score += 10;
  console.log('БУМ! Столкновение!');
}
`);
  
  await ask('\nНажми Enter чтобы продолжить...');

  console.log('\n\nТеперь давай создадим простую игру вместе!');
  console.log('─'.repeat(40));
  console.log('\n🎮 ТВОЯ ПЕРВАЯ ИГРА: Собирать монеты\n');

  console.log('Вот готовый код:\n');
  console.log(`
const { Game, GameObject } = require('./engine');

const game = new Game(40, 20, 5);
const hero = game.add(new GameObject(20, 10, '█'));
const coin = game.add(new GameObject(10, 5, '●'));

game.start(() => {
  // Герой следит за монетой
  if (Math.random() < 0.3) {
    hero.vx = (coin.x > hero.x) ? 1 : -1;
  }

  // Проверяем столкновение
  if (hero.collidesWith(coin)) {
    game.score += 1;
    coin.x = Math.random() * game.width;
    coin.y = Math.random() * game.height;
  }
});
`);

  await ask('\nНажми Enter чтобы запустить эту игру...');

  // Запускаем демо
  const game = new Game(40, 20, 5);
  const hero = game.add(new GameObject(20, 10, '█'));
  const coin = game.add(new GameObject(10, 5, '●'));

  game.start(() => {
    if (Math.random() < 0.3) {
      hero.vx = (coin.x > hero.x) ? 1 : -1;
    }

    if (hero.collidesWith(coin)) {
      game.score += 1;
      coin.x = Math.random() * game.width;
      coin.y = Math.random() * game.height;
    }
  });

  await ask('\n(Игра работает! Нажми Enter чтобы остановить)...');
  game.stop();

  console.log(`
\n✅ Окончательный счёт: ${game.score}\n`);
  console.log('\n🎉 МОЛОДЕЦ! Ты создал свою первую игру!');
  console.log('\nТеперь попробуй модифицировать:');
  console.log('  • Добавить несколько монет');
  console.log('  • Сделать врага вместо монеты');
  console.log('  • Добавить стены');
  console.log('  • Создать систему жизней\n');
  console.log('📖 Смотри примеры в examples.js!\n');

  rl.close();
}

if (require.main === module) {
  tutorial().catch(console.error);
}

module.exports = { tutorial };