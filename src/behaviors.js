/**
 * @module behaviors
 *
 * @description
 * Steering based on https://www.red3d.com/cwr/steer/gdc99/
 * Use these function as `fn` property of the `BehaviorObject` passed to a `Boid`.
 */

import { vec3 } from "gl-matrix";
import { limit } from "./utils.js";

// Utils
const getPredictedOffsetFromVelocity = (velocity, maxSpeed, fixedDistance) => {
  const distance = fixedDistance || vec3.length(velocity) / maxSpeed;
  const predictedPosition = vec3.normalize(vec3.create(), velocity);
  return vec3.scale(predictedPosition, predictedPosition, distance);
};

const checkPositionsInSphere = (target1, target2, center, radius) =>
  vec3.distance(center, target1) <= radius ||
  vec3.distance(center, target2) <= radius;

// BASICS
// desired_velocity = normalize (position - target) * max_speed
// steering = desired_velocity - velocity
/**
 * "Seek (or pursuit of a static target) acts to steer the character towards a specified position in global space."
 * @param {import("../types.js").BasicBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function seek({ position, target, velocity, maxSpeed }) {
  const steering = vec3.create();
  vec3.sub(steering, target, position);

  vec3.normalize(steering, steering);
  vec3.scale(steering, steering, maxSpeed);

  return vec3.sub(steering, steering, velocity);
}

/**
 * "Flee is simply the inverse of seek and acts to steer the character so that its velocity is radially aligned away from the target. The desired velocity points in the opposite direction."
 * @param {import("../types.js").BasicBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function flee(options) {
  const steering = seek(options);
  return vec3.negate(steering, steering);
}

// EXTENDED BASICS
const getPredictedPosition = (position, target, targetVelocity, maxSpeed) => {
  // A simple estimator of moderate quality is T=Dc where D is the distance between pursuer and quarry, and c is a turning parameter.
  const T = vec3.distance(position, target) / maxSpeed;

  const predictedTarget = vec3.create();
  vec3.scale(predictedTarget, targetVelocity, T);
  return vec3.add(predictedTarget, target, predictedTarget);
};

/**
 * "Pursuit is similar to seek except that the quarry (target) is another moving character. [...] The position of a character T units of time in the future (assuming it does not maneuver) can be obtained by scaling its velocity by T and adding that offset to its current position. Steering for pursuit is then simply the result of applying the seek steering behavior to the predicted target location."
 * @param {import("../types.js").ExtendedBasicBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function pursue({
  position,
  target,
  velocity,
  targetVelocity,
  maxSpeed,
}) {
  const predictedTarget = getPredictedPosition(
    position,
    target,
    targetVelocity,
    maxSpeed
  );

  return seek({ position, target: predictedTarget, velocity, maxSpeed });
}

/**
 * "Evasion is analogous to pursuit, except that flee is used to steer away from the predicted future position of the target character."
 * @param {import("../types.js").ExtendedBasicBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function evade({
  position,
  target,
  velocity,
  targetVelocity,
  maxSpeed,
}) {
  const predictedTarget = getPredictedPosition(
    position,
    target,
    targetVelocity,
    maxSpeed
  );

  return flee({ position, target: predictedTarget, velocity, maxSpeed });
}

// target_offset = target - position
// distance = length (target_offset)
// ramped_speed = max_speed * (distance / slowing_distance)
// clipped_speed = minimum (ramped_speed, max_speed)
// desired_velocity = (clipped_speed / distance) * target_offset
// steering = desired_velocity - velocity

/**
 * "Arrival behavior is identical to seek while the character is far from its target. But instead of moving through the target at full speed, this behavior causes the character to slow down as it approaches the target, eventually slowing to a stop coincident with the target"
 * @param {BasicWithRadiusBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function arrive({ position, target, velocity, maxSpeed, radius }) {
  const steering = vec3.create();
  const desiredVelocity = vec3.create();

  vec3.sub(desiredVelocity, target, position);
  const length = vec3.length(desiredVelocity);

  vec3.normalize(desiredVelocity, desiredVelocity);
  vec3.scale(
    desiredVelocity,
    desiredVelocity,
    Math.min(maxSpeed * (length / radius), maxSpeed) / length
  );

  return vec3.sub(steering, desiredVelocity, velocity);
}

// OBSTACLES
const findClosestObstacle = (
  position,
  obstacles,
  aheadVector,
  aheadVectorHalf
) => {
  let closestObstacle = null;
  let currentDistance;

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    // TODO: is checking for a negative dot product first more efficient?
    const collision = checkPositionsInSphere(
      aheadVector,
      aheadVectorHalf,
      obstacle.position,
      obstacle.radius
    );

    if (collision) {
      if (closestObstacle == null) {
        currentDistance = vec3.distance(position, obstacle.position);
        closestObstacle = obstacle;
      } else if (vec3.distance(position, obstacle.position) < currentDistance) {
        currentDistance = vec3.distance(position, obstacle.position);
        closestObstacle = obstacle;
      }
    }
  }
  return closestObstacle;
};

/**
 * "The implementation of obstacle avoidance behavior described here will make a simplifying assumption that both the character and obstacle can be reasonably approximated as spheres, although the basic concept can be easily extend to more precise shape models. [...] It is convenient to consider the geometrical situation from the character’s local coordinate system. The goal of the behavior is to keep an imaginary cylinder of free space in front of the character. The cylinder lies along the character’s forward axis, has a diameter equal to the character’s bounding sphere, and extends from the character’s center for a distance based on the character’s speed and agility. An obstacle further than this distance away is not an immediate threat. The obstacle avoidance behavior considers each obstacle in turn (perhaps using a spatial portioning scheme to cull out distance obstacles) and determines if they intersect with the cylinder. By localizing the center of each spherical obstacle, the test for non-intersection with the cylinder is very fast. The local obstacle center is projected onto the side-up plane (by setting its forward coordinate to zero) if the 2D distance from that point to the local origin is greater than the sum of the radii of the obstacle and the character, then there is no potential collision. Similarly obstacles which are fully behind the character, or fully ahead of the cylinder, can be quickly rejected. For any remaining obstacles a line-sphere intersection calculation is performed. The obstacle which intersects the forward axis nearest the character is selected as the “most threatening.” Steering to avoid this obstacle is computed by negating the (lateral) side-up projection of the obstacle’s center.
 * @param {ObstacleBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function avoidObstacles({
  position,
  velocity,
  obstacles,
  maxSpeed,
  maxAvoidForce,
  fixedDistance = false,
}) {
  const steering = vec3.create();

  const predictedOffset = getPredictedOffsetFromVelocity(
    velocity,
    maxSpeed,
    fixedDistance
  );

  const aheadVector = vec3.create();
  const aheadVectorHalf = vec3.create();
  vec3.add(aheadVector, position, predictedOffset);
  vec3.add(
    aheadVectorHalf,
    position,
    vec3.scale(predictedOffset, predictedOffset, 0.5)
  );

  const closestObstacle = findClosestObstacle(
    position,
    obstacles,
    aheadVector,
    aheadVectorHalf
  );

  if (closestObstacle) {
    vec3.sub(steering, aheadVector, closestObstacle.position);
    vec3.normalize(steering, steering);
    vec3.scale(steering, steering, maxAvoidForce);
    return steering;
  }

  return steering;
}

// WANDER
// TODO: noise

/**
 * "The steering force takes a “random walk” from one direction to another. This idea [...] is to constrain the steering force to the surface of a sphere located slightly ahead of the character. To produce the steering force for the next frame: a random displacement is added to the previous value, and the sum is constrained again to the sphere’s surface. The sphere’s radius [...] determines the maximum wandering “strength” and the magnitude of the random displacement [...] determines the wander “rate.”"
 * Note: Don't forget to update theta and phi angles: angle += Math.random() * WANDER_SPEED - WANDER_SPEED * 0.5;
 * @param {WanderBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function wander({ velocity, distance, radius, theta, phi }) {
  const steering = vec3.create();

  const sphereCenter = vec3.clone(velocity);
  vec3.normalize(sphereCenter, sphereCenter);
  vec3.scale(sphereCenter, sphereCenter, distance);

  const displacement = [0, 1, 0];
  vec3.scale(displacement, displacement, radius);

  const length = vec3.length(displacement);
  vec3.set(
    displacement,
    length * (Math.sin(theta) * Math.sin(phi)),
    length * Math.cos(theta),
    length * (Math.sin(theta) * Math.cos(phi))
  );

  vec3.add(steering, sphereCenter, displacement);

  return steering;
}

// FOLLOW
const projectScalar = (position, currentPoint, nextPoint) => {
  const a = vec3.sub(vec3.create(), position, currentPoint);
  const b = vec3.sub(vec3.create(), nextPoint, currentPoint);

  let magnitude = vec3.length(vec3.normalize(a, a));
  magnitude *= magnitude;

  const x = vec3.dot(a, b) / magnitude;
  vec3.scale(a, a, x);

  return vec3.add(vec3.create(), currentPoint, a);
};

// TODO: could this have another version following next point in path?
/**
 * "Path following behavior enables a character to steer along a predetermined path, such as a roadway, corridor or tunnel."
 * @param {FollowPathBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function followPath({
  path,
  position,
  velocity,
  maxSpeed,
  fixedDistance = false,
}) {
  // "To compute steering for path following, a velocity-based prediction is made of the character’s future position."
  const predictedPosition = vec3.create();
  vec3.add(
    predictedPosition,
    position,
    getPredictedOffsetFromVelocity(velocity, maxSpeed, fixedDistance)
  );

  let target;
  // let segmentDirection = vec3.create();
  let smallestDistanceToPath = Infinity;

  for (let i = 0; i < path.points.length; i++) {
    const currentPoint = path.points[i];
    const nextPoint = path.points[(i + 1) % path.points.length];

    // "The predicted future position is projected onto the nearest point on the path spine."
    const normalPoint = projectScalar(
      predictedPosition,
      currentPoint,
      nextPoint
    );

    // TODO: do I need to check the projected point is on the segment?
    const distance = vec3.distance(predictedPosition, normalPoint);
    if (distance < smallestDistanceToPath) {
      target = target || vec3.create();
      smallestDistanceToPath = distance;
      vec3.copy(target, normalPoint);
    }
  }

  // "If this projection distance (from the predicted position to the nearest on-path point) is less than the path radius, then the character is deemed to be correctly following the path and no corrective steering is required. Otherwise the character is veering away from the path, or is too far away from the path. To steer back towards the path, the seek behavior is used to steer towards the on-path projection of the predicted future position. [...]"
  // TODO: ahead of normal point
  if (smallestDistanceToPath > path.radius) {
    return seek({ position, target, velocity, maxSpeed });
  }
}

/**
 * "In flow field following behavior the character steers to align its motion with the local tangent of a flow field (also known as a force field or a vector field). [...] The future position of a character is estimated and the flow field is sampled at that location. This flow direction [...] is the “desired velocity” and the steering direction (vector S) is simply the difference between the current velocity (vector V) and the desired velocity."
 * @param {FollowFlowFieldSimpleBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function followFlowFieldSimple({
  flowField,
  position,
  velocity,
  maxSpeed,
}) {
  const localTangent = flowField.lookup(position);

  if (localTangent) {
    const steering = vec3.clone(localTangent.direction);
    vec3.normalize(steering, steering);
    vec3.scale(steering, steering, maxSpeed);
    return vec3.sub(steering, steering, velocity);
  }
}

/**
 * @param {FollowFlowFieldBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function followFlowField({
  flowField,
  position,
  velocity,
  maxSpeed,
  fixedDistance = false,
}) {
  const predictedOffset = getPredictedOffsetFromVelocity(
    velocity,
    maxSpeed,
    fixedDistance
  );

  const aheadVector = vec3.create();
  vec3.add(aheadVector, position, predictedOffset);

  const localTangent = flowField.lookup(aheadVector);

  if (localTangent) {
    const steering = vec3.clone(localTangent.direction);
    vec3.normalize(steering, steering);
    vec3.scale(steering, steering, maxSpeed);
    return vec3.sub(steering, steering, velocity);
  }
}

/**
 * "Leader following behavior causes one or more character to follow another moving character designated as the leader. Generally the followers want to stay near the leader, without crowding the leader, and taking care to stay out of the leader’s way (in case they happen to find them selves in front of the leader). In addition, if there is more than one follower, they want to avoid bumping each other. The implementation of leader following relies on arrival behavior (see above) a desire to move towards a point, slowing as it draws near. The arrival target is a point offset slightly behind the leader. (The offset distance might optionally increases with speed.) If a follower finds itself in a rectangular region in front of the leader, it will steer laterally away from the leader’s path before resuming arrival behavior. In addition the followers use separation behavior to prevent crowding each other."
 * @param {FollowLeaderSimpleBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function followLeaderSimple({
  leader,
  position,
  velocity,
  maxSpeed,
  distance,
  radius,
}) {
  const target = vec3.clone(leader.velocity);

  vec3.normalize(target, target);
  vec3.scale(target, target, distance);
  vec3.sub(target, leader.position, target);

  return arrive({ position, target, velocity, maxSpeed, radius });
}

/**
 * Notes: next behaviour should be a separation
 * @param {FollowLeaderBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function followLeader({
  leader,
  position,
  velocity,
  maxSpeed,
  distance,
  radius,
  evadeScale = 1,
  arriveScale = 1,
}) {
  const steering = vec3.create();

  const target = vec3.clone(leader.velocity);
  vec3.normalize(target, target);
  vec3.scale(target, target, distance);

  const ahead = vec3.clone(leader.position);
  vec3.add(ahead, ahead, target);

  vec3.negate(target, target);
  const behind = vec3.clone(leader.position);
  vec3.add(behind, behind, target);

  // TODO: use target or currentPosition for forces?
  // Note: use sphere instead of rectangle
  if (checkPositionsInSphere(position, ahead, leader.position, radius)) {
    vec3.scaleAndAdd(
      steering,
      steering,
      evade({
        position,
        target: leader.position,
        velocity,
        targetVelocity: leader.velocity,
        maxSpeed,
      }),
      evadeScale
    );
  }

  vec3.scaleAndAdd(
    steering,
    steering,
    arrive({
      position,
      target: leader.position,
      velocity,
      maxSpeed,
      radius,
    }),
    arriveScale
  );

  return steering;
}

// GROUPS
/**
 * "To compute steering for separation, first a search is made to find other characters within the specified neighborhood. [...] For each nearby character, a repulsive force is computed by subtracting the positions of our character and the nearby character, normalizing, and then applying a 1/r weighting. (That is, the position offset vector is scaled by 1/r 2.) Note that 1/r is just a setting that has worked well, not a fundamental value. These repulsive forces for each nearby character are summed together to produce the overall steering force."
 * @param {GroupsBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function separate({ boids, maxDistance, position, velocity, maxSpeed }) {
  const steering = vec3.create();

  const direction = vec3.create();

  let neighboursCount = 0;

  for (let i = 0; i < boids.length; i++) {
    vec3.sub(direction, position, boids[i].position);
    const length = vec3.length(direction);

    if (length > 0 && length < maxDistance) {
      vec3.scale(direction, direction, 1 / (length * length));
      vec3.add(steering, steering, direction);
      neighboursCount++;
    }
  }

  if (neighboursCount > 0) {
    return seek({ position, target: steering, velocity, maxSpeed });
  }
}

/**
 * "Cohesion steering behavior gives an character the ability to cohere with (approach and form a group with) other nearby characters. [...] Steering for cohesion can be computed by finding all characters in the local neighborhood (as described above for separation), computing the “average position” (or “center of gravity”) of the nearby characters. The steering force can applied in the direction of that “average position” (subtracting our character position from the average position, as in the original boids model), or it can be used as the target for seek steering behavior."
 * @param {GroupsBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function cohere({ boids, maxDistance, position, velocity, maxSpeed }) {
  const steering = vec3.create();

  const direction = vec3.create();
  let neighboursCount = 0;

  for (let i = 0; i < boids.length; i++) {
    vec3.sub(direction, position, boids[i].position);
    const length = vec3.length(direction);

    if (length > 0 && length < maxDistance) {
      vec3.add(steering, steering, boids[i].position);
      neighboursCount++;
    }
  }

  if (neighboursCount > 0) {
    vec3.scale(steering, steering, 1 / neighboursCount);
    return seek({ position, target: steering, velocity, maxSpeed });
  }
}

/**
 * "Alignment steering behavior gives an character the ability to align itself with (that is, head in the same direction and/or speed as) other nearby characters [...]. Steering for alignment can be computed by finding all characters in the local neighborhood (as described above for separation), averaging together the velocity (or alternately, the unit forward vector) of the nearby characters. This average is the “desired velocity,” and so the steering vector is the difference between the average and our character’s current velocity (or alternately, its unit forward vector)."
 * @param {GroupsBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function align({ boids, maxDistance, position, velocity, maxSpeed }) {
  const steering = vec3.create();

  const direction = vec3.create();
  let neighboursCount = 0;

  for (let i = 0; i < boids.length; i++) {
    vec3.sub(direction, position, boids[i].position);
    const length = vec3.length(direction);

    if (length > 0 && length < maxDistance) {
      vec3.add(steering, steering, boids[i].velocity);
      neighboursCount++;
    }
  }

  if (neighboursCount > 0) {
    vec3.scale(steering, steering, 1 / neighboursCount);

    vec3.normalize(steering, steering);
    vec3.scale(steering, steering, maxSpeed);

    return seek({ position, target: steering, velocity, maxSpeed });
  }
}

/**
 * "[...] in addition to other applications, the separation, cohesion and alignment behaviors can be combined to produce the boids model of flocks, herds and schools"
 * @param {GroupsBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function flock({ boids, maxDistance, position, velocity, maxSpeed }) {
  const steering = vec3.create();

  const separation = separate({
    boids,
    maxDistance,
    position,
    velocity,
    maxSpeed,
  });
  if (separation) vec3.add(steering, steering, separation);

  const cohesion = cohere({ boids, maxDistance, position, velocity, maxSpeed });
  if (cohesion) vec3.add(steering, steering, cohesion);

  const alignment = align({ boids, maxDistance, position, velocity, maxSpeed });
  if (alignment) vec3.add(steering, steering, alignment);

  return steering;
}

// CONSTRAINTS
/**
 * Constraint in system bounds.
 * @param {BoundsConstraintBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function boundsConstrain({
  center,
  bounds,
  position,
  velocity,
  maxSpeed,
  maxForce,
  fixedDistance = false,
}) {
  const desiredVelocity = vec3.create();

  const predictedPosition = vec3.create();
  vec3.add(
    predictedPosition,
    position,
    getPredictedOffsetFromVelocity(velocity, maxSpeed, fixedDistance)
  );

  for (let i = 0; i < 3; i++) {
    if (predictedPosition[i] > center[i] + bounds[i] * 0.5) {
      desiredVelocity[i] = -maxSpeed;
    }
    if (predictedPosition[i] < center[i] - bounds[i] * 0.5) {
      desiredVelocity[i] = maxSpeed;
    }
  }

  if (vec3.length(desiredVelocity) > 0) {
    const steering = vec3.clone(desiredVelocity);
    vec3.normalize(steering, steering);
    vec3.scale(steering, steering, maxSpeed);
    vec3.sub(steering, steering, velocity);
    return limit(steering, steering, maxForce);
  }
}

/**
 * Constraint in sphere bounds.
 * @param {SphereConstraintBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function sphereConstrain({
  center,
  radius,
  position,
  velocity,
  maxSpeed,
  maxForce,
  fixedDistance = false,
}) {
  const predictedPosition = vec3.create();
  vec3.add(
    predictedPosition,
    position,
    getPredictedOffsetFromVelocity(velocity, maxSpeed, fixedDistance)
  );

  const distance = vec3.distance(center, predictedPosition);

  if (distance > radius) {
    const steering = vec3.clone(position);
    vec3.sub(steering, center, steering);
    vec3.normalize(steering, steering);
    vec3.scale(steering, steering, maxSpeed);
    vec3.sub(steering, steering, velocity);
    return limit(steering, steering, maxForce);
  }
}

// TODO: add random velocity in the right direction when respawn
/**
 * Wrap to opposite bound (no velocity change).
 * @param {BoundsWrapConstraintBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function boundsWrapConstrain({ position, center, bounds }) {
  for (let i = 0; i < 3; i++) {
    const min = center[i] - bounds[i] * 0.5;
    const max = center[i] + bounds[i] * 0.5;
    if (position[i] > max) {
      position[i] = min;
    } else if (position[i] < min) {
      position[i] = max;
    }
  }
  return false;
}

/**
 * Wrap to opposite bound (no velocity change).
 * @param {SphereWrapConstraintBehaviorOptions} options
 * @returns {import("gl-matrix").vec3}
 */
export function sphereWrapConstrain({ position, center, radius }) {
  const distance = vec3.distance(center, position);
  if (distance > radius) {
    const opposite = vec3.create();
    vec3.sub(opposite, center, position);
    vec3.normalize(opposite, opposite);
    vec3.scale(opposite, opposite, radius - Number.EPSILON);
    vec3.copy(position, opposite);
  }
  return false;
}
