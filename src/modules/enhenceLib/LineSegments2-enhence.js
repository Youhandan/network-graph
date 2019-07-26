/**
 * According from https://discourse.threejs.org/t/raycasting-with-linesegment2-objects/4256/6
 * @author WestLangley / http://github.com/WestLangley
 *
 */
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import {
  Ray,
  Matrix4,
  Sphere,
  Vector3
} from 'three/build/three.module'

class LineSegments2Enhence extends LineSegments2 {
  constructor(geometry, material) {
    super (geometry, material)
    this.ray = new Ray()
    this.inverseMatrix = new Matrix4()
    this.sphere = new Sphere()
    this.geometry = geometry
  }

  raycast(raycaster, intersects) {

      var precision = raycaster.linePrecision;

      var geometry = this.geometry;
      var matrixWorld = this.matrixWorld;

      // Checking boundingSphere distance to ray

      if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
      this.sphere.copy(geometry.boundingSphere);
      this.sphere.applyMatrix4(matrixWorld);
      this.sphere.radius += precision;

      if (raycaster.ray.intersectsSphere(this.sphere) === false) return;

      this.inverseMatrix.getInverse(matrixWorld);
      this.ray.copy(raycaster.ray).applyMatrix4(this.inverseMatrix);

      var localPrecision = precision / ((this.scale.x + this.scale.y + this.scale.z) / 3);
      var localPrecisionSq = localPrecision * localPrecision;

      var vStart = new Vector3();
      var vEnd = new Vector3();
      var interSegment = new Vector3();
      var interRay = new Vector3();

      // Currently, the geometry is always a LineSegments2 geometry, which uses the instanceStart/instanceEnd to store segment locations
      var starts = geometry.attributes.instanceStart;
      var ends = geometry.attributes.instanceEnd;

      for (var i = 0; i < starts.count; i++) {
        vStart.fromArray(starts.data.array, i * starts.data.stride + starts.offset);
        vEnd.fromArray(ends.data.array, i * ends.data.stride + ends.offset);
        var distSq = this.ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);

        if (distSq > localPrecisionSq) continue;

        interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

        var distance = raycaster.ray.origin.distanceTo(interRay);

        if (distance < raycaster.near || distance > raycaster.far) continue;

        intersects.push({

          distance: distance,
          // What do we want? intersection point on the ray or on the segment??
          // point: raycaster.ray.at( distance ),
          point: interSegment.clone().applyMatrix4(this.matrixWorld),
          index: i,
          face: null,
          faceIndex: null,
          object: this
        });

      }
    }
}

export { LineSegments2Enhence }