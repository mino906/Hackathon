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
    Bodies.rectangle(400, 300, 20, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
]);

// Add bodies
Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    
    // Add a sprite body
    Bodies.rectangle(400, 390, 80, 200, {isStatic: true,
        render: {
            sprite: {
                texture: 'https://cdn.prod.website-files.com/67e4f6a4271093848bb8b158/67e4f8ad4edb30c13eb5d4db_image-removebg-preview%20(19).png',       
                xScale: 0.20,
                yScale: 0.99,
    
        },
        }
    })
]);


// Define the right-side wall as a variable
var rightWall = Bodies.rectangle(445, 300, 5, 600, { isStatic: true });

// Add the wall to the world
Composite.add(world, [rightWall]);

// Collision Event: Remove hackers when they touch the right wall
Matter.Events.on(engine, "collisionStart", function(event) {
    event.pairs.forEach(function(pair) {
        if (pair.bodyA === rightWall || pair.bodyB === rightWall) {
            var hackerToRemove = pair.bodyA === rightWall ? pair.bodyB : pair.bodyA;
            Composite.remove(world, hackerToRemove); // Remove hacker icon
        }
    });
});

// Add bodies
Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    
    // Add a sprite body
    Bodies.rectangle(400, 220, 80, 200, {isStatic: true,
        render: {
            sprite: {
                texture: 'https://cdn.prod.website-files.com/67e4f6a4271093848bb8b158/67e4f8ad4edb30c13eb5d4db_image-removebg-preview%20(19).png',       
                xScale: 0.20,
                yScale: 0.99,
    
        },
        }
    })
]);

var hackerIcons = [];

// Listen for mouse click to create hacker icons
document.addEventListener("mousedown", function (event) {
    var xPosition = event.clientX;
    var yPosition = event.clientY;

    // Ensure hackers only spawn on the right side (x > 400)
    if (xPosition < 400) return; 

    var hackerIcon = Bodies.circle(xPosition, yPosition, 20, {
        restitution: 0.8,
        friction: 0.1,
        density: 0.01,
        render: {
            sprite: {
                texture: 'https://cdn.prod.website-files.com/67e4f6a4271093848bb8b158/67e4fa5fa963f7c76fb43d5e_image-removebg-preview%20(20).png',
                xScale: 0.3,
                yScale: 0.3,
                xOffset: 0,
                yOffset: 0
            }
        }
    });

    // Add icon to the world and the array
    Composite.add(world, hackerIcon);
    hackerIcons.push(hackerIcon);
});

// Restrict movement to only the right side
Matter.Events.on(engine, "beforeUpdate", function () {
    hackerIcons.forEach(function (icon) {
        if (icon.position.x < 400) { // If icon moves left, push it back
            Matter.Body.setPosition(icon, { x: 400, y: icon.position.y });
            Matter.Body.setVelocity(icon, { x: 0, y: icon.velocity.y });
        }
    });
});


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

//adding data icon
Composite.add(world, [
    // Add a sprite body
    Bodies.rectangle(400, 390, 80, 200, {
        render: {
            sprite: {
                texture: 'https://cdn.prod.website-files.com/67e4f6a4271093848bb8b158/67e520eeefcc04f07eac36c6_image-removebg-preview%20(22).png',       
                xScale: 0.300,
                yScale: 0.300,
    
        },
        }
    })
]);
// Ensure gravity is enabled in Matter.js engine
engine.world.gravity.y = 1; // Adjust gravity strength if needed


//add administration icon
Composite.add(world, [
    
    // Add a sprite body
    Bodies.rectangle(400, 390, 80, 200, {
        render: {
            sprite: {
                texture: 'https://cdn.prod.website-files.com/67e4f6a4271093848bb8b158/67e5209e40a0251f89adb50f_image-removebg-preview%20(21).png',       
                xScale: 0.600,
                yScale: 0.600,
    
        },
        }
    })
]);





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