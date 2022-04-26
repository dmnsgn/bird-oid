/**
 * @typedef {number} Radians
 */

/**
 * @typedef {Object} BehaviorObject
 * @property {Function} fn
 * @property {boolean} enabled
 * @property {number} scale
 * @property {Object} options
 */

/**
 * @typedef {Object} ApplyBehaviorObject
 * @property {Boid[]} boids
 * @property {number} maxSpeed
 * @property {number} [maxForce]
 * @property {import("gl-matrix").vec3} center
 * @property {import("gl-matrix").vec3} bounds
 */

/**
 * @typedef {Object} BehaviorOptions
 * @property {import("gl-matrix").vec3} position
 * @property {import("gl-matrix").vec3} velocity
 * @property {number} maxSpeed
 */

// Basics
/**
 * @typedef {BehaviorOptions} BasicBehaviorOptions
 * @property {import("gl-matrix").vec3} target
 */
/**
 * @typedef {BasicBehaviorOptions} ExtendedBasicBehaviorOptions
 * @property {import("gl-matrix").vec3} targetVelocity
 */
/**
 * @typedef {BasicBehaviorOptions} BasicWithRadiusBehaviorOptions
 * @property {number} radius
 */

// Obstacles
/**
 * @typedef {BehaviorOptions} ObstacleBehaviorOptions
 * @property {Obstacles[]} obstacles
 * @property {number} maxAvoidForce
 * @property {boolean} [fixedDistance=false]
 */

// Wander
/**
 * @typedef {Object} WanderBehaviorOptions
 * @property {import("gl-matrix").vec3} velocity
 * @property {number} distance
 * @property {number} maxSpeed
 * @property {number} radius
 * @property {Radians} theta
 * @property {Radians} phi
 */

// Follow
/**
 * @typedef {BehaviorOptions} FollowPathBehaviorOptions
 * @property {Path} path
 * @property {boolean} [fixedDistance=false]
 */
/**
 * @typedef {BehaviorOptions} FollowFlowFieldSimpleBehaviorOptions
 * @property {import("vector-field").FlowField} flowField
 */
/**
 * @typedef {FollowFlowFieldSimpleBehaviorOptions} FollowFlowFieldBehaviorOptions
 * @property {import("vector-field").FlowField} flowField
 * @property {boolean} [fixedDistance=false]
 */
/**
 * @typedef {BehaviorOptions} FollowLeaderSimpleBehaviorOptions
 * @property {Boid} leader
 * @property {number} distance
 * @property {number} radius
 */
/**
 * @typedef {FollowLeaderSimpleBehaviorOptions} FollowLeaderBehaviorOptions
 * @property {number} [evadeScale=1]
 * @property {number} [arriveScale=1]
 */

// Groups
/**
 * @typedef {BehaviorOptions} GroupsBehaviorOptions
 * @property {Boid[]} boids
 * @property {number} maxDistance
 */

// Constraints
/**
 * @typedef {BehaviorOptions} ConstraintBehaviorOptions
 * @property {import("gl-matrix").vec3} center
 * @property {number} maxDistance
 * @property {boolean} [fixedDistance=false]
 */
/**
 * @typedef {ConstraintBehaviorOptions} BoundsConstraintBehaviorOptions
 * @property {import("gl-matrix").vec3} bounds
 */
/**
 * @typedef {ConstraintBehaviorOptions} SphereConstraintBehaviorOptions
 * @property {number} radius
 */
/**
 * @typedef {Object} WrapConstraintBehaviorOptions
 * @property {import("gl-matrix").vec3} position
 * @property {import("gl-matrix").vec3} center
 */
/**
 * @typedef {WrapConstraintBehaviorOptions} BoundsWrapConstraintBehaviorOptions
 * @property {import("gl-matrix").vec3} bounds
 */
/**
 * @typedef {WrapConstraintBehaviorOptions} SphereWrapConstraintBehaviorOptions
 * @property {number} radius
 */

export {};
