p5.prototype.rotateMatrix = function() {
  //in webgl mode
  if( this._renderer.isP3D ){
    this._renderer.rotateMatrix( arguments[0] );
  }
  else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

p5.prototype.rotateQuaternion = function() {
  //in webgl mode
  if( this._renderer.isP3D ){
    this._renderer.rotateQuaternion( arguments[0] );
  }
  else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  ReactDOM.render( < />, document.body, callback );
  return this;
};


/* [rotateMatrix description]
 * @param  {Array} rotation matrix (returned from rotationMatrix function)
 * @return {p5.Renderer3D}      [description]
*/
p5.Renderer3D.prototype.rotateMatrix = function( rotmat ){
  this.uMVMatrix.rotateMatrix( rotmat );
  return this;
};

 /**
  * [rotateQuaternion description]
  * @param  {Array} quaternion (returned from quaternion function)
  * @return {p5.Renderer3D}      [description]
  */
p5.Renderer3D.prototype.rotateQuaternion = function( quat ){
  this.uMVMatrix.rotateQuaternion( quat );
  return this;
};


p5.prototype.transposeRotationMatrix = function(mat){
   //check if matrix is square
  if( mat instanceof Array && mat.length === 9 ) {
    var t00 = mat[0];
    var t10 = mat[1];
    var t20 = mat[2];
    var t01 = mat[3];
    var t11 = mat[4];
    var t21 = mat[5];
    var t02 = mat[6];
    var t12 = mat[7];
    var t22 = mat[8];

    return [ t00, t01, t02,t10, t11, t12,t20, t21, t22 ];
   }
   else{
     throw new Error( 'Rotation Matrix should be an array of 9 elements' );
   }
 };

p5.prototype.rotationMatrix = function(angleX,angleY,angleZ) {
  // Following the implementation in
  // https://dev.opera.com/articles/w3c-device-orientation-usage/

  var degtorad = Math.PI / 180; // Degree-to-Radian conversion

  var _x = angleX ? angleX * degtorad : 0; // beta value
  var _y = angleY ? angleY * degtorad : 0; // gamma value
  var _z = angleZ ? angleZ * degtorad : 0; // alpha value
  var cX = Math.cos( _x );
  var cY = Math.cos( _y );
  var cZ = Math.cos( _z );
  var sX = Math.sin( _x );
  var sY = Math.sin( _y );
  var sZ = Math.sin( _z );

  // ZXY rotation matrix construction
  // (i.e. rotations are applied first Z, then X, then Y)
  // This is for consistency with deviceOrientation API
  // See http://w3c.github.io/deviceorientation/spec-source-orientation.html
  // Since the p5 3D renderer multiplies the rotation matrix from the left
  // and not the right, we're using transpose of the rotation matrix below

  var m00 = cZ * cY - sZ * sX * sY;
  var m01 = cY * sZ + cZ * sX * sY;
  var m02 = - cX * sY;
  var m10 = - cX * sZ;
  var m11 = cZ * cX;
  var m12 = sX;
  var m20 = cY * sZ * sX + cZ * sY;
  var m21 = sZ * sY - cZ * cY * sX;
  var m22 = cX * cY;

  return [ m00, m01, m02, m10, m11, m12, m20, m21, m22 ];

 };

p5.Matrix.prototype.rotateMatrix = function( rotmat ) {
  var a00 = this.mat4[0];
  var a01 = this.mat4[1];
  var a02 = this.mat4[2];
  var a03 = this.mat4[3];
  var a10 = this.mat4[4];
  var a11 = this.mat4[5];
  var a12 = this.mat4[6];
  var a13 = this.mat4[7];
  var a20 = this.mat4[8];
  var a21 = this.mat4[9];
  var a22 = this.mat4[10];
  var a23 = this.mat4[11];

  var b00,b01,b02,b10,b11,b12,b20,b21,b22;

  if (rotmat instanceof Array && rotmat.length === 9) {
    b00 = rotmat[0];
    b01 = rotmat[1];
    b02 = rotmat[2];
    b10 = rotmat[3];
    b11 = rotmat[4];
    b12 = rotmat[5];
    b20 = rotmat[6];
    b21 = rotmat[7];
    b22 = rotmat[8];
  }
   else {
    throw new Error('Rotation Matrix should be an array of 9 elements');
  }

  // rotation-specific matrix multiplication
  this.mat4[0] = a00 * b00 + a10 * b01 + a20 * b02;
  this.mat4[1] = a01 * b00 + a11 * b01 + a21 * b02;
  this.mat4[2] = a02 * b00 + a12 * b01 + a22 * b02;
  this.mat4[3] = a03 * b00 + a13 * b01 + a23 * b02;
  this.mat4[4] = a00 * b10 + a10 * b11 + a20 * b12;
  this.mat4[5] = a01 * b10 + a11 * b11 + a21 * b12;
  this.mat4[6] = a02 * b10 + a12 * b11 + a22 * b12;
  this.mat4[7] = a03 * b10 + a13 * b11 + a23 * b12;
  this.mat4[8] = a00 * b20 + a10 * b21 + a20 * b22;
  this.mat4[9] = a01 * b20 + a11 * b21 + a21 * b22;
  this.mat4[10] = a02 * b20 + a12 * b21 + a22 * b22;
  this.mat4[11] = a03 * b20 + a13 * b21 + a23 * b22;

  return this;
};

p5.prototype.quaternion = function( angleX, angleY, angleZ) {

   // Following the implementation in
   // https://dev.opera.com/articles/w3c-device-orientation-usage/

  var degtorad = Math.PI / 180; // Degree-to-Radian conversion

  var _x = angleX  ? angleX  * degtorad : 0; // beta value
  var _y = angleY ? angleY * degtorad : 0; // gamma value
  var _z = angleZ ? angleZ * degtorad : 0; // alpha value

  var cX = Math.cos( _x/2 );
  var cY = Math.cos( _y/2 );
  var cZ = Math.cos( _z/2 );
  var sX = Math.sin( _x/2 );
  var sY = Math.sin( _y/2 );
  var sZ = Math.sin( _z/2 );

  // ZXY quaternion construction
  // (i.e. rotations are applied first Z, then X, then Y)
  // This is for consistency with deviceOrientation API
  // See http://w3c.github.io/deviceorientation/spec-source-orientation.html

  var w = cX * cY * cZ - sX * sY * sZ;
  var x = sX * cY * cZ - cX * sY * sZ;
  var y = cX * sY * cZ + sX * cY * sZ;
  var z = cX * cY * sZ + sX * sY * cZ;

  return [ w, x, y, z ];
};

p5.Matrix.prototype.rotateQuaternion = function( quat ){

  var a00 = this.mat4[0];
  var a01 = this.mat4[1];
  var a02 = this.mat4[2];
  var a03 = this.mat4[3];
  var a10 = this.mat4[4];
  var a11 = this.mat4[5];
  var a12 = this.mat4[6];
  var a13 = this.mat4[7];
  var a20 = this.mat4[8];
  var a21 = this.mat4[9];
  var a22 = this.mat4[10];
  var a23 = this.mat4[11];

  var b00,b01,b02,b10,b11,b12,b20,b21,b22;

  if ( quat instanceof Array && quat.length === 4 ) {
    // Note: We aren't checking if quaternion is normalized
    // Either implement this or make a note in the documentation
    var qw = quat[0];
    var qx = quat[1];
    var qy = quat[2];
    var qz = quat[3];

    // Since the p5 3D renderer multiplies the rotation matrix from the left
    // and not the right, we're using transpose of the rotation matrix below
    b00 = 1 - 2 * qy * qy - 2 * qz * qz;
    b01 = 2 * qx * qy + 2 * qz * qw;
    b02 = 2 * qx * qz - 2 * qy * qw;
    b10 = 2 * qx * qy - 2 * qz * qw;
    b11 = 1 - 2 * qx * qx - 2 * qz * qz;
    b12 = 2 * qy * qz + 2 * qx * qw;
    b20 = 2 * qx * qz + 2 * qy * qw;
    b21 = 2 * qy * qz - 2 * qx * qw;
    b22 = 1 - 2 * qx * qx - 2 * qy * qy;
  }
  else{
    throw new Error( 'Quaternion should be an array of 4 elements' );
  }

  // rotation-specific matrix multiplication
  this.mat4[0] = a00 * b00 + a10 * b01 + a20 * b02;
  this.mat4[1] = a01 * b00 + a11 * b01 + a21 * b02;
  this.mat4[2] = a02 * b00 + a12 * b01 + a22 * b02;
  this.mat4[3] = a03 * b00 + a13 * b01 + a23 * b02;
  this.mat4[4] = a00 * b10 + a10 * b11 + a20 * b12;
  this.mat4[5] = a01 * b10 + a11 * b11 + a21 * b12;
  this.mat4[6] = a02 * b10 + a12 * b11 + a22 * b12;
  this.mat4[7] = a03 * b10 + a13 * b11 + a23 * b12;
  this.mat4[8] = a00 * b20 + a10 * b21 + a20 * b22;
  this.mat4[9] = a01 * b20 + a11 * b21 + a21 * b22;
  this.mat4[10] = a02 * b20 + a12 * b21 + a22 * b22;
  this.mat4[11] = a03 * b20 + a13 * b21 + a23 * b22;

  return this;
};

p5.prototype.quaternionDot = function( w1, w2 ) {
  return ( w1[0] * w2[0] + w1[1] * w2[1] + w1[2] * w2[2] + w1[3] * w2[3]);
};

p5.prototype.quaternionNorm = function( w ){
  return this.quaternionDot( w, w );
};

p5.prototype.quaternionDistance = function( w1, w2 ){
  var _quatDot = this.quaternionDot( w1, w2 );
  return 1 - _quatDot * _quatDot;
};

p5.prototype.quaternionAngleBetween = function( w1, w2 ){
  var _quatDot = this.quaternionDot( w1, w2 );
  return Math.acos( 2 *_quatDot * _quatDot - 1 );
};

p5.prototype.quaternionConjugate = function( w ){
  return [ w[0], -w[1], -w[2], -w[3] ];
};

p5.prototype.quaternionMultiply = function( w1, w2 ){
  var _q0 = w1[0] * w2[0] - w1[1] * w2[1] - w1[2] * w2[2] - w1[3] * w2[3];
  var _q1 = w1[0] * w2[1] + w1[1] * w2[0] + w1[2] * w2[3] - w1[3] * w2[2];
  var _q2 = w1[0] * w2[2] - w1[1] * w2[3] + w1[2] * w2[0] + w1[3] * w2[1];
  var _q3 = w1[0] * w2[3] + w1[1] * w2[2] - w1[2] * w2[1] + w1[3] * w2[0];
  return [ _q0, _q1, _q2, _q3 ];
};

p5.prototype._ondeviceorientation = function ( e ) {
  this._updatePRotations();
  this._setProperty( 'rotationX', e.beta ? e.beta : 0 );
  this._setProperty( 'rotationY', e.gamma ? e.gamma : 0 );
  this._setProperty( 'rotationZ', e.alpha ? e.alpha : 0 );
  this._handleMotion();
};
