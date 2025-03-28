// Module aliases
const { Engine, Render, Runner, Bodies, Composite, Composites, Constraint, Mouse, MouseConstraint } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
    element: document.getElementById('canvas-container'),
    engine: engine,
    options: {
        width: 900,
        height: 700,
        wireframes: false,
        background: '#f5f5f5'
    }
});
Render.run(render);

// Create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Function to generate a random color
function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Create a stack of boxes with random colors
const rows = 10;
const yy = 600 - 25 - 40 * rows;
let stack = Composites.stack(400, yy, 5, rows, 0, 0, (x, y) => {
    return Bodies.rectangle(x, y, 40, 40, {
        render: { fillStyle: getRandomColor() }
    });
});

// Add objects to world
Composite.add(world, [
    stack,
    // Walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 5, { isStatic: true }),
    Bodies.rectangle(800, 300, 5, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 5, 600, { isStatic: true })
]);

// Create wrecking ball
let ball = Bodies.circle(100, 400, 50, { density: 0.04, frictionAir: 0.005 });
Composite.add(world, ball);

// Add constraint (rope)
Composite.add(world, Constraint.create({
    pointA: { x: 300, y: 20 },
    bodyB: ball
}));

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.5,
        render: { visible: false }
    }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// Adjust viewport
Render.lookAt(render, {
    min: { x: 0, y: 50 },
    max: { x: 800, y: 600 }
});

// UI Controls
const controlsContainer = document.createElement('div');
controlsContainer.style.position = 'absolute';
controlsContainer.style.top = '10px';
controlsContainer.style.left = '10px';
controlsContainer.style.zIndex = '1000';

document.body.appendChild(controlsContainer);

// Friction Control Buttons
const increaseFrictionButton = document.createElement('button');
increaseFrictionButton.innerText = 'Increase Friction';
increaseFrictionButton.onclick = () => {
    ball.frictionAir = Math.min(ball.frictionAir + 0.01, 1);
};
controlsContainer.appendChild(increaseFrictionButton);

const decreaseFrictionButton = document.createElement('button');
decreaseFrictionButton.innerText = 'Decrease Friction';
decreaseFrictionButton.onclick = () => {
    ball.frictionAir = Math.max(ball.frictionAir - 0.01, 0);
};
controlsContainer.appendChild(decreaseFrictionButton);

// Arrange Blocks Button
const arrangeBlocksButton = document.createElement('button');
arrangeBlocksButton.innerText = 'Arrange Blocks';
arrangeBlocksButton.onclick = () => {
    Composite.remove(world, stack);
    stack = Composites.stack(400, yy, 5, rows, 0, 0, (x, y) => {
        return Bodies.rectangle(x, y, 40, 40, {
            render: { fillStyle: getRandomColor() }
        });
    });
    Composite.add(world, stack);
};
controlsContainer.appendChild(arrangeBlocksButton);
