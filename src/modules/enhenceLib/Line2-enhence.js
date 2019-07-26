/**
 * @author WestLangley / http://github.com/WestLangley
 * @author youhandan / http://github.com/Youhandan
 */


import { LineSegments2Enhence } from "./LineSegments2-enhence";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

var Line2Enhence = function ( geometry, material ) {

  LineSegments2Enhence.call( this );

  this.type = 'Line2Enhence';

  this.geometry = geometry !== undefined ? geometry : new LineGeometry();
  this.material = material !== undefined ? material : new LineMaterial( { color: Math.random() * 0xffffff } );

};

Line2Enhence.prototype = Object.assign( Object.create( LineSegments2Enhence.prototype ), {

  constructor: Line2Enhence,

  isLine2Enhence: true,

  copy: function ( /* source */ ) {

    // todo

    return this;

  }

} );

export { Line2Enhence };