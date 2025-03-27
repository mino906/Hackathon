// Module aliases
const { Engine, Render, Runner, Bodies, Composite, Constraint, Mouse, MouseConstraint, Events } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
    element: document.getElementById('canvas-container'),
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f5f5f5'
    }
});

Render.run(render);

// Create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Function to create Newton's Cradle
function newtonsCradle(xx, yy, number, size, length) {
    const cradle = Composite.create({ label: "Newtons Cradle" });

    for (let i = 0; i < number; i++) {
        const separation = 1.9;
        const circle = Bodies.circle(xx + i * (size * separation), yy + length, size, {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            slop: size * 0.02,
            label: "Circle Body",  // FIX: Assign label
            render: { fillStyle: getRandomColor() } // Initial random color
        });

        const constraint = Constraint.create({
            pointA: { x: xx + i * (size * separation), y: yy },
            bodyB: circle
        });

        Composite.add(cradle, [circle, constraint]);
    }

    return cradle;
}

// Create two Newton's Cradles
const cradle1 = newtonsCradle(280, 100, 5, 30, 200);
Composite.add(world, cradle1);
Matter.Body.translate(cradle1.bodies[0], { x: -180, y: -100 });

const cradle2 = newtonsCradle(280, 380, 7, 20, 140);
Composite.add(world, cradle2);
Matter.Body.translate(cradle2.bodies[0], { x: -140, y: -100 });

// Function to generate a random color
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Collision event to change color on contact
Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach(pair => {
        if (pair.bodyA.label === "Circle Body") {
            pair.bodyA.render.fillStyle = getRandomColor();
        }
        if (pair.bodyB.label === "Circle Body") {
            pair.bodyB.render.fillStyle = getRandomColor();
        }
    });
});

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
