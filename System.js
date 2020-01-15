export default class System {
  constructor(options) {
    this.boids = [];
    this.scale = 1;

    this.maxSpeed = this.scale;
    this.maxForce = this.scale;

    this.center = [0, 0, 0];
    this.bounds = [this.scale, this.scale, this.scale];

    Object.assign(this, options);
  }

  getRandomPosition() {
    return [
      (2 * Math.random() - 1) * this.bounds[0] * 0.5 + this.center[0],
      (2 * Math.random() - 1) * this.bounds[1] * 0.5 + this.center[1],
      (2 * Math.random() - 1) * this.bounds[2] * 0.5 + this.center[2]
    ];
  }

  addBoid(boid) {
    this.boids.push(boid);
  }

  update(dt) {
    for (let i = 0; i < this.boids.length; i++) {
      const boid = this.boids[i];
      boid.applyBehaviors({
        boids: this.boids,
        maxSpeed: this.maxSpeed,
        maxForce: this.maxForce,
        center: this.center,
        bounds: this.bounds
      });
      boid.update(dt, boid.maxSpeed || this.maxSpeed);
    }
  }
}
