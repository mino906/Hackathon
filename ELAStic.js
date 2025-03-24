document.addEventListener('DOMContentLoaded', function () {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies;
    Body = Matter.Body;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    //gravity
    engine.gravity.x = 0;
    engine.gravity.y = 0;


    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false
        }
    });

    Render.run(render);


    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);


    // create balls using a loop
    var balls = [];
    var numBalls = 100; // Number of balls to create
    for (var i = 0; i < numBalls; i++) {
        var ball = Bodies.circle(20 + i * 40, 40, 20, {
            frictionAir: 0,
            restitution: 1,
            render: {
                fillStyle: 'blue'
            }
        });
        // Set initial velocity for each ball
        Body.setVelocity(ball, {
            x: (Math.random() - 1) * 10,
            y: (Math.random() - 1) * 10
        });

        balls.push(ball); // Add the ball to the array
    }

    // add balls to the world
    Composite.add(world, balls);


    // create walls
    var walls = [
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true, restitution: 1 }), // top wall
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true, restitution: 1 }), // bottom wall
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true, restitution: 1 }), // right wall
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true, restitution: 1 }) // left wall
    ];
    Composite.add(world, walls);


    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // Function to update ball properties
    function updateBallProperties() {
        var restitution = parseFloat(document.getElementById('restitution').value);
        var friction = parseFloat(document.getElementById('friction').value);
        var frictionAir = parseFloat(document.getElementById('frictionAir').value);

        balls.forEach(function (ball) {
            ball.restitution = restitution;
            ball.friction = friction;
            ball.frictionAir = frictionAir;
        });
        // Update displayed values
        document.getElementById('restitutionValue').textContent = restitution;
        document.getElementById('frictionValue').textContent = friction;
        document.getElementById('frictionAirValue').textContent = frictionAir;
    }

    // Add event listeners to sliders
    document.getElementById('restitution').oninput = updateBallProperties;
    document.getElementById('friction').oninput = updateBallProperties;
    document.getElementById('frictionAir').oninput = updateBallProperties;

    // Periodically apply a small force to keep balls moving
    Matter.Events.on(engine, 'beforeUpdate', function () {
        balls.forEach(function (ball) {
            if (ball.speed < 0.1) { // If the ball is almost stopped
                Body.applyForce(ball, ball.position, {
                    x: (Math.random() - 0.5) * 0.01, // Small random force
                    y: (Math.random() - 0.5) * 0.01
                });
            }
        });
    });
});




// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});


