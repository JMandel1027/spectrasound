var theta, theta_prev;
var filter, filterRes, filterFreq, filterWidth;
var reverb, delay, osc;
var w0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.amp( .5 );
  osc.start();

  filter = new p5.BandPass();
  filter.process(osc);
  xPos = windowWidth + 1;
  stroke(255);
  //strokeWeight(6);

  //reverb = new p5.Reverb();
  //delay = new p5.Delay();

  size = windowHeight / 12;
  //textSize(size);
  //textAlign(CENTER, CENTER);
}

function draw() {
  background(map(rotationX, 0.00, 0.99, 0, 255), map(rotationY, 0.00, 0.99, 0, 255), map(rotationZ, 0.00, 0.99, 0, 255));

  var radius = width * 1.5;

  //drag to move the world.
  //orbitControl();
  //quaternion(quat);

  var matrix = rotationMatrix(rotationX,rotationY,rotationZ);
  var world = quaternion(rotationX,rotationY,rotationZ);
  //rotateQuaternion();

  push()
    if(windowWidth>=windowHeight){translate(-200,0,0);}
    else{translate(0,-200,0);}
    rotateZ(radians(rotationZ));
    rotateX(radians(rotationX));
    rotateY(radians(rotationY));
    box(100, 100, 100);
  pop()

  push()
    if(windowWidth>=windowHeight){translate(-200,0,0);}
    else{translate(0,-200,0);}
    rotateMatrix(m);
    box(100, 100, 100);
  pop()

  push()
    if(windowWidth>=windowHeight){translate(-200,0,0);}
    else{translate(0,-200,0);}
    rotateQuaternion(w);
    box(100, 100, 100);
  pop()

  push()
    if(windowWidth>=windowHeight){translate(200,0,0);}
    else{translate(0,200,0);}
    rotateY(radians(-rotationY));
    rotateX(radians(-rotationX));
    rotateZ(radians(-rotationZ));
    box(100, 100, 100);
  pop()

  push()
    if(windowWidth>=windowHeight){translate(200,0,0);}
    else{translate(0,200,0);}
    rotateMatrix(transposeRotationMatrix(m));
    box(100, 100, 100);
  pop()

  push()
    if(windowWidth>=windowHeight){translate(200,0,0);}
    else{translate(0,200,0);}
    rotateQuaternion([w[0],-w[1],-w[2],-w[3]]);
    box(100, 100, 100);
  pop()
  /*
  normalMaterial();
  translate(0, 0, -600);
  for(var i = 0; i <= 12; i++){
    for(var j = 0; j <= 12; j++){
      push();
      var a = j/12 * PI;
      var b = i/12 * PI;
      translate(sin(2 * a) * radius * sin(b), cos(b) * radius / 2 , cos(2 * a) * radius * sin(b));
      if(j%2 === 0){
        cone(30, 30);
      }else{
        box(30, 30, 30);
      }
      pop();
    }
    */
  //}

  //background(map(round(roll), -180, 180, 0, 255), map(round(pitch), -180, 180, 0, 255), map(round(yaw), -180, 180, 0, 255));
  //background( deviceTurned(roll), deviceTurned(pitch), deviceTurned(yaw) );

  //var freq = map(round(roll), -180, 180, 0, 255);
  var freq = map(rotationX, 0.00, 0.99, 0, 60);
  osc.freq(freq);

  //var amp = map(round(yaw), -180, 180, 0, 255);
  var amp = map(rotationY, 0.00, 0.99, 0, 60);
  osc.amp(amp);

  //filterFreq = map(round(roll), -180, 180, 0, 255);
  filterFreq = map(rotationX, 0.00, 0.99, 0, 60);
  //filterWidth = map(round(yaw), -180, 180, 0, 255);
  filterWidth = map(rotationY, 0.00, 0.99, 0, 60);
  //filterRes = map(round(pitch), -180, 180, 0, 255);
  //filterRes = map(rotationZ, 0.00, 0.99, 0, 255);
  filter.set(filterFreq, filterWidth);


  if(frameCount < 5) {
   w0 = quaternion(rotationX, rotationY, rotationZ);
  }

  var w = quaternion(rotationX, rotationY, rotationZ);

  // we can extract roll, pitch, yaw from the quaternion
  var radtodeg = 180 / PI;

  var roll  = radtodeg * Math.atan2(2 * w[2] * w[0] - 2 * w[1] * w[3], 1 - 2 * w[2] * w[2] - 2 * w[3] * w[3]);
  var pitch = radtodeg * Math.atan2(2 * w[1] * w[0] - 2 * w[2] * w[3], 1 - 2 * w[1] * w[1] - 2 * w[3] * w[3]);
  var yaw   = radtodeg * Math.asin(2 * w[1] * w[2] + 2 * w[3] * w[0]);

  /*
  text("roll: " + str(round(roll)), windowWidth / 2, size);
  text("pitch: " + str(round(pitch)), windowWidth / 2, 2 * size);
  text("yaw: " + str(round(yaw)), windowWidth / 2, 3 * size);

  // quaternion values
  text("Qw: " + str(round(w[0] * 100) / 100), windowWidth / 2, 4 * size);
  text("Qx: " + str(round(w[1] * 100) / 100), windowWidth / 2, 5 * size);
  text("Qy: " + str(round(w[2] * 100) / 100), windowWidth / 2, 6 * size);
  text("Qz: " + str(round(w[3] * 100) / 100), windowWidth / 2, 7 * size);
  */
  // tells us if the device is turned by 90 degrees
  deviceTurned(w,w0)

}

function deviceTurned(w,w0) {
  var radtodeg = 180 / PI;

  var roll  = radtodeg * Math.atan2(2 * w[2] * w[0] - 2 * w[1] * w[3], 1 - 2 * w[2] * w[2] - 2 * w[3] * w[3]);
  var pitch = radtodeg * Math.atan2(2 * w[1] * w[0] - 2 * w[2] * w[3], 1 - 2 * w[1] * w[1] - 2 * w[3] * w[3]);
  var yaw   = radtodeg * Math.asin(2 * w[1] * w[2] + 2 * w[3] * w[0]);

  fill(roll, pitch, yaw);

  // quaternion distance = 1 - <q1,q2>^2 is a measure of difference between orientations
  // Goes between 0 (identical orientations) to 1 (opposite orientations)
  // quaternion angle = arccos(2*<q1,q2>^2 - 1) converts this into an angle
  // this is the angle of rotation needed to get from one orientation to another
  // i.e. the angle between two orientations
  var quatDistance = quaternionDistance(w, w0);
  var quatAngleBetween = radtodeg * quaternionAngleBetween(w, w0);

  //text("quat dist: " + str(round(quatDistance * 100) / 100), windowWidth / 2, 8 * size);
  //text("quat angle: " + str(round(quatAngleBetween)), windowWidth / 2, 9 * size);

  // define quaternion orientations for +/- 90 degree rotations in X, Y, Z
  var xcw = quaternion(90, 0, 0);
  var xccw = quaternion(-90, 0, 0);
  var ycw = quaternion(0, 90, 0);
  var yccw = quaternion(0, -90, 0);
  var zcw = quaternion(0, 0, 90);
  var zccw = quaternion(0, 0, -90);

  // quaternion distance = (1 - cos(quaternion angle))/2
  // so when the angle is 90 degrees, quaternion distance is 0.5
/*  if( quatDistance >= 0.5 ) {
    //text("Device TURNED", windowWidth / 2, 10 * size);
    if( quaternionDistance(w, quaternionMultiply(w0, xcw)) < 0.1) { text("X", windowWidth / 2, 11 * size); }
    else if (quaternionDistance(w, quaternionMultiply(w0, xccw)) < 0.1) { text("-X", windowWidth / 2, 11 * size); }
    else if (quaternionDistance(w, quaternionMultiply(w0, ycw)) < 0.1) { text("Y", windowWidth / 2, 11 * size); }
    else if (quaternionDistance(w, quaternionMultiply(w0, yccw)) < 0.1) { text("-Y", windowWidth / 2, 11 * size); }
    else if (quaternionDistance(w, quaternionMultiply(w0, zcw)) < 0.1) { text("Z", windowWidth / 2, 11 * size); }
    else if (quaternionDistance(w, quaternionMultiply(w0, zccw)) < 0.1) { text("-Z", windowWidth / 2, 11 * size); }
  } */
}
