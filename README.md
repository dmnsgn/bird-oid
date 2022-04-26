# bird-oid

[![npm version](https://img.shields.io/npm/v/bird-oid)](https://www.npmjs.com/package/bird-oid)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/bird-oid)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/bird-oid)](https://bundlephobia.com/package/bird-oid)
[![dependencies](https://img.shields.io/librariesio/release/npm/bird-oid)](https://github.com/dmnsgn/bird-oid/blob/main/package.json)
[![types](https://img.shields.io/npm/types/bird-oid)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/bird-oid)](https://github.com/dmnsgn/bird-oid/blob/main/LICENSE.md)

A 3D boid system with accompanying emergent behaviors. Implementation mostly based on Craig Reynolds paper Steering Behaviors For Autonomous Characters.

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

![](https://raw.githubusercontent.com/dmnsgn/bird-oid/main/screenshot.gif)

## Installation

```bash
npm install bird-oid
```

## Usage

```js
import { System as BoidSystem, behaviors } from "bird-oid";

const BOIDS_COUNT = 100;
const WANDER_SPEED = 2;

const system = new BoidSystem({
  maxSpeed: 0.3,
  maxForce: 0.4,
});

const boidBehaviors = [
  {
    fn: behaviors.wander,
    options: {
      distance: system.scale * 0.04,
      radius: system.scale * 0.3,
      theta: 0,
      phi: 0.3,
    },
  },
  {
    enabled: true,
    fn: behaviors.boundsConstrain,
    scale: 2,
  },
  {
    enabled: false,
    fn: behaviors.boundsWrapConstrain,
  },
];

for (let i = 0; i < BOIDS_COUNT; i++) {
  const boid = new Boid(boidBehaviors);

  // Position in the bounds
  boid.position = system.getRandomPosition();

  // Add initial velocity
  boid.velocity = [
    Math.random() * 0.5 * system.maxSpeed,
    Math.random() * 0.5 * system.maxSpeed,
    Math.random() * 0.5 * system.maxSpeed,
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

<!-- api-start -->

## Modules

<dl>
<dt><a href="#module_behaviors">behaviors</a></dt>
<dd><p>Steering based on <a href="https://www.red3d.com/cwr/steer/gdc99/">https://www.red3d.com/cwr/steer/gdc99/</a>
Use these function as <code>fn</code> property of the <code>BehaviorObject</code> passed to a <code>Boid</code>.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Boid">Boid</a></dt>
<dd><p>A data structure for a single Boid.</p>
</dd>
<dt><a href="#Obstacle">Obstacle</a></dt>
<dd><p>Data structure used for obstacle avoidance behavior.</p>
</dd>
<dt><a href="#Path">Path</a></dt>
<dd><p>Data structure used for path following behavior.</p>
</dd>
<dt><a href="#System">System</a></dt>
<dd><p>Handle common boids update and global state.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SystemOptions">SystemOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Radians">Radians</a> : <code>number</code></dt>
<dd></dd>
<dt><a href="#BehaviorObject">BehaviorObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ApplyBehaviorObject">ApplyBehaviorObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BehaviorOptions">BehaviorOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BasicBehaviorOptions">BasicBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#ExtendedBasicBehaviorOptions">ExtendedBasicBehaviorOptions</a> : <code><a href="#BasicBehaviorOptions">BasicBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#BasicWithRadiusBehaviorOptions">BasicWithRadiusBehaviorOptions</a> : <code><a href="#BasicBehaviorOptions">BasicBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#ObstacleBehaviorOptions">ObstacleBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#WanderBehaviorOptions">WanderBehaviorOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#FollowPathBehaviorOptions">FollowPathBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#FollowFlowFieldSimpleBehaviorOptions">FollowFlowFieldSimpleBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#FollowFlowFieldBehaviorOptions">FollowFlowFieldBehaviorOptions</a> : <code><a href="#FollowFlowFieldSimpleBehaviorOptions">FollowFlowFieldSimpleBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#FollowLeaderSimpleBehaviorOptions">FollowLeaderSimpleBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#FollowLeaderBehaviorOptions">FollowLeaderBehaviorOptions</a> : <code><a href="#FollowLeaderSimpleBehaviorOptions">FollowLeaderSimpleBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#GroupsBehaviorOptions">GroupsBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#ConstraintBehaviorOptions">ConstraintBehaviorOptions</a> : <code><a href="#BehaviorOptions">BehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#BoundsConstraintBehaviorOptions">BoundsConstraintBehaviorOptions</a> : <code><a href="#ConstraintBehaviorOptions">ConstraintBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#SphereConstraintBehaviorOptions">SphereConstraintBehaviorOptions</a> : <code><a href="#ConstraintBehaviorOptions">ConstraintBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#WrapConstraintBehaviorOptions">WrapConstraintBehaviorOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BoundsWrapConstraintBehaviorOptions">BoundsWrapConstraintBehaviorOptions</a> : <code><a href="#WrapConstraintBehaviorOptions">WrapConstraintBehaviorOptions</a></code></dt>
<dd></dd>
<dt><a href="#SphereWrapConstraintBehaviorOptions">SphereWrapConstraintBehaviorOptions</a> : <code><a href="#WrapConstraintBehaviorOptions">WrapConstraintBehaviorOptions</a></code></dt>
<dd></dd>
</dl>

<a name="module_behaviors"></a>

## behaviors

Steering based on https://www.red3d.com/cwr/steer/gdc99/
Use these function as `fn` property of the `BehaviorObject` passed to a `Boid`.

- [behaviors](#module_behaviors)
  - [.seek(options)](#module_behaviors.seek) ⇒ <code>module:gl-matrix~vec3</code>
  - [.flee(options)](#module_behaviors.flee) ⇒ <code>module:gl-matrix~vec3</code>
  - [.pursue(options)](#module_behaviors.pursue) ⇒ <code>module:gl-matrix~vec3</code>
  - [.evade(options)](#module_behaviors.evade) ⇒ <code>module:gl-matrix~vec3</code>
  - [.arrive(options)](#module_behaviors.arrive) ⇒ <code>module:gl-matrix~vec3</code>
  - [.avoidObstacles(options)](#module_behaviors.avoidObstacles) ⇒ <code>module:gl-matrix~vec3</code>
  - [.wander(options)](#module_behaviors.wander) ⇒ <code>module:gl-matrix~vec3</code>
  - [.followPath(options)](#module_behaviors.followPath) ⇒ <code>module:gl-matrix~vec3</code>
  - [.followFlowFieldSimple(options)](#module_behaviors.followFlowFieldSimple) ⇒ <code>module:gl-matrix~vec3</code>
  - [.followFlowField(options)](#module_behaviors.followFlowField) ⇒ <code>module:gl-matrix~vec3</code>
  - [.followLeaderSimple(options)](#module_behaviors.followLeaderSimple) ⇒ <code>module:gl-matrix~vec3</code>
  - [.followLeader(options)](#module_behaviors.followLeader) ⇒ <code>module:gl-matrix~vec3</code>
  - [.separate(options)](#module_behaviors.separate) ⇒ <code>module:gl-matrix~vec3</code>
  - [.cohere(options)](#module_behaviors.cohere) ⇒ <code>module:gl-matrix~vec3</code>
  - [.align(options)](#module_behaviors.align) ⇒ <code>module:gl-matrix~vec3</code>
  - [.flock(options)](#module_behaviors.flock) ⇒ <code>module:gl-matrix~vec3</code>
  - [.boundsConstrain(options)](#module_behaviors.boundsConstrain) ⇒ <code>module:gl-matrix~vec3</code>
  - [.sphereConstrain(options)](#module_behaviors.sphereConstrain) ⇒ <code>module:gl-matrix~vec3</code>
  - [.boundsWrapConstrain(options)](#module_behaviors.boundsWrapConstrain) ⇒ <code>module:gl-matrix~vec3</code>
  - [.sphereWrapConstrain(options)](#module_behaviors.sphereWrapConstrain) ⇒ <code>module:gl-matrix~vec3</code>

<a name="module_behaviors.seek"></a>

### behaviors.seek(options) ⇒ <code>module:gl-matrix~vec3</code>

"Seek (or pursuit of a static target) acts to steer the character towards a specified position in global space."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                       |
| ------- | ---------------------------------------------------------- |
| options | [<code>BasicBehaviorOptions</code>](#BasicBehaviorOptions) |

<a name="module_behaviors.flee"></a>

### behaviors.flee(options) ⇒ <code>module:gl-matrix~vec3</code>

"Flee is simply the inverse of seek and acts to steer the character so that its velocity is radially aligned away from the target. The desired velocity points in the opposite direction."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                       |
| ------- | ---------------------------------------------------------- |
| options | [<code>BasicBehaviorOptions</code>](#BasicBehaviorOptions) |

<a name="module_behaviors.pursue"></a>

### behaviors.pursue(options) ⇒ <code>module:gl-matrix~vec3</code>

"Pursuit is similar to seek except that the quarry (target) is another moving character. [...] The position of a character T units of time in the future (assuming it does not maneuver) can be obtained by scaling its velocity by T and adding that offset to its current position. Steering for pursuit is then simply the result of applying the seek steering behavior to the predicted target location."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                       |
| ------- | -------------------------------------------------------------------------- |
| options | [<code>ExtendedBasicBehaviorOptions</code>](#ExtendedBasicBehaviorOptions) |

<a name="module_behaviors.evade"></a>

### behaviors.evade(options) ⇒ <code>module:gl-matrix~vec3</code>

"Evasion is analogous to pursuit, except that flee is used to steer away from the predicted future position of the target character."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                       |
| ------- | -------------------------------------------------------------------------- |
| options | [<code>ExtendedBasicBehaviorOptions</code>](#ExtendedBasicBehaviorOptions) |

<a name="module_behaviors.arrive"></a>

### behaviors.arrive(options) ⇒ <code>module:gl-matrix~vec3</code>

"Arrival behavior is identical to seek while the character is far from its target. But instead of moving through the target at full speed, this behavior causes the character to slow down as it approaches the target, eventually slowing to a stop coincident with the target"

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                           |
| ------- | ------------------------------------------------------------------------------ |
| options | [<code>BasicWithRadiusBehaviorOptions</code>](#BasicWithRadiusBehaviorOptions) |

<a name="module_behaviors.avoidObstacles"></a>

### behaviors.avoidObstacles(options) ⇒ <code>module:gl-matrix~vec3</code>

"The implementation of obstacle avoidance behavior described here will make a simplifying assumption that both the character and obstacle can be reasonably approximated as spheres, although the basic concept can be easily extend to more precise shape models. [...] It is convenient to consider the geometrical situation from the character’s local coordinate system. The goal of the behavior is to keep an imaginary cylinder of free space in front of the character. The cylinder lies along the character’s forward axis, has a diameter equal to the character’s bounding sphere, and extends from the character’s center for a distance based on the character’s speed and agility. An obstacle further than this distance away is not an immediate threat. The obstacle avoidance behavior considers each obstacle in turn (perhaps using a spatial portioning scheme to cull out distance obstacles) and determines if they intersect with the cylinder. By localizing the center of each spherical obstacle, the test for non-intersection with the cylinder is very fast. The local obstacle center is projected onto the side-up plane (by setting its forward coordinate to zero) if the 2D distance from that point to the local origin is greater than the sum of the radii of the obstacle and the character, then there is no potential collision. Similarly obstacles which are fully behind the character, or fully ahead of the cylinder, can be quickly rejected. For any remaining obstacles a line-sphere intersection calculation is performed. The obstacle which intersects the forward axis nearest the character is selected as the “most threatening.” Steering to avoid this obstacle is computed by negating the (lateral) side-up projection of the obstacle’s center.

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                             |
| ------- | ---------------------------------------------------------------- |
| options | [<code>ObstacleBehaviorOptions</code>](#ObstacleBehaviorOptions) |

<a name="module_behaviors.wander"></a>

### behaviors.wander(options) ⇒ <code>module:gl-matrix~vec3</code>

"The steering force takes a “random walk” from one direction to another. This idea [...] is to constrain the steering force to the surface of a sphere located slightly ahead of the character. To produce the steering force for the next frame: a random displacement is added to the previous value, and the sum is constrained again to the sphere’s surface. The sphere’s radius [...] determines the maximum wandering “strength” and the magnitude of the random displacement [...] determines the wander “rate.”"
Note: Don't forget to update theta and phi angles: angle += Math.random() _ WANDER_SPEED - WANDER_SPEED _ 0.5;

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                         |
| ------- | ------------------------------------------------------------ |
| options | [<code>WanderBehaviorOptions</code>](#WanderBehaviorOptions) |

<a name="module_behaviors.followPath"></a>

### behaviors.followPath(options) ⇒ <code>module:gl-matrix~vec3</code>

"Path following behavior enables a character to steer along a predetermined path, such as a roadway, corridor or tunnel."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                 |
| ------- | -------------------------------------------------------------------- |
| options | [<code>FollowPathBehaviorOptions</code>](#FollowPathBehaviorOptions) |

<a name="module_behaviors.followFlowFieldSimple"></a>

### behaviors.followFlowFieldSimple(options) ⇒ <code>module:gl-matrix~vec3</code>

"In flow field following behavior the character steers to align its motion with the local tangent of a flow field (also known as a force field or a vector field). [...] The future position of a character is estimated and the flow field is sampled at that location. This flow direction [...] is the “desired velocity” and the steering direction (vector S) is simply the difference between the current velocity (vector V) and the desired velocity."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                                       |
| ------- | ------------------------------------------------------------------------------------------ |
| options | [<code>FollowFlowFieldSimpleBehaviorOptions</code>](#FollowFlowFieldSimpleBehaviorOptions) |

<a name="module_behaviors.followFlowField"></a>

### behaviors.followFlowField(options) ⇒ <code>module:gl-matrix~vec3</code>

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                           |
| ------- | ------------------------------------------------------------------------------ |
| options | [<code>FollowFlowFieldBehaviorOptions</code>](#FollowFlowFieldBehaviorOptions) |

<a name="module_behaviors.followLeaderSimple"></a>

### behaviors.followLeaderSimple(options) ⇒ <code>module:gl-matrix~vec3</code>

"Leader following behavior causes one or more character to follow another moving character designated as the leader. Generally the followers want to stay near the leader, without crowding the leader, and taking care to stay out of the leader’s way (in case they happen to find them selves in front of the leader). In addition, if there is more than one follower, they want to avoid bumping each other. The implementation of leader following relies on arrival behavior (see above) a desire to move towards a point, slowing as it draws near. The arrival target is a point offset slightly behind the leader. (The offset distance might optionally increases with speed.) If a follower finds itself in a rectangular region in front of the leader, it will steer laterally away from the leader’s path before resuming arrival behavior. In addition the followers use separation behavior to prevent crowding each other."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                                 |
| ------- | ------------------------------------------------------------------------------------ |
| options | [<code>FollowLeaderSimpleBehaviorOptions</code>](#FollowLeaderSimpleBehaviorOptions) |

<a name="module_behaviors.followLeader"></a>

### behaviors.followLeader(options) ⇒ <code>module:gl-matrix~vec3</code>

Notes: next behaviour should be a separation

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| options | [<code>FollowLeaderBehaviorOptions</code>](#FollowLeaderBehaviorOptions) |

<a name="module_behaviors.separate"></a>

### behaviors.separate(options) ⇒ <code>module:gl-matrix~vec3</code>

"To compute steering for separation, first a search is made to find other characters within the specified neighborhood. [...] For each nearby character, a repulsive force is computed by subtracting the positions of our character and the nearby character, normalizing, and then applying a 1/r weighting. (That is, the position offset vector is scaled by 1/r 2.) Note that 1/r is just a setting that has worked well, not a fundamental value. These repulsive forces for each nearby character are summed together to produce the overall steering force."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                         |
| ------- | ------------------------------------------------------------ |
| options | [<code>GroupsBehaviorOptions</code>](#GroupsBehaviorOptions) |

<a name="module_behaviors.cohere"></a>

### behaviors.cohere(options) ⇒ <code>module:gl-matrix~vec3</code>

"Cohesion steering behavior gives an character the ability to cohere with (approach and form a group with) other nearby characters. [...] Steering for cohesion can be computed by finding all characters in the local neighborhood (as described above for separation), computing the “average position” (or “center of gravity”) of the nearby characters. The steering force can applied in the direction of that “average position” (subtracting our character position from the average position, as in the original boids model), or it can be used as the target for seek steering behavior."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                         |
| ------- | ------------------------------------------------------------ |
| options | [<code>GroupsBehaviorOptions</code>](#GroupsBehaviorOptions) |

<a name="module_behaviors.align"></a>

### behaviors.align(options) ⇒ <code>module:gl-matrix~vec3</code>

"Alignment steering behavior gives an character the ability to align itself with (that is, head in the same direction and/or speed as) other nearby characters [...]. Steering for alignment can be computed by finding all characters in the local neighborhood (as described above for separation), averaging together the velocity (or alternately, the unit forward vector) of the nearby characters. This average is the “desired velocity,” and so the steering vector is the difference between the average and our character’s current velocity (or alternately, its unit forward vector)."

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                         |
| ------- | ------------------------------------------------------------ |
| options | [<code>GroupsBehaviorOptions</code>](#GroupsBehaviorOptions) |

<a name="module_behaviors.flock"></a>

### behaviors.flock(options) ⇒ <code>module:gl-matrix~vec3</code>

"[...] in addition to other applications, the separation, cohesion and alignment behaviors can be combined to produce the boids model of flocks, herds and schools"

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                         |
| ------- | ------------------------------------------------------------ |
| options | [<code>GroupsBehaviorOptions</code>](#GroupsBehaviorOptions) |

<a name="module_behaviors.boundsConstrain"></a>

### behaviors.boundsConstrain(options) ⇒ <code>module:gl-matrix~vec3</code>

Constraint in system bounds.

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                             |
| ------- | -------------------------------------------------------------------------------- |
| options | [<code>BoundsConstraintBehaviorOptions</code>](#BoundsConstraintBehaviorOptions) |

<a name="module_behaviors.sphereConstrain"></a>

### behaviors.sphereConstrain(options) ⇒ <code>module:gl-matrix~vec3</code>

Constraint in sphere bounds.

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                             |
| ------- | -------------------------------------------------------------------------------- |
| options | [<code>SphereConstraintBehaviorOptions</code>](#SphereConstraintBehaviorOptions) |

<a name="module_behaviors.boundsWrapConstrain"></a>

### behaviors.boundsWrapConstrain(options) ⇒ <code>module:gl-matrix~vec3</code>

Wrap to opposite bound (no velocity change).

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                                     |
| ------- | ---------------------------------------------------------------------------------------- |
| options | [<code>BoundsWrapConstraintBehaviorOptions</code>](#BoundsWrapConstraintBehaviorOptions) |

<a name="module_behaviors.sphereWrapConstrain"></a>

### behaviors.sphereWrapConstrain(options) ⇒ <code>module:gl-matrix~vec3</code>

Wrap to opposite bound (no velocity change).

**Kind**: static method of [<code>behaviors</code>](#module_behaviors)

| Param   | Type                                                                                     |
| ------- | ---------------------------------------------------------------------------------------- |
| options | [<code>SphereWrapConstraintBehaviorOptions</code>](#SphereWrapConstraintBehaviorOptions) |

<a name="Boid"></a>

## Boid

A data structure for a single Boid.

**Kind**: global class
**Properties**

| Name         | Type                                                         |
| ------------ | ------------------------------------------------------------ |
| position     | <code>module:gl-matrix~vec3</code>                           |
| velocity     | <code>module:gl-matrix~vec3</code>                           |
| acceleration | <code>module:gl-matrix~vec3</code>                           |
| target       | <code>Array.&lt;module:gl-matrix~vec3&gt;</code>             |
| behavious    | [<code>Array.&lt;BehaviorObject&gt;</code>](#BehaviorObject) |

- [Boid](#Boid)
  - [new Boid(behaviors)](#new_Boid_new)
  - [.applyForce(force)](#Boid+applyForce)
  - [.applyBehaviors(applyOptions)](#Boid+applyBehaviors)
  - [.update(dt, maxSpeed)](#Boid+update)

<a name="new_Boid_new"></a>

### new Boid(behaviors)

| Param     | Type                                                         | Description                                 |
| --------- | ------------------------------------------------------------ | ------------------------------------------- |
| behaviors | [<code>Array.&lt;BehaviorObject&gt;</code>](#BehaviorObject) | An array of behaviors to apply to the boid. |

<a name="Boid+applyForce"></a>

### boid.applyForce(force)

Add a force to the boid's acceleration vector. If you need mass, you can either use behaviors.scale or override.

**Kind**: instance method of [<code>Boid</code>](#Boid)

| Param | Type                               |
| ----- | ---------------------------------- |
| force | <code>module:gl-matrix~vec3</code> |

<a name="Boid+applyBehaviors"></a>

### boid.applyBehaviors(applyOptions)

Compute all the behaviors specified in `boid.behaviors` and apply them via applyForce. Arguments usually come from the system and can be overridden via `behavior.options`.

**Kind**: instance method of [<code>Boid</code>](#Boid)

| Param        | Type                                                     |
| ------------ | -------------------------------------------------------- |
| applyOptions | [<code>ApplyBehaviorObject</code>](#ApplyBehaviorObject) |

<a name="Boid+update"></a>

### boid.update(dt, maxSpeed)

Update a boid's position according to its current acceleration/velocity and reset acceleration. Usually called consecutively to `boid.applyBehaviors`.

**Kind**: instance method of [<code>Boid</code>](#Boid)

| Param    | Type                |
| -------- | ------------------- |
| dt       | <code>number</code> |
| maxSpeed | <code>number</code> |

<a name="Obstacle"></a>

## Obstacle

Data structure used for obstacle avoidance behavior.

**Kind**: global class
<a name="new_Obstacle_new"></a>

### new Obstacle(position, radius)

| Param    | Type                               | Description                 |
| -------- | ---------------------------------- | --------------------------- |
| position | <code>module:gl-matrix~vec3</code> | The center of the obstacle. |
| radius   | <code>number</code>                | The radius of the sphere.   |

<a name="Path"></a>

## Path

Data structure used for path following behavior.

**Kind**: global class
<a name="new_Path_new"></a>

### new Path(points, radius)

| Param  | Type                                             | Description            |
| ------ | ------------------------------------------------ | ---------------------- |
| points | <code>Array.&lt;module:gl-matrix~vec3&gt;</code> | An array of 3d points. |
| radius | <code>number</code>                              |                        |

<a name="System"></a>

## System

Handle common boids update and global state.

**Kind**: global class

- [System](#System)
  - [new System(options)](#new_System_new)
  - [.getRandomPosition()](#System+getRandomPosition) ⇒ <code>Array.&lt;number&gt;</code>
  - [.addBoid(boid)](#System+addBoid)
  - [.update(dt)](#System+update)

<a name="new_System_new"></a>

### new System(options)

| Param   | Type                                         |
| ------- | -------------------------------------------- |
| options | [<code>SystemOptions</code>](#SystemOptions) |

<a name="System+getRandomPosition"></a>

### system.getRandomPosition() ⇒ <code>Array.&lt;number&gt;</code>

Get a position within the system's bounds.

**Kind**: instance method of [<code>System</code>](#System)
<a name="System+addBoid"></a>

### system.addBoid(boid)

Push a new boid to the system.

**Kind**: instance method of [<code>System</code>](#System)

| Param | Type                       |
| ----- | -------------------------- |
| boid  | [<code>Boid</code>](#Boid) |

<a name="System+update"></a>

### system.update(dt)

Update all behaviours in the system.

**Kind**: instance method of [<code>System</code>](#System)

| Param | Type                |
| ----- | ------------------- |
| dt    | <code>number</code> |

<a name="SystemOptions"></a>

## SystemOptions : <code>Object</code>

**Kind**: global typedef
**Properties**

| Name       | Type                               | Default                            | Description                                                                                                                       |
| ---------- | ---------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [scale]    | <code>number</code>                | <code>1</code>                     | A global scale for the system.                                                                                                    |
| [maxSpeed] | <code>number</code>                | <code>scale</code>                 | A maximum speed for the boids in the system. Can be tweaked individually via `boid.maxSpeed`.                                     |
| [maxForce] | <code>number</code>                | <code>scale</code>                 | A maximum force for each behavior of a boid. Can be tweaked individually via `boid.maxForce` or via `behaviors.options.maxForce`. |
| [center]   | <code>module:gl-matrix~vec3</code> | <code>[0, 0, 0]</code>             | A center point for the system.                                                                                                    |
| [bounds]   | <code>module:gl-matrix~vec3</code> | <code>[scale, scale, scale]</code> | Positives bounds x/y/z for the system expanding from the center point.                                                            |

<a name="Radians"></a>

## Radians : <code>number</code>

**Kind**: global typedef
<a name="BehaviorObject"></a>

## BehaviorObject : <code>Object</code>

**Kind**: global typedef
**Properties**

| Name    | Type                  |
| ------- | --------------------- |
| fn      | <code>function</code> |
| enabled | <code>boolean</code>  |
| scale   | <code>number</code>   |
| options | <code>Object</code>   |

<a name="ApplyBehaviorObject"></a>

## ApplyBehaviorObject : <code>Object</code>

**Kind**: global typedef
**Properties**

| Name       | Type                                     |
| ---------- | ---------------------------------------- |
| boids      | [<code>Array.&lt;Boid&gt;</code>](#Boid) |
| maxSpeed   | <code>number</code>                      |
| [maxForce] | <code>number</code>                      |
| center     | <code>module:gl-matrix~vec3</code>       |
| bounds     | <code>module:gl-matrix~vec3</code>       |

<a name="BehaviorOptions"></a>

## BehaviorOptions : <code>Object</code>

**Kind**: global typedef
**Properties**

| Name     | Type                               |
| -------- | ---------------------------------- |
| position | <code>module:gl-matrix~vec3</code> |
| velocity | <code>module:gl-matrix~vec3</code> |
| maxSpeed | <code>number</code>                |

<a name="BasicBehaviorOptions"></a>

## BasicBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name   | Type                               |
| ------ | ---------------------------------- |
| target | <code>module:gl-matrix~vec3</code> |

<a name="ExtendedBasicBehaviorOptions"></a>

## ExtendedBasicBehaviorOptions : [<code>BasicBehaviorOptions</code>](#BasicBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name           | Type                               |
| -------------- | ---------------------------------- |
| targetVelocity | <code>module:gl-matrix~vec3</code> |

<a name="BasicWithRadiusBehaviorOptions"></a>

## BasicWithRadiusBehaviorOptions : [<code>BasicBehaviorOptions</code>](#BasicBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name   | Type                |
| ------ | ------------------- |
| radius | <code>number</code> |

<a name="ObstacleBehaviorOptions"></a>

## ObstacleBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name            | Type                                 | Default            |
| --------------- | ------------------------------------ | ------------------ |
| obstacles       | <code>Array.&lt;Obstacles&gt;</code> |                    |
| maxAvoidForce   | <code>number</code>                  |                    |
| [fixedDistance] | <code>boolean</code>                 | <code>false</code> |

<a name="WanderBehaviorOptions"></a>

## WanderBehaviorOptions : <code>Object</code>

**Kind**: global typedef
**Properties**

| Name     | Type                               |
| -------- | ---------------------------------- |
| velocity | <code>module:gl-matrix~vec3</code> |
| distance | <code>number</code>                |
| maxSpeed | <code>number</code>                |
| radius   | <code>number</code>                |
| theta    | [<code>Radians</code>](#Radians)   |
| phi      | [<code>Radians</code>](#Radians)   |

<a name="FollowPathBehaviorOptions"></a>

## FollowPathBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name            | Type                       | Default            |
| --------------- | -------------------------- | ------------------ |
| path            | [<code>Path</code>](#Path) |                    |
| [fixedDistance] | <code>boolean</code>       | <code>false</code> |

<a name="FollowFlowFieldSimpleBehaviorOptions"></a>

## FollowFlowFieldSimpleBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| flowField | <code>module:vector-field~FlowField</code> |

<a name="FollowFlowFieldBehaviorOptions"></a>

## FollowFlowFieldBehaviorOptions : [<code>FollowFlowFieldSimpleBehaviorOptions</code>](#FollowFlowFieldSimpleBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name            | Type                                       | Default            |
| --------------- | ------------------------------------------ | ------------------ |
| flowField       | <code>module:vector-field~FlowField</code> |                    |
| [fixedDistance] | <code>boolean</code>                       | <code>false</code> |

<a name="FollowLeaderSimpleBehaviorOptions"></a>

## FollowLeaderSimpleBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name     | Type                       |
| -------- | -------------------------- |
| leader   | [<code>Boid</code>](#Boid) |
| distance | <code>number</code>        |
| radius   | <code>number</code>        |

<a name="FollowLeaderBehaviorOptions"></a>

## FollowLeaderBehaviorOptions : [<code>FollowLeaderSimpleBehaviorOptions</code>](#FollowLeaderSimpleBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name          | Type                | Default        |
| ------------- | ------------------- | -------------- |
| [evadeScale]  | <code>number</code> | <code>1</code> |
| [arriveScale] | <code>number</code> | <code>1</code> |

<a name="GroupsBehaviorOptions"></a>

## GroupsBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name        | Type                                     |
| ----------- | ---------------------------------------- |
| boids       | [<code>Array.&lt;Boid&gt;</code>](#Boid) |
| maxDistance | <code>number</code>                      |

<a name="ConstraintBehaviorOptions"></a>

## ConstraintBehaviorOptions : [<code>BehaviorOptions</code>](#BehaviorOptions)

**Kind**: global typedef
**Properties**

| Name            | Type                               | Default            |
| --------------- | ---------------------------------- | ------------------ |
| center          | <code>module:gl-matrix~vec3</code> |                    |
| maxDistance     | <code>number</code>                |                    |
| [fixedDistance] | <code>boolean</code>               | <code>false</code> |

<a name="BoundsConstraintBehaviorOptions"></a>

## BoundsConstraintBehaviorOptions : [<code>ConstraintBehaviorOptions</code>](#ConstraintBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name   | Type                               |
| ------ | ---------------------------------- |
| bounds | <code>module:gl-matrix~vec3</code> |

<a name="SphereConstraintBehaviorOptions"></a>

## SphereConstraintBehaviorOptions : [<code>ConstraintBehaviorOptions</code>](#ConstraintBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name   | Type                |
| ------ | ------------------- |
| radius | <code>number</code> |

<a name="WrapConstraintBehaviorOptions"></a>

## WrapConstraintBehaviorOptions : <code>Object</code>

**Kind**: global typedef
**Properties**

| Name     | Type                               |
| -------- | ---------------------------------- |
| position | <code>module:gl-matrix~vec3</code> |
| center   | <code>module:gl-matrix~vec3</code> |

<a name="BoundsWrapConstraintBehaviorOptions"></a>

## BoundsWrapConstraintBehaviorOptions : [<code>WrapConstraintBehaviorOptions</code>](#WrapConstraintBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name   | Type                               |
| ------ | ---------------------------------- |
| bounds | <code>module:gl-matrix~vec3</code> |

<a name="SphereWrapConstraintBehaviorOptions"></a>

## SphereWrapConstraintBehaviorOptions : [<code>WrapConstraintBehaviorOptions</code>](#WrapConstraintBehaviorOptions)

**Kind**: global typedef
**Properties**

| Name   | Type                |
| ------ | ------------------- |
| radius | <code>number</code> |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/bird-oid/blob/main/LICENSE.md).
