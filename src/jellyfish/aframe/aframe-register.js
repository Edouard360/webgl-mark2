'use strict';
import 'aframe'
import singleJellyfish from "./aframe-single-jellyfish"
import instancedJellyfish from "./aframe-instanced-jellyfish"
import {gradient} from "./aframe-gradient"

AFRAME.registerComponent("single-jellyfish", singleJellyfish);
AFRAME.registerComponent("instanced-jellyfish", instancedJellyfish);
AFRAME.registerComponent("gradient", gradient);


