// Matter.js module aliases
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

// Create engine & world
const engine = Engine.create();
const world = engine.world;

// Set up canvas inside the correct container
const canvasContainer = document.getElementById('canvas-container');
const render = Render.create({
    element: canvasContainer,
    engine: engine,
    options: {
        width: 400,
        height: 500,
        wireframes: false,
        background: '#e3f2fd'
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// **Table Dimensions**
const tableX = 50;
const tableY = 100;
const tableWidth = 300;
const tableHeight = 350;
const columnWidth = tableWidth / 2;

// **Create Table (with Borders)**
Composite.add(world, [
    Bodies.rectangle(tableX + tableWidth / 2, tableY + tableHeight, tableWidth, 10, { isStatic: true, render: { fillStyle: "#000" } }), // Bottom
    Bodies.rectangle(tableX, tableY + tableHeight / 2, 10, tableHeight, { isStatic: true, render: { fillStyle: "#000" } }), // Left
    Bodies.rectangle(tableX + tableWidth, tableY + tableHeight / 2, 10, tableHeight, { isStatic: true, render: { fillStyle: "#000" } }), // Right
    Bodies.rectangle(tableX + columnWidth, tableY + tableHeight / 2, 10, tableHeight, { isStatic: true, render: { fillStyle: "#000" } }) // Middle divider
]);

// **Ball Counters**
function createCounter(xPos) {
    let text = document.createElement("div");
    text.style.position = "absolute";
    text.style.left = `${xPos}px`;
    text.style.top = `20px`;
    text.style.fontSize = "20px";
    text.style.fontWeight = "bold";
    text.style.color = "#000";
    text.innerText = "0"; // Default count
    document.body.appendChild(text);
    return text;
}

let leftCounter = createCounter(tableX + columnWidth / 2 - 10);
let rightCounter = createCounter(tableX + (3 * columnWidth) / 2 - 10);

// **Function to Add a Ball**
function addBall(x, color) {
    let ball = Bodies.circle(x, tableY + 20, 15, { // Balls start slightly above the table
        restitution: 0.5,  
        friction: 0.05,
        density: 0.01,
        render: { fillStyle: color }
    });
    Composite.add(world, ball);
}

// **Create Buttons**
function createButton(label, xPos, color, column) {
    let button = document.createElement("button");
    button.innerText = label;
    button.style.position = "absolute";
    button.style.left = `${xPos}px`;
    button.style.top = `${tableY + tableHeight + 30}px`;
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.background = color;
    button.style.color = "#fff";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => addBall(column, color));
    document.body.appendChild(button);
}

// **Add Buttons**
createButton("Add Blue Ball", tableX + columnWidth / 2 - 50, "#2196f3", tableX + columnWidth / 2);
createButton("Add Red Ball", tableX + (3 * columnWidth) / 2 - 50, "#f44336", tableX + (3 * columnWidth) / 2);

// **Update Ball Counts**
function updateBallCounts() {
    let leftCount = 0;
    let rightCount = 0;

    Composite.allBodies(world).forEach(body => {
        if (body.label === "Circle Body") { 
            if (body.position.x < tableX + columnWidth) {
                leftCount++;
            } else {
                rightCount++;
            }
        }
    });

    leftCounter.innerText = leftCount.toString();
    rightCounter.innerText = rightCount.toString();
}

// **Event Listener to Update Counters**
Events.on(engine, 'afterUpdate', updateBallCounts);

// **Enable Mouse Dragging**
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
