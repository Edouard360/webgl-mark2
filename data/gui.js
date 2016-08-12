import dat from '../node_modules/dat.gui/build/dat.gui'

/** @var {object} gui - A global variable for user interface */
var gui = new dat.GUI({ autoPlace: false });

/**
 * @var {object} handle - A global variable to hold handles
 * @property {int} handle.animation      - for cancelling the requestAnimationFrame
 * @property {int} handle.jellyfishCount - for changing the jellyfish count display between ≠ instances
 * @property {int} handle.averageFPS     - for changing the average FPS display between ≠ instances.
 */
 var handle = {};

export {gui, handle};