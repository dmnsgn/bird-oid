# bird-oid [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm version](https://badge.fury.io/js/bird-oid.svg)](https://www.npmjs.com/package/bird-oid)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A 3D boid system with accompanying emergent behaviors. Implementation mostly based on Craig Reynolds paper Steering Behaviors For Autonomous Characters.

![](https://raw.githubusercontent.com/dmnsgn/bird-oid/master/screenshot.gif)

## Installation

```bash
npm install bird-oid
```

[![NPM](https://nodei.co/npm/bird-oid.png)](https://nodei.co/npm/bird-oid/)

## Usage

See [demo](https://dmnsgn.github.io/bird-oid/).

```js
import { System as BoidSystem, behaviors } from "bird-oid";

const BOIDS_COUNT = 100;
const WANDER_SPEED = 2;

const system = new BoidSystem({
	maxSpeed: 0.3,
	maxForce: 0.4
});

const boidBehaviors = [
	{
		fn: behaviors.wander,
		options: {
			distance: system.scale * 0.04,
			radius: system.scale * 0.3,
			theta: 0,
			phi: 0.3
		}
	},
	{
		enabled: true,
		fn: behaviors.boundsConstrain,
		scale: 2
	},
	{
		enabled: false,
		fn: behaviors.boundsWrapConstrain
	}
];

for (let i = 0; i < BOIDS_COUNT; i++) {
	const boid = new Boid(boidBehaviors);

	// Position in the bounds
	boid.position = system.getRandomPosition();

	// Add initial velocity
	boid.velocity = [
		Math.random() * 0.5 * system.maxSpeed,
		Math.random() * 0.5 * system.maxSpeed,
		Math.random() * 0.5 * system.maxSpeed
	];
	system.addBoid(boid);
}

const frame = () => {
	const dt = Math.min(0.1, myClock.getDelta());

	// Wander requires angle update
	boidBehaviors[0].options.theta +=
		Math.random() * WANDER_SPEED - WANDER_SPEED * 0.5;
	boidBehaviors[0].options.phi +=
		Math.random() * WANDER_SPEED - WANDER_SPEED * 0.5;

	system.update(dt);

	requestAnimationFrame(frame);
};

requestAnimationFrame(() => {
	frame();
});
```

## API

### `new System({ scale: number, maxSpeed: number, maxForce: number, center: [number, number, number], bounds: [number, number, number] })`

Handle common boids update and global state.

| Option               | Default               | Description                                                                                                                       |
| -------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **options.scale**    | 1                     | A global scale for the system.                                                                                                    |
| **options.maxSpeed** | scale                 | A maximum speed for the boids in the system. Can be tweaked individually via `boid.maxSpeed`.                                     |
| **options.maxForce** | scale                 | A maximum force for each behavior of a boid. Can be tweaked individually via `boid.maxForce` or via `behaviors.options.maxForce`. |
| **options.center**   | [0, 0, 0]             | A center point for the system.                                                                                                    |
| **options.bounds**   | [scale, scale, scale] | Positives bounds x/y/z for the system expanding from the center point.                                                            |

#### `system.addBoid(boid: Boid): void`

Push a new boid to the system.

#### `system.getRandomPosition(): [number, number, number]`

Get a position within the system's bounds.

### `new Boid(behaviors)`

```ts
type BehaviorObject = {
	fn: Function;
	enabled: Boolean;
	scale: number;
	options: Object;
};
```

| Option        | Default          | Description                                 |
| ------------- | ---------------- | ------------------------------------------- |
| **behaviors** | BehaviorObject[] | An array of behaviors to apply to the boid. |

The following method are usually handled by the System.

#### `boid.applyForce(force: [number, number, number]): void`

Add a force to the boid's acceleration vector. If you need mass, you can either use behaviors.scale or override.

#### `boid.applyBehaviors({ boids: Boid[], maxSpeed: number, maxForce: number, center: [number, number, number], bounds: [number, number, number] }): void`

Compute all the behaviors specified in `boid.behaviors` and apply them via applyForce. Arguments usually come from the system and can be overridden via `behavior.options`.

#### `boid.update(dt: number, maxSpeed: number): void`

Update a boid's position according to its current acceleration/velocity and reset acceleration. Usually called consecutively to `boid.applyBehaviors`.

### `new Path(points: Array<[number, number, number]>, radius: number)`

Used for path following behavior.

| Option     | Default | Description                                                       |
| ---------- | ------- | ----------------------------------------------------------------- |
| **points** |         | An array of 3d points.                                            |
| **radius** |         | The radius of a path (see it as transforming the path to a tube). |

### `new Obstacle(points: Array<[number, number, number]>, radius: number)`

Used for obstacle avoidance behavior.

| Option       | Default | Description                 |
| ------------ | ------- | --------------------------- |
| **position** |         | The center of the obstacle. |
| **radius**   |         | The radius of the sphere.   |

### `behaviors`

Use these function as `fn` property of the `BehaviorObject` passed to a `Boid`.

#### `seek({ position, target, velocity, maxSpeed })`

#### `flee({ position, target, velocity, maxSpeed })`

#### `pursue({position, target, velocity, targetVelocity, maxSpeed })`

#### `evade({position, target, velocity, targetVelocity, maxSpeed })`

#### `arrive({ position, target, velocity, maxSpeed, radius })`

#### `avoidObstacles({ position, velocity, obstacles, maxSpeed, maxAvoidForce, fixedDistance = false })`

#### `wander({ velocity, distance, radius, theta, phi })`

#### `followPath({ path, position, velocity, maxSpeed, fixedDistance = false })`

#### `followFlowFieldSimple({ flowField, position, velocity, maxSpeed })`

#### `followFlowField({ flowField, position, velocity, maxSpeed, fixedDistance = false })`

#### `followLeaderSimple({ leader, position, velocity, maxSpeed, distance, radius })`

#### `followLeader({ leader, position, velocity, maxSpeed, distance, radius, evadeScale = 1, arriveScale = 1 })`

#### `separate({ boids, maxDistance, position, velocity, maxSpeed })`

#### `cohere({ boids, maxDistance, position, velocity, maxSpeed })`

#### `align({ boids, maxDistance, position, velocity, maxSpeed })`

#### `flock({ boids, maxDistance, position, velocity, maxSpeed })`

#### `boundsConstrain({ center, bounds, position, velocity, maxSpeed, maxForce, fixedDistance = false })`

#### `sphereConstrain({ center, radius, position, velocity, maxSpeed, maxForce, fixedDistance = false })`

#### `boundsWrapConstrain({ position, center, bounds })`

#### `sphereWrapConstrain({ position, center, radius })`

## License

MIT. See [license file](https://github.com/dmnsgn/bird-oid/blob/master/LICENSE.md).
