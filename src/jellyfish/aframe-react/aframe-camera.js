import {Entity} from 'aframe-react';
import React from 'react';
import {CAMERA} from '../../data/const';

export default props => (
    <Entity camera={{fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR}} look-controls {...props}/>
);
