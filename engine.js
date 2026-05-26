/**
 * 🎮 SUPER SIMPLE 2D Console Engine
 * Даже Паша Уткин из 1 класса может это использовать!
 */

class Game {
  constructor(width = 40, height = 20) {
    this.width = width;
    this.height = height;
    this.canvas = Array(height).fill(null).map(() => Array(width).fill(' '));
    this.objects = [];
    this.running = true;
    this.gameSpeed = 100; // ms между кадрами
  }

  // Добавить объект в игру
  add(obj) {
    this.objects.push(obj);
    return obj;
  }

  // Нарисовать точку на экране
  setPixel(x, y, char) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.canvas[Math.floor(y)][Math.floor(x)] = char;
    }
  }

  // Очистить весь экран
  clear() {
    this.canvas = Array(this.height).fill(null).map(() => Array(this.width).fill(' '));
  }

  // Главный цикл игры
  async start(updateFn) {
    while (this.running) {
      this.clear();

      // Обновляем все объекты
      this.objects.forEach(obj => {
        if (obj.update) obj.update(this);
      });

      // Вызываем функцию обновления игры
      if (updateFn) updateFn(this);

      // Рисуем все объекты
      this.objects.forEach(obj => {
        if (obj.render) obj.render(this);
      });

      // Выводим на экран
      this.render();

      // Ждём перед следующим кадром
      await new Promise(r => setTimeout(r, this.gameSpeed));
    }
  }

  // Вывести на экран
  render() {
    console.clear();
    let output = '';
    output += '┌' + '─'.repeat(this.width) + '┐\n';
    for (let row of this.canvas) {
      output += '│' + row.join('') + '│\n';
    }
    output += '└' + '─'.repeat(this.width) + '┘\n';
    console.log(output);
  }

  // Остановить игру
  stop() {
    this.running = false;
  }
}

// Простой игровой объект
class GameObject {
  constructor(x, y, char, name = 'object') {
    this.x = x;
    this.y = y;
    this.char = char;
    this.name = name;
    this.vx = 0; // скорость по X
    this.vy = 0; // скорость по Y
  }

  // Нарисовать себя
  render(game) {
    game.setPixel(this.x, this.y, this.char);
  }

  // Обновить позицию (переопределить в подклассах)
  update(game) {
    this.x += this.vx;
    this.y += this.vy;
  }

  // Проверить столкновение с другим объектом
  collidesWith(other) {
    return Math.abs(this.x - other.x) < 1 && Math.abs(this.y - other.y) < 1;
  }

  // Переместить объект
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  // Установить скорость
  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }
}

// Экспортируем для использования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Game, GameObject };
}
