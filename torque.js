// Module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

// Create engine
var engine = Engine.create();
var world = engine.world;

// Create renderer
var render = Render.create({
    element: document.getElementById('canvas-container'), // Better to use specific container
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false, // Better visualization
        showVelocity: true,
        background: '#f5f5f5'
    }
});

// Create runner
var runner = Runner.create();

// Add bodies
Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);

// Add ramps and boxes
Composite.add(world, [
    Bodies.rectangle(300, 180, 700, 20, { 
        isStatic: true, 
        angle: Math.PI * 0.06, 
        render: { fillStyle: '#060a19' } 
    }),
    Bodies.rectangle(300, 70, 40, 40, { friction: 0.001 })
]);

Composite.add(world, [
    Bodies.rectangle(300, 350, 700, 20, { 
        isStatic: true, 
        angle: Math.PI * 0.06, 
        render: { fillStyle: '#060a19' } 
    }),
    Bodies.rectangle(300, 250, 40, 40, { friction: 0.0005 })
]);

Composite.add(world, [
    Bodies.rectangle(300, 520, 700, 20, { 
        isStatic: true, 
        angle: Math.PI * 0.06, 
        render: { fillStyle: '#060a19' } 
    }),
    Bodies.rectangle(300, 430, 40, 40, { friction: 0 })
]);

// Add mouse control
var mouse = Mouse.create(render.canvas);
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(world, mouseConstraint);
render.mouse = mouse;

// Set viewport
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

// Run everything
Render.run(render);
Runner.run(runner, engine);