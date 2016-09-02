'use strict';
import 'aframe'
import singleJellyfish from "./aframe-single-jellyfish"
import instancedJellyfish from "./aframe-instanced-jellyfish"
import {gradient} from "./aframe-gradient"
import {sky} from "./aframe-sky"
import {surface} from "./aframe-surface"
import {render} from "./render-component/render-component"

import 'aframe-particle-system-component'

AFRAME.registerComponent("single-jellyfish", singleJellyfish);
AFRAME.registerComponent("instanced-jellyfish", instancedJellyfish);
AFRAME.registerComponent("gradient", gradient);
AFRAME.registerComponent("surface",surface);
AFRAME.registerComponent("render", render);

AFRAME.registerShader("sky", sky);

