'use strict';
import singleJellyfish from "./AFrameSingleJellyfish"
import instancedJellyfish from "./AFrameInstancedJellyfish"
import {gradient} from "./AFrameGradient"

AFRAME.registerComponent("single-jellyfish", singleJellyfish);
AFRAME.registerComponent("instanced-jellyfish", instancedJellyfish);
AFRAME.registerComponent("gradient", gradient);
