/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import LineSegments2 from './LineSegments2'

const Line2 = function ( geometry, material ) {

  LineSegments2.call( this );

  this.type = 'Line2';

  this.geometry = geometry !== undefined ? geometry : new LineGeometry();
  this.material = material !== undefined ? material : new LineMaterial( { color: Math.random() * 0xffffff } );

};

Line2.prototype = Object.assign( Object.create( LineSegments2.prototype ), {

  constructor: Line2,

  isLine2: true,

  copy: function ( /* source */ ) {

    // todo

    return this;

  }

} );

export default Line2