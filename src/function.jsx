export function getState(snake, fruit, direction) {
    const head = snake[0];
    const pointToLeft = { x: head.x - 1, y: head.y };
    const pointToRight = { x: head.x + 1, y: head.y };
    const pointToUp = { x: head.x, y: head.y - 1 };
    const pointToDown = { x: head.x, y: head.y + 1 };
  
    return [
      // Distance from fruit
      head.x - fruit.x,
      head.y - fruit.y,
      // Immediate danger
      isDanger(pointToLeft, snake),
      isDanger(pointToRight, snake),
      isDanger(pointToUp, snake),
      isDanger(pointToDown, snake),
      // Current direction
      direction === 'LEFT' ? 1 : 0,
      direction === 'RIGHT' ? 1 : 0,
      direction === 'UP' ? 1 : 0,
      direction === 'DOWN' ? 1 : 0
    ];
  }
  
  export function isDanger(point, snake) {
    return (
      point.x < 0 || point.x >= 20 || point.y < 0 || point.y >= 20 ||
      snake.some(segment => segment.x === point.x && segment.y === point.y)
    ) ? 1 : 0;
  }
  