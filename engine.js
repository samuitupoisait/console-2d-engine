// 🎮 SUPER SIMPLE 2D Console Engine
// Настолько простой, что даже Паша Уткин сделает игру!

class GameObject {
  constructor(x, y, char = '█') {
    this.x = x;          // позиция X
    this.y = y;          // позиция Y
    this.char = char;    // символ на экране
    this.vx = 0;         // скорость по X
    this.vy = 0;         // скорость по Y
    this.active = true;  // активен ли объект
  }

  // Установить скорость
  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  // Обновить позицию каждый фрейм
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  // Проверить столкновение с другим объектом
  collidesWith(other) {
    return Math.abs(this.x - other.x) < 1 && Math.abs(this.y - other.y) < 1;
  }
}

class Game {
  constructor(width, height, fps = 10) {
    this.width = width;   // ширина консоли
    this.height = height; // высота консоли
    this.fps = fps;       // кадры в секунду
    this.objects = [];    // все объекты на сцене
    this.frame = 0;       // номер текущего фрейма
    this.score = 0;       // очки
    this.gameLoop = null; // ID интервала
  }

  // Добавить объект на сцену
  add(gameObject) {
    this.objects.push(gameObject);
    return gameObject;
  }

  // Удалить объект со сцены
  remove(gameObject) {
    const index = this.objects.indexOf(gameObject);
    if (index > -1) this.objects.splice(index, 1);
  }

  // Получить объект по индексу
  get(index) {
    return this.objects[index];
  }

  // Получить ВСЕ объекты
  getAll() {
    return this.objects;
  }

  // Очистить консоль
  clear() {
    console.clear();
  }

  // Нарисовать игру
  render() {
    // Создаём сетку
    let grid = [];
    for (let y = 0; y < this.height; y++) {
      let row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(' ');
      }
      grid.push(row);
    }

    // Рисуем объекты
    this.objects.forEach(obj => {
      const x = Math.round(obj.x);
      const y = Math.round(obj.y);
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        grid[y][x] = obj.char;
      }
    });

    // Выводим на экран
    this.clear();
    console.log('🎮 Frame: ' + this.frame + ' | Score: ' + this.score);
    grid.forEach(row => console.log(row.join('')));
  }

  // Главный игровой цикл
  start(updateCallback) {
    this.gameLoop = setInterval(() => {
      // 1. Обновляем логику
      if (updateCallback) updateCallback(this);

      // 2. Обновляем позиции объектов
      this.objects.forEach(obj => obj.update());

      // 3. Удаляем неактивные объекты
      this.objects = this.objects.filter(obj => obj.active);

      // 4. Рисуем
      this.render();

      // 5. Считаем фреймы
      this.frame++;
    }, 1000 / this.fps);
  }

  // Остановить игру
  stop() {
    if (this.gameLoop) clearInterval(this.gameLoop);
  }
}

module.exports = { Game, GameObject };