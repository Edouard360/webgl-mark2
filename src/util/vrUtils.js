export function fovToProjection( fov, rightHanded, zNear, zFar ) {

  var DEG2RAD = Math.PI / 180.0;

  var fovPort = {
    upTan: Math.tan( fov.upDegrees * DEG2RAD ),
    downTan: Math.tan( fov.downDegrees * DEG2RAD ),
    leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
    rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
  };

  return fovPortToProjection( fovPort, rightHanded, zNear, zFar );

}

function fovPortToProjection( fov, rightHanded, zNear, zFar ) {

    rightHanded = rightHanded === undefined ? true : rightHanded;
    zNear = zNear === undefined ? 0.01 : zNear;
    zFar = zFar === undefined ? 10000.0 : zFar;

    var handednessScale = rightHanded ? - 1.0 : 1.0;

    // start with an identity matrix
    var mobj = new THREE.Matrix4();
    var m = mobj.elements;

    // and with scale/offset info for normalized device coords
    var scaleAndOffset = fovToNDCScaleOffset( fov );

    // X result, map clip edges to [-w,+w]
    m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
    m[ 0 * 4 + 1 ] = 0.0;
    m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
    m[ 0 * 4 + 3 ] = 0.0;

    // Y result, map clip edges to [-w,+w]
    // Y offset is negated because this proj matrix transforms from world coords with Y=up,
    // but the NDC scaling has Y=down (thanks D3D?)
    m[ 1 * 4 + 0 ] = 0.0;
    m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
    m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
    m[ 1 * 4 + 3 ] = 0.0;

    // Z result (up to the app)
    m[ 2 * 4 + 0 ] = 0.0;
    m[ 2 * 4 + 1 ] = 0.0;
    m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
    m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

    // W result (= Z in)
    m[ 3 * 4 + 0 ] = 0.0;
    m[ 3 * 4 + 1 ] = 0.0;
    m[ 3 * 4 + 2 ] = handednessScale;
    m[ 3 * 4 + 3 ] = 0.0;

    mobj.transpose();

    return mobj;

}

function fovToNDCScaleOffset( fov ) {

  var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
  var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
  var pyscale = 2.0 / ( fov.upTan + fov.downTan );
  var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
  return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };

}
