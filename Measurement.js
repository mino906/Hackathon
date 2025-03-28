// Module aliases
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
    element: document.getElementById('canvas-container'),
    engine: engine,
    options: {
        width: 900,
        height: 800,
        wireframes: false,
        background: '#f5f5f5'
    }
});

Render.run(render);

// Create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
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

// Add walls
const walls = [
    Bodies.rectangle(400, 0, 80, 5, { isStatic: true, render: { fillStyle: 'black' } }), // Top
    Bodies.rectangle(400, 600, 80, 5, { isStatic: true, render: { fillStyle: 'black' } }), // Bottom
    Bodies.rectangle(0, 300, 5, 60, { isStatic: true, render: { fillStyle: 'black' } }), // Left
    Bodies.rectangle(800, 300, 5, 60, { isStatic: true, render: { fillStyle: 'black' } })  // Right
];
Composite.add(world, walls);

// Add navigation buttons
document.body.insertAdjacentHTML('beforeend', `
    <button id="prev-shape" style="position: absolute; top: 10px; left: 50px;">← Prev</button>
    <button id="next-shape" style="position: absolute; top: 10px; left: 120px;">Next →</button>
    <button id="add-ruler" style="position: absolute; top: 10px; left: 200px;">Add Ruler</button>
`);

// Shape list
const shapes = [
    Bodies.rectangle(400, 300, 250, 250, { isStatic: true, render: { fillStyle: 'red' } }),
    Bodies.circle(400, 300, 75, { isStatic: true, render: { fillStyle: 'blue' } }),
    Bodies.rectangle(400, 300, 350, 150, { isStatic: true, render: { fillStyle: 'green' } }),
    Bodies.polygon(400, 300, 5, 100, { isStatic: true, render: { fillStyle: 'purple' } }),
    Bodies.trapezoid(400, 300, 200, 150, 0.5, { isStatic: true, render: { fillStyle: 'orange' } })
];

let currentShapeIndex = 0;
Composite.add(world, shapes[currentShapeIndex]);

// Navigation functions
document.getElementById('next-shape').addEventListener('click', () => {
    if (currentShapeIndex < shapes.length - 1) {
        Composite.remove(world, shapes[currentShapeIndex]);
        currentShapeIndex++;
        Composite.add(world, shapes[currentShapeIndex]);
    }
});

document.getElementById('prev-shape').addEventListener('click', () => {
    if (currentShapeIndex > 0) {
        Composite.remove(world, shapes[currentShapeIndex]);
        currentShapeIndex--;
        Composite.add(world, shapes[currentShapeIndex]);
    }
});

document.getElementById('add-ruler').addEventListener('click', () => {
    const newRuler = Bodies.rectangle(400, 500, 700, 40, {
        isStatic: false,
        frictionAir: 0.2,
        render: {
            sprite: {
                texture: 'https://cdn.prod.website-files.com/67e4f6a4271093848bb8b158/67e61d95a6399eaf126c3adc_image-removebg-preview%20(23).png',
                xScale: 0.4,
                yScale: 0.4,
                restitution: 0,
                friction: 0
            }
        }
    });
    Composite.add(world, newRuler);
});

// Magnet effect
Events.on(engine, 'beforeUpdate', () => {
    Composite.allBodies(world).forEach(body => {
        if (body.label === 'Rectangle Body' && body.render.sprite.texture) { // Checking for rulers
            shapes.forEach(shape => {
                const dx = body.position.x - shape.position.x;
                const dy = body.position.y - shape.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    Matter.Body.translate(body, { x: -dx * 0.1, y: -dy * 0.1 });
                }
            });
        }
    });
});
