

/**
* @requires constants
* @todo see methods below needing further implementation.
* future consideration: implement SIMD optimizations
* when browser compatibility becomes available
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/
*   Reference/Global_Objects/SIMD
*/

'use strict';

var p5 = require('../lib/p5.js');
var polarGeometry = require('p5.polargeometry');
var constants = require('p5.constants');
var GLMAT_ARRAY_TYPE = (
    typeof Float32Array !== 'undefined') ?
  Float32Array : Array;

/**
 * A class to describe a 4x4 matrix
 * for model and view matrix manipulation in the p5js webgl renderer.
 * class p5.Matrix
 * @constructor
 * @param {Array} [mat4] array literal of our 4x4 matrix
 */
p5.Matrix = function() {
  // This is how it comes in with createMatrix()
  if(arguments[0] instanceof p5) {
    // save reference to p5 if passed in
    this.p5 = arguments[0];
    this.mat4  = arguments[1] || new GLMAT_ARRAY_TYPE([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  // This is what we'll get with new p5.Matrix()
  // a mat4 identity matrix
  } else {
    this.mat4 = arguments[0] || new GLMAT_ARRAY_TYPE([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
  return this;
};

/**
 * Sets the x, y, and z component of the vector using two or three separate
 * variables, the data from a p5.Matrix, or the values from a float array.
 *
 * @param {p5.Matrix|Array} [inMatrix] the input p5.Matrix or
 *                                     an Array of length 16
 */
p5.Matrix.prototype.set = function (inMatrix) {
  if (inMatrix instanceof p5.Matrix) {
    this.mat4 = inMatrix.mat4;
    return this;
  }
  else if (inMatrix instanceof GLMAT_ARRAY_TYPE) {
    this.mat4 = inMatrix;
    return this;
  }
  return this;
};

/**
 * Gets a copy of the vector, returns a p5.Matrix object.
 *
 * @return {p5.Matrix} the copy of the p5.Matrix object
 */
p5.Matrix.prototype.get = function () {
  return new p5.Matrix(this.mat4);
};

/**
 * return a copy of a matrix
 * @return {p5.Matrix}   the result matrix
 */
p5.Matrix.prototype.copy = function(){
  var copied = new p5.Matrix();
  copied.mat4[0] = this.mat4[0];
  copied.mat4[1] = this.mat4[1];
  copied.mat4[2] = this.mat4[2];
  copied.mat4[3] = this.mat4[3];
  copied.mat4[4] = this.mat4[4];
  copied.mat4[5] = this.mat4[5];
  copied.mat4[6] = this.mat4[6];
  copied.mat4[7] = this.mat4[7];
  copied.mat4[8] = this.mat4[8];
  copied.mat4[9] = this.mat4[9];
  copied.mat4[10] = this.mat4[10];
  copied.mat4[11] = this.mat4[11];
  copied.mat4[12] = this.mat4[12];
  copied.mat4[13] = this.mat4[13];
  copied.mat4[14] = this.mat4[14];
  copied.mat4[15] = this.mat4[15];
  return copied;
};

/**
 * return an identity matrix
 * @return {p5.Matrix}   the result matrix
 */
p5.Matrix.identity = function(){
  return new p5.Matrix();
};

/**
 * transpose according to a given matrix
 * @param  {p5.Matrix | Typed Array} a  the matrix to be based on to transpose
 * @return {p5.Matrix}                  this
 */
p5.Matrix.prototype.transpose = function(a){
  var a01, a02, a03, a12, a13, a23;
  if(a instanceof p5.Matrix){
    a01 = a.mat4[1];
    a02 = a.mat4[2];
    a03 = a.mat4[3];
    a12 = a.mat4[6];
    a13 = a.mat4[7];
    a23 = a.mat4[11];

    this.mat4[0] = a.mat4[0];
    this.mat4[1] = a.mat4[4];
    this.mat4[2] = a.mat4[8];
    this.mat4[3] = a.mat4[12];
    this.mat4[4] = a01;
    this.mat4[5] = a.mat4[5];
    this.mat4[6] = a.mat4[9];
    this.mat4[7] = a.mat4[13];
    this.mat4[8] = a02;
    this.mat4[9] = a12;
    this.mat4[10] = a.mat4[10];
    this.mat4[11] = a.mat4[14];
    this.mat4[12] = a03;
    this.mat4[13] = a13;
    this.mat4[14] = a23;
    this.mat4[15] = a.mat4[15];

  }else if(a instanceof GLMAT_ARRAY_TYPE){
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a12 = a[6];
    a13 = a[7];
    a23 = a[11];

    this.mat4[0] = a[0];
    this.mat4[1] = a[4];
    this.mat4[2] = a[8];
    this.mat4[3] = a[12];
    this.mat4[4] = a01;
    this.mat4[5] = a[5];
    this.mat4[6] = a[9];
    this.mat4[7] = a[13];
    this.mat4[8] = a02;
    this.mat4[9] = a12;
    this.mat4[10] = a[10];
    this.mat4[11] = a[14];
    this.mat4[12] = a03;
    this.mat4[13] = a13;
    this.mat4[14] = a23;
    this.mat4[15] = a[15];
  }
  return this;
};

/**
 * invert  matrix according to a give matrix
 * @param  {p5.Matrix or Typed Array} a   the matrix to be based on to invert
 * @return {p5.Matrix}                    this
 */
p5.Matrix.prototype.invert = function(a){
  var a00, a01, a02, a03, a10, a11, a12, a13,
  a20, a21, a22, a23, a30, a31, a32, a33;
  if(a instanceof p5.Matrix){
    a00 = a.mat4[0];
    a01 = a.mat4[1];
    a02 = a.mat4[2];
    a03 = a.mat4[3];
    a10 = a.mat4[4];
    a11 = a.mat4[5];
    a12 = a.mat4[6];
    a13 = a.mat4[7];
    a20 = a.mat4[8];
    a21 = a.mat4[9];
    a22 = a.mat4[10];
    a23 = a.mat4[11];
    a30 = a.mat4[12];
    a31 = a.mat4[13];
    a32 = a.mat4[14];
    a33 = a.mat4[15];
  }else if(a instanceof GLMAT_ARRAY_TYPE){
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    a30 = a[12];
    a31 = a[13];
    a32 = a[14];
    a33 = a[15];
  }
  var b00 = a00 * a11 - a01 * a10,
  b01 = a00 * a12 - a02 * a10,
  b02 = a00 * a13 - a03 * a10,
  b03 = a01 * a12 - a02 * a11,
  b04 = a01 * a13 - a03 * a11,
  b05 = a02 * a13 - a03 * a12,
  b06 = a20 * a31 - a21 * a30,
  b07 = a20 * a32 - a22 * a30,
  b08 = a20 * a33 - a23 * a30,
  b09 = a21 * a32 - a22 * a31,
  b10 = a21 * a33 - a23 * a31,
  b11 = a22 * a33 - a23 * a32,

  // Calculate the determinant
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 -
  b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  this.mat4[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  this.mat4[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  this.mat4[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  this.mat4[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  this.mat4[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  this.mat4[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  this.mat4[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  this.mat4[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  this.mat4[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  this.mat4[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  this.mat4[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  this.mat4[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  this.mat4[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  this.mat4[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  this.mat4[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  this.mat4[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return this;
};

/**
 * inspired by Toji's mat4 determinant
 * @return {Number} Determinant of our 4x4 matrix
 */
p5.Matrix.prototype.determinant = function(){
  var d00 = (this.mat4[0] * this.mat4[5]) - (this.mat4[1] * this.mat4[4]),
    d01 = (this.mat4[0] * this.mat4[6]) - (this.mat4[2] * this.mat4[4]),
    d02 = (this.mat4[0] * this.mat4[7]) - (this.mat4[3] * this.mat4[4]),
    d03 = (this.mat4[1] * this.mat4[6]) - (this.mat4[2] * this.mat4[5]),
    d04 = (this.mat4[1] * this.mat4[7]) - (this.mat4[3] * this.mat4[5]),
    d05 = (this.mat4[2] * this.mat4[7]) - (this.mat4[3] * this.mat4[6]),
    d06 = (this.mat4[8] * this.mat4[13]) - (this.mat4[9] * this.mat4[12]),
    d07 = (this.mat4[8] * this.mat4[14]) - (this.mat4[10] * this.mat4[12]),
    d08 = (this.mat4[8] * this.mat4[15]) - (this.mat4[11] * this.mat4[12]),
    d09 = (this.mat4[9] * this.mat4[14]) - (this.mat4[10] * this.mat4[13]),
    d10 = (this.mat4[9] * this.mat4[15]) - (this.mat4[11] * this.mat4[13]),
    d11 = (this.mat4[10] * this.mat4[15]) - (this.mat4[11] * this.mat4[14]);

  // Calculate the determinant
  return d00 * d11 - d01 * d10 + d02 * d09 +
    d03 * d08 - d04 * d07 + d05 * d06;
};

/**
 * multiply two mat4s
 * @param {p5.Matrix | Array}  multMatrix The matrix we want to multiply by
 * @return {p5.Matrix}         this
 */
p5.Matrix.prototype.mult = function(multMatrix){
  var _dest = new GLMAT_ARRAY_TYPE(16);
  var _src = new GLMAT_ARRAY_TYPE(16);

  if(multMatrix instanceof p5.Matrix) {
    _src = multMatrix.mat4;
  }
  else if(multMatrix instanceof GLMAT_ARRAY_TYPE){
    _src = multMatrix;
  }

  // each row is used for the multiplier
  var b0  = this.mat4[0], b1 = this.mat4[1],
    b2 = this.mat4[2], b3 = this.mat4[3];
  _dest[0] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[1] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[2] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[3] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  b0 = this.mat4[4];
  b1 = this.mat4[5];
  b2 = this.mat4[6];
  b3 = this.mat4[7];
  _dest[4] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[5] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[6] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[7] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  b0 = this.mat4[8];
  b1 = this.mat4[9];
  b2 = this.mat4[10];
  b3 = this.mat4[11];
  _dest[8] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[9] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[10] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[11] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  b0 = this.mat4[12];
  b1 = this.mat4[13];
  b2 = this.mat4[14];
  b3 = this.mat4[15];
  _dest[12] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[13] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[14] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[15] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  this.mat4 = _dest;

  return this;
};

/**
 * scales a p5.Matrix by scalars or a vector
 * @param  {p5.Vector | Array }
 *                      vector to scale by
 * @return {p5.Matrix}  this
 */
p5.Matrix.prototype.scale = function() {
  var x,y,z;
  var args = new Array(arguments.length);
  for(var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  //if our 1st arg is a type p5.Vector
  if (args[0] instanceof p5.Vector){
    x = args[0].x;
    y = args[0].y;
    z = args[0].z;
  }
  //otherwise if it's an array
  else if (args[0] instanceof Array){
    x = args[0][0];
    y = args[0][1];
    z = args[0][2];
  }
  var _dest = new GLMAT_ARRAY_TYPE(16);
  _dest[0] = this.mat4[0] * x;
  _dest[1] = this.mat4[1] * x;
  _dest[2] = this.mat4[2] * x;
  _dest[3] = this.mat4[3] * x;
  _dest[4] = this.mat4[4] * y;
  _dest[5] = this.mat4[5] * y;
  _dest[6] = this.mat4[6] * y;
  _dest[7] = this.mat4[7] * y;
  _dest[8] = this.mat4[8] * z;
  _dest[9] = this.mat4[9] * z;
  _dest[10] = this.mat4[10] * z;
  _dest[11] = this.mat4[11] * z;
  _dest[12] = this.mat4[12];
  _dest[13] = this.mat4[13];
  _dest[14] = this.mat4[14];
  _dest[15] = this.mat4[15];

  this.mat4 = _dest;
  return this;
};

/**
 * rotate our Matrix around an axis by the given angle.
 * @param  {Number} a The angle of rotation in radians
 * @param  {p5.Vector | Array} axis  the axis(es) to rotate around
 * @return {p5.Matrix}                    this
 * inspired by Toji's gl-matrix lib, mat4 rotation
 */
p5.Matrix.prototype.rotate = function(a, axis){
  var x, y, z, _a, len;

  if (this.p5) {
    if (this.p5._angleMode === constants.DEGREES) {
      _a = polarGeometry.degreesToRadians(a);
    }
  }
  else {
    _a = a;
  }
  if (axis instanceof p5.Vector) {
    x = axis.x;
    y = axis.y;
    z = axis.z;
  }
  else if (axis instanceof Array) {
    x = axis[0];
    y = axis[1];
    z = axis[2];
  }

  len = Math.sqrt(x * x + y * y + z * z);
  x *= (1/len);
  y *= (1/len);
  z *= (1/len);

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

  //sin,cos, and tan of respective angle
  var sA = Math.sin(_a);
  var cA = Math.cos(_a);
  var tA = 1 - cA;
  // Construct the elements of the rotation matrix
  var b00 = x * x * tA + cA;
  var b01 = y * x * tA + z * sA;
  var b02 = z * x * tA - y * sA;
  var b10 = x * y * tA - z * sA;
  var b11 = y * y * tA + cA;
  var b12 = z * y * tA + x * sA;
  var b20 = x * z * tA + y * sA;
  var b21 = y * z * tA - x * sA;
  var b22 = z * z * tA + cA;

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

p5.prototype.transposeRotationMatrix = function(mat){
  //check if matrix is square
  if(mat instanceof Array && mat.length === 9){
    var t00 = mat[0];
    var t10 = mat[1];
    var t20 = mat[2];
    var t01 = mat[3];
    var t11 = mat[4];
    var t21 = mat[5];
    var t02 = mat[6];
    var t12 = mat[7];
    var t22 = mat[8];

    return [t00, t01, t02,t10, t11, t12,t20, t21, t22];

  }
  else{
    throw new Error('Rotation Matrix should be an array of 9 elements');
  }
};

p5.prototype.rotationMatrix = function(angleX,angleY,angleZ) {

  // Following the implementation in
  // https://dev.opera.com/articles/w3c-device-orientation-usage/

  var degtorad = Math.PI / 180; // Degree-to-Radian conversion

  var _x = angleX  ? angleX  * degtorad : 0; // beta value
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

  return [m00, m01, m02, m10, m11, m12, m20, m21, m22];

};

p5.Matrix.prototype.rotateMatrix = function(rotmat){

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
  else{
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

p5.prototype.quaternion = function(angleX,angleY,angleZ) {

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

p5.prototype.quaternionDot = function(w1,w2){
  return (w1[0]*w2[0] + w1[1]*w2[1] + w1[2]*w2[2] + w1[3]*w2[3]);
};

p5.prototype.quaternionNorm = function(w){
  return this.quaternionDot(w,w);
};

p5.prototype.quaternionDistance = function(w1,w2){
  var _quatDot = this.quaternionDot(w1,w2);
  return 1 - _quatDot*_quatDot;
};

p5.prototype.quaternionAngleBetween = function(w1,w2){
  var _quatDot = this.quaternionDot(w1,w2);
  return Math.acos(2*_quatDot*_quatDot - 1);
};

p5.prototype.quaternionConjugate = function(w){
  return [w[0],-w[1],-w[2],-w[3]];
};

p5.prototype.quaternionMultiply = function(w1,w2){
  var _q0 = w1[0]*w2[0] - w1[1]*w2[1] - w1[2]*w2[2] - w1[3]*w2[3];
  var _q1 = w1[0]*w2[1] + w1[1]*w2[0] + w1[2]*w2[3] - w1[3]*w2[2];
  var _q2 = w1[0]*w2[2] - w1[1]*w2[3] + w1[2]*w2[0] + w1[3]*w2[1];
  var _q3 = w1[0]*w2[3] + w1[1]*w2[2] - w1[2]*w2[1] + w1[3]*w2[0];
  return [_q0,_q1,_q2,_q3];
};

p5.Matrix.prototype.rotateQuaternion = function(quat){

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

  if (quat instanceof Array && quat.length === 4) {

    // Note: We aren't checking if quaternion is normalized
    // Either implement this or make a note in the documentation
    var qw = quat[0];
    var qx = quat[1];
    var qy = quat[2];
    var qz = quat[3];

    // Since the p5 3D renderer multiplies the rotation matrix from the left
    // and not the right, we're using transpose of the rotation matrix below
    b00 = 1 - 2*qy*qy - 2*qz*qz;
    b01 = 2*qx*qy + 2*qz*qw;
    b02 = 2*qx*qz - 2*qy*qw;
    b10 = 2*qx*qy - 2*qz*qw;
    b11 = 1 - 2*qx*qx - 2*qz*qz;
    b12 = 2*qy*qz + 2*qx*qw;
    b20 = 2*qx*qz + 2*qy*qw;
    b21 = 2*qy*qz - 2*qx*qw;
    b22 = 1 - 2*qx*qx - 2*qy*qy;
  }
  else{
    throw new Error('Quaternion should be an array of 4 elements');
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

 /**
  * @todo  finish implementing this method!
  * translates
 * @param  {Array} v vector to translate by
 * @return {p5.Matrix}                    this
 */
p5.Matrix.prototype.translate = function(v){
  var x = v[0],
    y = v[1],
    z = v[2] || 0;
  this.mat4[12] =
    this.mat4[0] * x +this.mat4[4] * y +this.mat4[8] * z +this.mat4[12];
  this.mat4[13] =
    this.mat4[1] * x +this.mat4[5] * y +this.mat4[9] * z +this.mat4[13];
  this.mat4[14] =
    this.mat4[2] * x +this.mat4[6] * y +this.mat4[10] * z +this.mat4[14];
  this.mat4[15] =
    this.mat4[3] * x +this.mat4[7] * y +this.mat4[11] * z +this.mat4[15];
};

p5.Matrix.prototype.rotateX = function(a){
  this.rotate(a, [1,0,0]);
};
p5.Matrix.prototype.rotateY = function(a){
  this.rotate(a, [0,1,0]);
};
p5.Matrix.prototype.rotateZ = function(a){
   this.rotate(a, [0,0,1]);
 };


 /**
  * sets the perspective matrix
  * @param  {Number} fovy   [description]
  * @param  {Number} aspect [description]
  * @param  {Number} near   near clipping plane
  * @param  {Number} far    far clipping plane
  * @return {void}
  */
p5.Matrix.prototype.perspective = function(fovy,aspect,near,far){

  var f = 1.0 / Math.tan(fovy / 2),
    nf = 1 / (near - far);

  this.mat4[0] = f / aspect;
  this.mat4[1] = 0;
  this.mat4[2] = 0;
  this.mat4[3] = 0;
  this.mat4[4] = 0;
  this.mat4[5] = f;
  this.mat4[6] = 0;
  this.mat4[7] = 0;
  this.mat4[8] = 0;
  this.mat4[9] = 0;
  this.mat4[10] = (far + near) * nf;
  this.mat4[11] = -1;
  this.mat4[12] = 0;
  this.mat4[13] = 0;
  this.mat4[14] = (2 * far * near) * nf;
  this.mat4[15] = 0;

  return this;

};

/**
 * sets the ortho matrix
 * @param  {Number} left   [description]
 * @param  {Number} right  [description]
 * @param  {Number} bottom [description]
 * @param  {Number} top    [description]
 * @param  {Number} near   near clipping plane
 * @param  {Number} far    far clipping plane
 * @return {void}
 */
p5.Matrix.prototype.ortho = function(left,right,bottom,top,near,far){

  var lr = 1 / (left - right),
    bt = 1 / (bottom - top),
    nf = 1 / (near - far);
  this.mat4[0] = -2 * lr;
  this.mat4[1] = 0;
  this.mat4[2] = 0;
  this.mat4[3] = 0;
  this.mat4[4] = 0;
  this.mat4[5] = -2 * bt;
  this.mat4[6] = 0;
  this.mat4[7] = 0;
  this.mat4[8] = 0;
  this.mat4[9] = 0;
  this.mat4[10] = 2 * nf;
  this.mat4[11] = 0;
  this.mat4[12] = (left + right) * lr;
  this.mat4[13] = (top + bottom) * bt;
  this.mat4[14] = (far + near) * nf;
  this.mat4[15] = 1;

  return this;
};

/**
 * PRIVATE
 */
// matrix methods adapted from:
// https://developer.mozilla.org/en-US/docs/Web/WebGL/
// gluPerspective
//
// function _makePerspective(fovy, aspect, znear, zfar){
//    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
//    var ymin = -ymax;
//    var xmin = ymin * aspect;
//    var xmax = ymax * aspect;
//    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
//  }

////
//// glFrustum
////
//function _makeFrustum(left, right, bottom, top, znear, zfar){
//  var X = 2*znear/(right-left);
//  var Y = 2*znear/(top-bottom);
//  var A = (right+left)/(right-left);
//  var B = (top+bottom)/(top-bottom);
//  var C = -(zfar+znear)/(zfar-znear);
//  var D = -2*zfar*znear/(zfar-znear);
//  var frustrumMatrix =[
//  X, 0, A, 0,
//  0, Y, B, 0,
//  0, 0, C, D,
//  0, 0, -1, 0
//];
//return frustrumMatrix;
// }

// function _setMVPMatrices(){
////an identity matrix
////@TODO use the p5.Matrix class to abstract away our MV matrices and
///other math
//var _mvMatrix =
//[
//  1.0,0.0,0.0,0.0,
//  0.0,1.0,0.0,0.0,
//  0.0,0.0,1.0,0.0,
//  0.0,0.0,0.0,1.0
//];

module.exports = p5.Matrix;

'use strict';

var p5 = require('p5.js');
var shader = require('p5.shader');
require('p5.Renderer');
require('p5.Matrix');
var uMVMatrixStack = [];
var RESOLUTION = 1000;

//@TODO should probably implement an override for these attributes
var attributes = {
  alpha: true,
  depth: true,
  stencil: true,
  antialias: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false
};

/**
 * 3D graphics class.  Can also be used as an off-screen graphics buffer.
 * A p5.Renderer3D object can be constructed
 *
 */
p5.Renderer3D = function(elt, pInst, isMainCanvas) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);

  try {
    this.drawingContext = this.canvas.getContext('webgl', attributes) ||
      this.canvas.getContext('experimental-webgl', attributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      console.log('p5.Renderer3D: enabled webgl context');
    }
  } catch (er) {
    throw new Error(er);
  }

  this.isP3D = true; //lets us know we're in 3d mode
  this.GL = this.drawingContext;
  var gl = this.GL;
  gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  this._init();
  return this;
};

p5.Renderer3D.prototype = Object.create(p5.Renderer.prototype);

p5.Renderer3D.prototype._applyDefaults = function() {
  return this;
};

//////////////////////////////////////////////
// Setting
//////////////////////////////////////////////

p5.Renderer3D.prototype._init = function(first_argument) {
  var gl = this.GL;
  //for our default matrices
  this.initMatrix();
  this.initHash();
  //for immedidate mode
  this.verticeStack = [];
  this.verticeBuffer = gl.createBuffer();
  this.colorBuffer = gl.createBuffer();
  //for camera
  this._setCamera = false;
  //for counting lights
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
};

p5.Renderer3D.prototype._update = function() {
  this.resetMatrix();
  this.translate(0, 0, -800);
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
  this.verticeStack = [];
};

/**
 * [resize description]
 * @param  {[type]} w [description]
 * @param  {[tyoe]} h [description]
 * @return {[type]}   [description]
 */
p5.Renderer3D.prototype.resize = function(w,h) {
  var gl = this.GL;
  p5.Renderer.prototype.resize.call(this, w, h);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

/**
 * [background description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.background = function() {
  var gl = this.GL;
  var _col = this._pInst.color.apply(this._pInst, arguments);
  // gl.clearColor(0.0,0.0,0.0,1.0);
  var _r = (_col.levels[0]) / 255;
  var _g = (_col.levels[1]) / 255;
  var _b = (_col.levels[2]) / 255;
  var _a = (_col.levels[3]) / 255;
  gl.clearColor(_r, _g, _b, _a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

//@TODO implement this
// p5.Renderer3D.prototype.clear = function() {
//@TODO
// };

//////////////////////////////////////////////
// SHADER
//////////////////////////////////////////////

/**
 * [initShaders description]
 * @param  {[type]} vertId [description]
 * @param  {[type]} fragId [description]
 * @return {[type]}        [description]
 */
p5.Renderer3D.prototype.initShaders = function(vertId, fragId, immediateMode) {
  var gl = this.GL;
  //set up our default shaders by:
  // 1. create the shader,
  // 2. load the shader source,
  // 3. compile the shader
  var _vertShader = gl.createShader(gl.VERTEX_SHADER);
  //load in our default vertex shader
  gl.shaderSource(_vertShader, shader[vertId]);
  gl.compileShader(_vertShader);
  // if our vertex shader failed compilation?
  if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
    alert('Yikes! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_vertShader));
    return null;
  }

  var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  //load in our material frag shader
  gl.shaderSource(_fragShader, shader[fragId]);
  gl.compileShader(_fragShader);
  // if our frag shader failed compilation?
  if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
    alert('Darn! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_fragShader));
    return null;
  }

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, _vertShader);
  gl.attachShader(shaderProgram, _fragShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Snap! Error linking shader program');
  }
  //END SHADERS SETUP

  this._getLocation(shaderProgram, immediateMode);

  return shaderProgram;
};

p5.Renderer3D.prototype._getLocation = function(shaderProgram, immediateMode) {
  var gl = this.GL;
  gl.useProgram(shaderProgram);
  shaderProgram.uResolution =
    gl.getUniformLocation(shaderProgram, 'uResolution');
  gl.uniform1f(shaderProgram.uResolution, RESOLUTION);

  //vertex position Attribute
  shaderProgram.vertexPositionAttribute =
    gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  //projection Matrix uniform
  shaderProgram.uPMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
  //model view Matrix uniform
  shaderProgram.uMVMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');

  //@TODO: figure out a better way instead of if statement
  if(immediateMode === undefined){
    //vertex normal Attribute
    shaderProgram.vertexNormalAttribute =
      gl.getAttribLocation(shaderProgram, 'aNormal');
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    //normal Matrix uniform
    shaderProgram.uNMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uNormalMatrix');

    //texture coordinate Attribute
    shaderProgram.textureCoordAttribute =
      gl.getAttribLocation(shaderProgram, 'aTexCoord');
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.samplerUniform =
    gl.getUniformLocation(shaderProgram, 'uSampler');
  }
};

p5.Renderer3D.prototype.setMatrixUniforms = function(shaderKey) {
  var gl = this.GL;
  var shaderProgram = this.mHash[shaderKey];

  gl.useProgram(shaderProgram);

  gl.uniformMatrix4fv(
    shaderProgram.uPMatrixUniform,
    false, this.uPMatrix.mat4);

  gl.uniformMatrix4fv(
    shaderProgram.uMVMatrixUniform,
    false, this.uMVMatrix.mat4);

  this.uNMatrix = new p5.Matrix();
  this.uNMatrix.invert(this.uMVMatrix);
  this.uNMatrix.transpose(this.uNMatrix);

  gl.uniformMatrix4fv(
    shaderProgram.uNMatrixUniform,
    false, this.uNMatrix.mat4);
};
//////////////////////////////////////////////
// GET CURRENT | for shader and color
//////////////////////////////////////////////
p5.Renderer3D.prototype._getShader = function(vertId, fragId, immediateMode) {
  var mId = vertId+ '|' + fragId;
  //create it and put it into hashTable
  if(!this.materialInHash(mId)){
    var shaderProgram = this.initShaders(vertId, fragId, immediateMode);
    this.mHash[mId] = shaderProgram;
  }
  this.curShaderId = mId;

  return this.mHash[this.curShaderId];
};

p5.Renderer3D.prototype._getCurShaderId = function(){
  //if it's not defined yet
  if(this.curShaderId === undefined){
    //default shader: normalMaterial()
    var mId = 'normalVert|normalFrag';
    var shaderProgram = this.initShaders('normalVert', 'normalFrag');
    this.mHash[mId] = shaderProgram;
    this.curShaderId = mId;
  }

  return this.curShaderId;
};

p5.Renderer3D.prototype._getCurColor = function() {
  //default color: gray
  if(this.curColor === undefined) {
    this.curColor = [0.5, 0.5, 0.5, 1.0];
  }
  return this.curColor;
};

//////////////////////////////////////////////
// HASH | for material and geometry
//////////////////////////////////////////////

p5.Renderer3D.prototype.initHash = function(){
  this.gHash = {};
  this.mHash = {};
};

p5.Renderer3D.prototype.geometryInHash = function(gId){
  return this.gHash[gId] !== undefined;
};

p5.Renderer3D.prototype.materialInHash = function(mId){
  return this.mHash[mId] !== undefined;
};

//////////////////////////////////////////////
// MATRIX
//////////////////////////////////////////////

p5.Renderer3D.prototype.initMatrix = function(){
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix  = new p5.Matrix();
  this.uNMatrix = new p5.Matrix();
};

p5.Renderer3D.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity();
  //this.uPMatrix = p5.Matrix.identity();
};

//detect if user didn't set the camera
//then call this function below
p5.Renderer3D.prototype._setDefaultCamera = function(){
  if(!this._setCamera){
    var _w = this.width;
    var _h = this.height;
    this.uPMatrix = p5.Matrix.identity();
    this.uPMatrix.perspective(60 / 180 * Math.PI, _w / _h, 0.1, 100);
    this._setCamera = true;
  }
};

/**
 * [translate description]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} z [description]
 * @return {[type]}   [description]
 * @todo implement handle for components or vector as args
 */
p5.Renderer3D.prototype.translate = function(x, y, z) {
  //@TODO: figure out how to fit the resolution
  x = x / RESOLUTION;
  y = -y / RESOLUTION;
  z = z / RESOLUTION;
  this.uMVMatrix.translate([x,y,z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @param  {Number | p5.Vector | Array} x [description]
 * @param  {Number} [y] y-axis scalar
 * @param  {Number} [z] z-axis scalar
 * @return {this}   [description]
 */
p5.Renderer3D.prototype.scale = function(x,y,z) {
  this.uMVMatrix.scale([x,y,z]);
  return this;
};

/**
 * [rotate description]
 * @param  {Number} rad  angle in radians
 * @param  {p5.Vector | Array} axis axis to rotate around
 * @return {p5.Renderer3D}      [description]
 */
p5.Renderer3D.prototype.rotate = function(rad, axis){
  this.uMVMatrix.rotate(rad, axis);
  return this;
 };

/**
 * [rotateMatrix description]
 * @param  {Array} rotation matrix (returned from rotationMatrix function)
 * @return {p5.Renderer3D}      [description]
 */
p5.Renderer3D.prototype.rotateMatrix = function(rotmat){
  this.uMVMatrix.rotateMatrix(rotmat);
  return this;
};

/**
 * [rotateQuaternion description]
 * @param  {Array} quaternion (returned from quaternion function)
 * @return {p5.Renderer3D}      [description]
 */
p5.Renderer3D.prototype.rotateQuaternion = function(quat){
  this.uMVMatrix.rotateQuaternion(quat);
  return this;
};

/**
 * [rotateX description]
 * @param  {Number} rad radians to rotate
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateX = function(rad) {
  this.uMVMatrix.rotateX(rad);
  return this;
};

/**
 * [rotateY description]
 * @param  {Number} rad rad radians to rotate
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateY = function(rad) {
  this.uMVMatrix.rotateY(rad);
  return this;
};

/**
 * [rotateZ description]
 * @param  {Number} rad rad radians to rotate
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateZ = function(rad) {
  this.uMVMatrix.rotateZ(rad);
  return this;
};

/**
 * pushes a copy of the model view matrix onto the
 * MV Matrix stack.
 * NOTE to self: could probably make this more readable
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.push = function() {
  uMVMatrixStack.push(this.uMVMatrix.copy());
};

/**
 * [pop description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.pop = function() {
  if (uMVMatrixStack.length === 0) {
    throw new Error('Invalid popMatrix!');
  }
  this.uMVMatrix = uMVMatrixStack.pop();
};

module.exports = p5.Renderer3D;

 /**
  * @module Transform
  * @submodule Transform
  * @for p5
  * @requires core
  * @requires constants
  */


'use strict';

var p5 = require('p5.js');
var constants = require('p5.constants');

 /**
  * Multiplies the current matrix by the one specified through the parameters.
  * This is very slow because it will try to calculate the inverse of the
  * transform, so avoid it whenever possible.
  *
  * @method applyMatrix
  * @param  {Number} n00 numbers which define the 3x2 matrix to be multiplied
  * @param  {Number} n01 numbers which define the 3x2 matrix to be multiplied
  * @param  {Number} n02 numbers which define the 3x2 matrix to be multiplied
  * @param  {Number} n10 numbers which define the 3x2 matrix to be multiplied
  * @param  {Number} n11 numbers which define the 3x2 matrix to be multiplied
  * @param  {Number} n12 numbers which define the 3x2 matrix to be multiplied
  * @return {p5}         the p5 object
  * @example
  * <div>
  * <code>
  * // Example in the works.
  * </code>
  * </div>
  */
p5.prototype.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
  this._renderer.applyMatrix(n00, n01, n02, n10, n11, n12);
  return this;
};

p5.prototype.popMatrix = function() {
  throw new Error('popMatrix() not used, see pop()');
};

p5.prototype.printMatrix = function() {
  throw new Error('printMatrix() not implemented');
};

p5.prototype.pushMatrix = function() {
  throw new Error('pushMatrix() not used, see push()');
};

 /**
  * Replaces the current matrix with the identity matrix.
  *
  * @method resetMatrix
  * @return {p5} the p5 object
  * @example
  * <div>
  * <code>
  * // Example in the works.
  * </code>
  * </div>
  */
p5.prototype.resetMatrix = function() {
  this._renderer.resetMatrix();
  return this;
};

 /**
  * Rotates a shape the amount specified by the angle parameter. This
  * function accounts for angleMode, so angles can be entered in either
  * RADIANS or DEGREES.
  * <br><br>
  * Objects are always rotated around their relative position to the
  * origin and positive numbers rotate objects in a clockwise direction.
  * Transformations apply to everything that happens after and subsequent
  * calls to the function accumulates the effect. For example, calling
  * rotate(HALF_PI) and then rotate(HALF_PI) is the same as rotate(PI).
  * All tranformations are reset when draw() begins again.
  * <br><br>
  * Technically, rotate() multiplies the current transformation matrix
  * by a rotation matrix. This function can be further controlled by
  * the push() and pop().
  *
  * @method rotate
  * @param  {Number} angle the angle of rotation, specified in radians
  *                        or degrees, depending on current angleMode
  * @return {p5}           the p5 object
  * @example
  * <div>
  * <code>
  * translate(width/2, height/2);
  * rotate(PI/3.0);
  * rect(-26, -26, 52, 52);
  * </code>
  * </div>
  */
p5.prototype.rotate = function() {
  var r = arguments[0];
  if (this._angleMode === constants.DEGREES) {
    r = this.radians(r);
  }
  //in webgl mode
  if(arguments.length > 1){
    this._renderer.rotate(r, arguments[1]);
  }
  else {
    this._renderer.rotate(r);
  }
  return this;
};

p5.prototype.rotateMatrix = function() {
  //in webgl mode
  if(this._renderer.isP3D){
    this._renderer.rotateMatrix(arguments[0]);
  }
  else {
    throw 'not supported in p2d. Please use webgl mode';
  }
 return this;
};

p5.prototype.rotateQuaternion = function() {
  //in webgl mode
  if(this._renderer.isP3D){
    this._renderer.rotateQuaternion(arguments[0]);
  }
  else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

  /**
   * [rotateX description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
p5.prototype.rotateX = function(rad) {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if (this._renderer.isP3D) {
    this._validateParameters(
      'rotateX',
       args,
      [
        ['Number']
      ]
    );
    this._renderer.rotateX(rad);
  } else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

 /**
  * [rotateY description]
  * @param  {[type]} rad [description]
  * @return {[type]}     [description]
  */
p5.prototype.rotateY = function(rad) {
  if (this._renderer.isP3D) {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }
    this._validateParameters(
      'rotateY',
       args,
      [
        ['Number']
      ]
    );
    this._renderer.rotateY(rad);
  } else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

 /**
  * [rotateZ description]
  * @param  {[type]} rad [description]
  * @return {[type]}     [description]
  */
p5.prototype.rotateZ = function(rad) {
  if (this._renderer.isP3D) {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }
    this._validateParameters(
      'rotateZ',
      args,
      [
        ['Number']
      ]
    );
    this._renderer.rotateZ(rad);
  } else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

 /**
  * Increases or decreases the size of a shape by expanding and contracting
  * vertices. Objects always scale from their relative origin to the
  * coordinate system. Scale values are specified as decimal percentages.
  * For example, the function call scale(2.0) increases the dimension of a
  * shape by 200%.
  * <br><br>
  * Transformations apply to everything that happens after and subsequent
  * calls to the function multiply the effect. For example, calling scale(2.0)
  * and then scale(1.5) is the same as scale(3.0). If scale() is called
  * within draw(), the transformation is reset when the loop begins again.
  * <br><br>
  * Using this fuction with the z parameter requires using P3D as a
  * parameter for size(), as shown in the third example above. This function
  * can be further controlled with push() and pop().
  *
  * @method scale
  * @param  {Number | p5.Vector | Array} s
  *                      percent to scale the object, or percentage to
  *                      scale the object in the x-axis if multiple arguments
  *                      are given
  * @param  {Number} [y] percent to scale the object in the y-axis
  * @param  {Number} [z] percent to scale the object in the z-axis (webgl only)
  * @return {p5}         the p5 object
  * @example
  * <div>
  * <code>
  * translate(width/2, height/2);
  * rotate(PI/3.0);
  * rect(-26, -26, 52, 52);
  * </code>
  * </div>
  *
  * <div>
  * <code>
  * rect(30, 20, 50, 50);
  * scale(0.5, 1.3);
  * rect(30, 20, 50, 50);
  * </code>
  * </div>
  */
p5.prototype.scale = function() {
  var x,y,z;
  var args = new Array(arguments.length);
  for(var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  if(args[0] instanceof p5.Vector){
    x = args[0].x;
    y = args[0].y;
    z = args[0].z;
  }
  else if(args[0] instanceof Array){
    x = args[0][0];
    y = args[0][1];
    z = args[0][2] || 1;
  }
  else {
    if(args.length === 1){
      x = y = z = args[0];
    }
    else {
      x = args[0];
      y = args[1];
      z = args[2] || 1;
    }
  }

  if(this._renderer.isP3D){
    this._renderer.scale.call(this._renderer, x,y,z);
  }
  else {
    this._renderer.scale.call(this._renderer, x,y);
  }
  return this;
};

 /**
  * Shears a shape around the x-axis the amount specified by the angle
  * parameter. Angles should be specified in the current angleMode.
  * Objects are always sheared around their relative position to the origin
  * and positive numbers shear objects in a clockwise direction.
  * <br><br>
  * Transformations apply to everything that happens after and subsequent
  * calls to the function accumulates the effect. For example, calling
  * shearX(PI/2) and then shearX(PI/2) is the same as shearX(PI).
  * If shearX() is called within the draw(), the transformation is reset when
  * the loop begins again.
  * <br><br>
  * Technically, shearX() multiplies the current transformation matrix by a
  * rotation matrix. This function can be further controlled by the
  * push() and pop() functions.
  *
  * @method shearX
  * @param  {Number} angle angle of shear specified in radians or degrees,
  *                        depending on current angleMode
  * @return {p5}           the p5 object
  * @example
  * <div>
  * <code>
  * translate(width/4, height/4);
  * shearX(PI/4.0);
  * rect(0, 0, 30, 30);
  * </code>
  * </div>
  */
p5.prototype.shearX = function(angle) {
  if (this._angleMode === constants.DEGREES) {
    angle = this.radians(angle);
  }
  this._renderer.shearX(angle);
  return this;
};

 /**
  * Shears a shape around the y-axis the amount specified by the angle
  * parameter. Angles should be specified in the current angleMode. Objects
  * are always sheared around their relative position to the origin and
  * positive numbers shear objects in a clockwise direction.
  * <br><br>
  * Transformations apply to everything that happens after and subsequent
  * calls to the function accumulates the effect. For example, calling
  * shearY(PI/2) and then shearY(PI/2) is the same as shearY(PI). If
  * shearY() is called within the draw(), the transformation is reset when
  * the loop begins again.
  * <br><br>
  * Technically, shearY() multiplies the current transformation matrix by a
  * rotation matrix. This function can be further controlled by the
  * push() and pop() functions.
  *
  * @method shearY
  * @param  {Number} angle angle of shear specified in radians or degrees,
  *                        depending on current angleMode
  * @return {p5}           the p5 object
  * @example
  * <div>
  * <code>
  * translate(width/4, height/4);
  * shearY(PI/4.0);
  * rect(0, 0, 30, 30);
  * </code>
  * </div>
  */
p5.prototype.shearY = function(angle) {
  if (this._angleMode === constants.DEGREES) {
    angle = this.radians(angle);
  }
  this._renderer.shearY(angle);
  return this;
};

 /**
  * Specifies an amount to displace objects within the display window.
  * The x parameter specifies left/right translation, the y parameter
  * specifies up/down translation.
  * <br><br>
  * Transformations are cumulative and apply to everything that happens after
  * and subsequent calls to the function accumulates the effect. For example,
  * calling translate(50, 0) and then translate(20, 0) is the same as
  * translate(70, 0). If translate() is called within draw(), the
  * transformation is reset when the loop begins again. This function can be
  * further controlled by using push() and pop().
  *
  * @method translate
  * @param  {Number} x left/right translation
  * @param  {Number} y up/down translation
  * @return {p5}       the p5 object
  * @example
  * <div>
  * <code>
  * translate(30, 20);
  * rect(0, 0, 55, 55);
  * </code>
  * </div>
  *
  * <div>
  * <code>
  * rect(0, 0, 55, 55);  // Draw rect at original 0,0
  * translate(30, 20);
  * rect(0, 0, 55, 55);  // Draw rect at new 0,0
  * translate(14, 14);
  * rect(0, 0, 55, 55);  // Draw rect at new 0,0
  * </code>
  * </div>
  */
p5.prototype.translate = function(x, y, z) {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  if ( this._renderer.isP3D ) {
    this._validateParameters(
      'translate',
       args,
      [
        //p3d
        ['Number', 'Number', 'Number']
      ]
    );
    this._renderer.translate(x, y, z);
  } else {
    this._validateParameters(
      'translate',
      args,
      [
        //p2d
        ['Number', 'Number']
      ]
    );
    this._renderer.translate(x, y);
   }
  return this;
};

module.exports = p5;

/**
 * @module Events
 * @submodule Acceleration
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('p5.js');

/**
 * The system variable deviceOrientation always contains the orientation of
 * the device. The value of this variable will either be set 'landscape'
 * or 'portrait'. If no data is available it will be set to 'undefined'.
 *
 * @property deviceOrientation
 */
p5.prototype.deviceOrientation = undefined;

/**
 * The system variable accelerationX always contains the acceleration of the
 * device along the x axis. Value is represented as meters per second squared.
 *
 * @property accelerationX
 */
p5.prototype.accelerationX = 0;

/**
 * The system variable accelerationY always contains the acceleration of the
 * device along the y axis. Value is represented as meters per second squared.
 *
 * @property accelerationY
 */
p5.prototype.accelerationY = 0;

/**
 * The system variable accelerationZ always contains the acceleration of the
 * device along the z axis. Value is represented as meters per second squared.
 *
 * @property accelerationZ
 */
p5.prototype.accelerationZ = 0;

/**
 * The system variable pAccelerationX always contains the acceleration of the
 * device along the x axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property pAccelerationX
 */
p5.prototype.pAccelerationX = 0;

/**
 * The system variable pAccelerationY always contains the acceleration of the
 * device along the y axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property pAccelerationY
 */
p5.prototype.pAccelerationY = 0;

/**
 * The system variable pAccelerationZ always contains the acceleration of the
 * device along the z axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property pAccelerationZ
 */
p5.prototype.pAccelerationZ = 0;

/**
 * _updatePAccelerations updates the pAcceleration values
 *
 * @private
 */
p5.prototype._updatePAccelerations = function(){
  this._setProperty('pAccelerationX', this.accelerationX);
  this._setProperty('pAccelerationY', this.accelerationY);
  this._setProperty('pAccelerationZ', this.accelerationZ);
};

/**
 * The system variable rotationX always contains the rotation of the
 * device along the x axis. Value is represented as 0 to +/-180 degrees.
 * <br><br>
 * Note: The order the rotations are called is important, ie. if used
 * together, it must be called in the order Z-X-Y or there might be
 * unexpected behaviour.
 *
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   //rotateZ(radians(rotationZ));
 *   rotateX(radians(rotationX));
 *   //rotateY(radians(rotationY));
 *   box(200, 200, 200);
 * }
 * </code>
 * </div>
 *
 * @property rotationX
 */
p5.prototype.rotationX = 0;

/**
 * The system variable rotationY always contains the rotation of the
 * device along the y axis. Value is represented as 0 to +/-90 degrees.
 * <br><br>
 * Note: The order the rotations are called is important, ie. if used
 * together, it must be called in the order Z-X-Y or there might be
 * unexpected behaviour.
 *
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   //rotateZ(radians(rotationZ));
 *   //rotateX(radians(rotationX));
 *   rotateY(radians(rotationY));
 *   box(200, 200, 200);
 * }
 * </code>
 * </div>
 *
 * @property rotationY
 */
p5.prototype.rotationY = 0;

/**
 * The system variable rotationZ always contains the rotation of the
 * device along the z axis. Value is represented as 0 to 359 degrees.
 * <br><br>
 * Unlike rotationX and rotationY, this variable is available for devices
 * with a built-in compass only.
 * <br><br>
 * Note: The order the rotations are called is important, ie. if used
 * together, it must be called in the order Z-X-Y or there might be
 * unexpected behaviour.
 *
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   rotateZ(radians(rotationZ));
 *   //rotateX(radians(rotationX));
 *   //rotateY(radians(rotationY));
 *   box(200, 200, 200);
 * }
 * </code>
 * </div>
 *
 * @property rotationZ
 */
p5.prototype.rotationZ = 0;

/**
 * The system variable pRotationX always contains the rotation of the
 * device along the x axis in the frame previous to the current frame. Value
 * is represented as 0 to +/-180 degrees.
 * <br><br>
 * pRotationX can also be used with rotationX to determine the rotate
 * direction of the device along the X-axis.
 * @example
 * <div class='norender'>
 * <code>
 * // A simple if statement looking at whether
 * // rotationX - pRotationX < 0 is true or not will be
 * // sufficient for determining the rotate direction
 * // in most cases.
 *
 * // Some extra logic is needed to account for cases where
 * // the angles wrap around.
 * var rotateDirection = 'clockwise';
 *
 * // Simple range conversion to make things simpler.
 * // This is not absolutely neccessary but the logic
 * // will be different in that case.
 *
 * var rX = rotationX + 180;
 * var pRX = pRotationX + 180;
 *
 * if ((rX - pRX > 0 && rX - pRX < 270)|| rX - pRX < -270){
 *   rotateDirection = 'clockwise';
 * } else if (rX - pRX < 0 || rX - pRX > 270){
 *   rotateDirection = 'counter-clockwise';
 * }
 * </code>
 * </div>
 *
 * @property pRotationX
 */
p5.prototype.pRotationX = 0;

/**
 * The system variable pRotationY always contains the rotation of the
 * device along the y axis in the frame previous to the current frame. Value
 * is represented as 0 to +/-90 degrees.
 * <br><br>
 * pRotationY can also be used with rotationY to determine the rotate
 * direction of the device along the Y-axis.
 * @example
 * <div class='norender'>
 * <code>
 * // A simple if statement looking at whether
 * // rotationY - pRotationY < 0 is true or not will be
 * // sufficient for determining the rotate direction
 * // in most cases.
 *
 * // Some extra logic is needed to account for cases where
 * // the angles wrap around.
 * var rotateDirection = 'clockwise';
 *
 * // Simple range conversion to make things simpler.
 * // This is not absolutely neccessary but the logic
 * // will be different in that case.
 *
 * var rY = rotationY + 180;
 * var pRY = pRotationY + 180;
 *
 * if ((rY - pRY > 0 && rY - pRY < 270)|| rY - pRY < -270){
 *   rotateDirection = 'clockwise';
 * } else if (rY - pRY < 0 || rY - pRY > 270){
 *   rotateDirection = 'counter-clockwise';
 * }
 * </code>
 * </div>
 *
 * @property pRotationY
 */
p5.prototype.pRotationY = 0;

/**
 * The system variable pRotationZ always contains the rotation of the
 * device along the z axis in the frame previous to the current frame. Value
 * is represented as 0 to 359 degrees.
 * <br><br>
 * pRotationZ can also be used with rotationZ to determine the rotate
 * direction of the device along the Z-axis.
 * @example
 * <div class='norender'>
 * <code>
 * // A simple if statement looking at whether
 * // rotationZ - pRotationZ < 0 is true or not will be
 * // sufficient for determining the rotate direction
 * // in most cases.
 *
 * // Some extra logic is needed to account for cases where
 * // the angles wrap around.
 * var rotateDirection = 'clockwise';
 *
 * if ((rotationZ - pRotationZ > 0 &&
 *   rotationZ - pRotationZ < 270)||
 *   rotationZ - pRotationZ < -270){
 *
 *   rotateDirection = 'clockwise';
 *
 * } else if (rotationZ - pRotationZ < 0 ||
 *   rotationZ - pRotationZ > 270){
 *
 *   rotateDirection = 'counter-clockwise';
 *
 * }
 * </code>
 * </div>
 *
 * @property pRotationZ
 */
p5.prototype.pRotationZ = 0;

var startAngleX = 0;
var startAngleY = 0;
var startAngleZ = 0;

var rotateDirectionX = 'clockwise';
var rotateDirectionY = 'clockwise';
var rotateDirectionZ = 'clockwise';

var pRotateDirectionX;
var pRotateDirectionY;
var pRotateDirectionZ;

p5.prototype._updatePRotations = function(){
  this._setProperty('pRotationX', this.rotationX);
  this._setProperty('pRotationY', this.rotationY);
  this._setProperty('pRotationZ', this.rotationZ);
};

p5.prototype.turnAxis = undefined;

var move_threshold = 0.5;
var shake_threshold = 30;

/**
 * The setMoveThreshold() function is used to set the movement threshold for
 * the deviceMoved() function. The default threshold is set to 0.5.
 *
 * @method setMoveThreshold
 * @param {number} value The threshold value
 */
p5.prototype.setMoveThreshold = function(val){
  if(typeof val === 'number'){
    move_threshold = val;
  }
};

/**
 * The setShakeThreshold() function is used to set the movement threshold for
 * the deviceShaken() function. The default threshold is set to 30.
 *
 * @method setShakeThreshold
 * @param {number} value The threshold value
 */
p5.prototype.setShakeThreshold = function(val){
  if(typeof val === 'number'){
    shake_threshold = val;
  }
};

/**
 * The deviceMoved() function is called when the device is moved by more than
 * the threshold value along X, Y or Z axis. The default threshold is set to
 * 0.5.
 * @method deviceMoved
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Move the device around
 * // to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * The deviceTurned() function is called when the device rotates by
 * more than 90 degrees continuously.
 * <br><br>
 * The axis that triggers the deviceTurned() method is stored in the turnAxis
 * variable. The deviceTurned() method can be locked to trigger on any axis:
 * X, Y or Z by comparing the turnAxis variable to 'X', 'Y' or 'Z'.
 *
 * @method deviceTurned
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees
 * // to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceTurned() {
 *   if (value == 0){
 *     value = 255
 *   } else if (value == 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees in the
 * // X-axis to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceTurned() {
 *   if (turnAxis == 'X'){
 *     if (value == 0){
 *       value = 255
 *     } else if (value == 255) {
 *       value = 0;
 *     }
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * The deviceShaken() function is called when the device total acceleration
 * changes of accelerationX and accelerationY values is more than
 * the threshold value. The default threshold is set to 30.
 * @method deviceShaken
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Shake the device to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceShaken() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */

p5.prototype._ondeviceorientation = function (e) {
  this._updatePRotations();
  this._setProperty('rotationX', e.beta ? e.beta : 0);
  this._setProperty('rotationY', e.gamma ? e.gamma : 0);
  this._setProperty('rotationZ', e.alpha ? e.alpha : 0);
  this._handleMotion();
};

p5.prototype._ondevicemotion = function (e) {
  this._updatePAccelerations();
  this._setProperty('accelerationX', e.acceleration.x * 2);
  this._setProperty('accelerationY', e.acceleration.y * 2);
  this._setProperty('accelerationZ', e.acceleration.z * 2);
  this._handleMotion();
};
p5.prototype._handleMotion = function() {
  if (window.orientation === 90 || window.orientation === -90) {
    this._setProperty('deviceOrientation', 'landscape');
  } else if (window.orientation === 0) {
    this._setProperty('deviceOrientation', 'portrait');
  } else if (window.orientation === undefined) {
    this._setProperty('deviceOrientation', 'undefined');
  }
  var deviceMoved = this.deviceMoved || window.deviceMoved;
  if (typeof deviceMoved === 'function') {
    if (Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold ||
      Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold ||
      Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold) {
      deviceMoved();
    }
  }
  var deviceTurned = this.deviceTurned || window.deviceTurned;
  if (typeof deviceTurned === 'function') {
    // The angles given by rotationX etc is from range -180 to 180.
    // The following will convert them to 0 to 360 for ease of calculation
    // of cases when the angles wrapped around.
    // _startAngleX will be converted back at the end and updated.
    var wRX = this.rotationX + 180;
    var wPRX = this.pRotationX + 180;
    var wSAX = startAngleX + 180;
    if ((wRX - wPRX > 0 && wRX - wPRX < 270)|| wRX - wPRX < -270){
      rotateDirectionX = 'clockwise';
    } else if (wRX - wPRX < 0 || wRX - wPRX > 270){
      rotateDirectionX = 'counter-clockwise';
    }
    if (rotateDirectionX !== pRotateDirectionX){
      wSAX = wRX;
    }
    if (Math.abs(wRX - wSAX) > 90 && Math.abs(wRX - wSAX) < 270){
      wSAX = wRX;
      this._setProperty('turnAxis', 'X');
      deviceTurned();
    }
    pRotateDirectionX = rotateDirectionX;
    startAngleX = wSAX - 180;

    // Y-axis is identical to X-axis except for changing some names.
    var wRY = this.rotationY + 180;
    var wPRY = this.pRotationY + 180;
    var wSAY = startAngleY + 180;
    if ((wRY - wPRY > 0 && wRY - wPRY < 270)|| wRY - wPRY < -270){
      rotateDirectionY = 'clockwise';
    } else if (wRY - wPRY < 0 || wRY - this.pRotationY > 270){
      rotateDirectionY = 'counter-clockwise';
    }
    if (rotateDirectionY !== pRotateDirectionY){
      wSAY = wRY;
    }
    if (Math.abs(wRY - wSAY) > 90 && Math.abs(wRY - wSAY) < 270){
      wSAY = wRY;
      this._setProperty('turnAxis', 'Y');
      deviceTurned();
    }
    pRotateDirectionY = rotateDirectionY;
    startAngleY = wSAY - 180;

    // Z-axis is already in the range 0 to 360
    // so no conversion is needed.
    if ((this.rotationZ - this.pRotationZ > 0 &&
      this.rotationZ - this.pRotationZ < 270)||
      this.rotationZ - this.pRotationZ < -270){
      rotateDirectionZ = 'clockwise';
    } else if (this.rotationZ - this.pRotationZ < 0 ||
      this.rotationZ - this.pRotationZ > 270){
      rotateDirectionZ = 'counter-clockwise';
    }
    if (rotateDirectionZ !== pRotateDirectionZ){
      startAngleZ = this.rotationZ;
    }
    if (Math.abs(this.rotationZ - startAngleZ) > 90 &&
      Math.abs(this.rotationZ - startAngleZ) < 270){
      startAngleZ = this.rotationZ;
      this._setProperty('turnAxis', 'Z');
      deviceTurned();
    }
    pRotateDirectionZ = rotateDirectionZ;
    this._setProperty('turnAxis', undefined);
  }
  var deviceShaken = this.deviceShaken || window.deviceShaken;
  if (typeof deviceShaken === 'function') {
    var accelerationChangeX;
    var accelerationChangeY;
    // Add accelerationChangeZ if acceleration change on Z is needed
    if (this.pAccelerationX !== null) {
      accelerationChangeX = Math.abs(this.accelerationX - this.pAccelerationX);
      accelerationChangeY = Math.abs(this.accelerationY - this.pAccelerationY);
    }
    if (accelerationChangeX + accelerationChangeY > shake_threshold) {
      deviceShaken();
    }
  }
};


module.exports = p5;
