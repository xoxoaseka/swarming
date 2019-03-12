let flock;

let text;

// let dist = 25;

function setup() {
  // text = createP("Drag the mouse to generate new boids.");
  // text.position(10, 365);

  createCanvas(1200, 1200);

  flock1 = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let b1 = new Boid(-width / 2, height / 2);
    flock1.addBoid(b1);
  }
  flock2 = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 20; i++) {
    let b2 = new Boid(width / 2, -height / 2);
    flock2.addBoid(b2);
  }
}

function draw() {
  background('rgba(0,255,0, 0.25)');
  flock1.run();
  flock2.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock1.addBoid(new Boid(mouseX, mouseY));
  flock2.addBoid(new Boid(mouseX, mouseY));
}

function mousePressed() {
  flock1.addBoid(new Boid(mouseX, mouseY));
  flock2.addBoid(new Boid(mouseX, mouseY));
}