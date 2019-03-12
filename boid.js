// Boid class
// Methods for Separation, Cohesion, Alignment added

class Boid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 6;
    // this.maxforce = 0.5; // Maximum speed
    // for (let i = 0; i < 5; i++) {
    //   this.maxforce = sin(radians(i)); // Maximum steering force
    // }
    this.maxspeed = 4; // Maximum speed
    // for (let i = 4; i < 5; i++) {
    //   this.maxspeed = sin(radians(i)); // Maximum steering force
    // }
    this.maxforce = 0.5;
    
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  // This function implements Craig Reynolds' path following algorithm
  // http://www.red3d.com/cwr/steer/PathFollow.html
  // follow(p) {

  //   // Predict position 50 (arbitrary choice) frames ahead
  //   let predict = this.velocity.copy();
  //   predict.normalize();
  //   predict.mult(50);
  //   let predictLoc = p5.Vector.add(this.position, predict);

  //   // Look at the line segment
  //   let a = p.start;
  //   let b = p.end;

  //   // Get the normal point to that line
  //   let normalPoint = getNormalPoint(predictLoc, a, b);

  //   // Find target point a little further ahead of normal
  //   let dir = p5.Vector.sub(b, a);
  //   dir.normalize();
  //   dir.mult(10); // This could be based on velocity instead of just an arbitrary 10 pixels
  //   let target = p5.Vector.add(normalPoint, dir);

  //   // How far away are we from the path?
  //   let distance = p5.Vector.dist(predictLoc, normalPoint);
  //   // Only if the distance is greater than the path's radius do we bother to steer
  //   if (distance > p.radius) {
  //     this.arrive(target);
  //   }


  //   // Draw the debugging stuff
  //   if (debug) {
  //     fill(200);
  //     stroke(200);
  //     line(this.position.x, this.position.y, predictLoc.x, predictLoc.y);
  //     ellipse(predictLoc.x, predictLoc.y, 4, 4);

  //     // Draw normal location
  //     fill(200);
  //     stroke(200);
  //     line(predictLoc.x, predictLoc.y, normalPoint.x, normalPoint.y);
  //     ellipse(normalPoint.x, normalPoint.y, 4, 4);
  //     stroke(200);
  //     if (distance > p.radius) fill(255, 0, 0);
  //     noStroke();
  //     ellipse(target.x + dir.x, target.y + dir.y, 8, 8);
  //   }
  // }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids); // Alignment
    let coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  // seek(target) {
  //   let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  //   // Normalize desired and scale to maximum speed
  //   desired.normalize();
  //   desired.mult(this.maxspeed);
  //   // Steering = Desired minus Velocity
  //   let steer = p5.Vector.sub(desired, this.velocity);
  //   steer.limit(this.maxforce); // Limit to maximum steering force
  //   return steer;
  // }

  arrive(target) {
   // PVector desired = PVector.sub(target,location);
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // The distance is the magnitude of
    // the vector pointing from
    // location to target.
    this.d = desired.mag();
    desired.normalize();
    // If we are closer than 100 pixels...
    if (this.d < 100) {
      //[full] ...set the magnitude
      // according to how close we are.
      this.m = map(this.d,0,100,0,this.maxspeed);
      desired.mult(this.m);
      //[end]
    } else {
      // Otherwise, proceed at maximum speed.
      desired.mult(this.maxspeed);
    }

    // The usual steering = desired - velocity
    //PVector steer = PVector.sub(desired,velocity);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    fill(250);
    stroke(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  separate(boids) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.arrive(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }
}

// A function to get the normal point from a point (p) to a line segment (a-b)
// This function could be optimized to make fewer new Vector objects
// function getNormalPoint(p, a, b) {
//   // Vector from a to p
//   let ap = p5.Vector.sub(p, a);
//   // Vector from a to b
//   let ab = p5.Vector.sub(b, a);
//   ab.normalize(); // Normalize the line
//   // Project vector "diff" onto line by using the dot product
//   ab.mult(ap.dot(ab));
//   let normalPoint = p5.Vector.add(a, ab);
//   return normalPoint;
// }