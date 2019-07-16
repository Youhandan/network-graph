/**
 * @author HypnosNova / https://www.threejs.org.cn/gallery
 */
import { Vector2 } from 'three/build/three.module'

var SelectionHelper = ( function () {

	function SelectionHelper( selectionBox, canvasDom, boxStyles ) {

		this.element = document.createElement( 'div' );
		this.element.style.position = 'fixed';
    this.element.style.pointerEvents = 'none';
    this.element.style.border = boxStyles.border
		this.element.style.backgroundColor = boxStyles.backgroundColor

		this.canvas = canvasDom;

		this.startPoint = new Vector2();
		this.pointTopLeft = new Vector2();
		this.pointBottomRight = new Vector2();

		this.isDown = false;
		this.disable = true

		this.canvas.addEventListener( 'mousedown', function ( event ) {

      if (this.disable) return
			this.isDown = true;
			this.onSelectStart( event );

		}.bind( this ), false );

		this.canvas.addEventListener( 'mousemove', function ( event ) {

      if (this.disable) return
			if ( this.isDown ) {

				this.onSelectMove( event );

			}

		}.bind( this ), false );

		this.canvas.addEventListener( 'mouseup', function ( event ) {

			this.isDown = false;
			this.onSelectOver( event );

		}.bind( this ), false );

	}

	SelectionHelper.prototype.onSelectStart = function ( event ) {

		this.canvas.parentElement.appendChild( this.element );

		this.element.style.left = event.clientX + 'px';
		this.element.style.top = event.clientY + 'px';
		this.element.style.width = '0px';
		this.element.style.height = '0px';

		this.startPoint.x = event.clientX;
		this.startPoint.y = event.clientY;

	};

	SelectionHelper.prototype.onSelectMove = function ( event ) {

		this.pointBottomRight.x = Math.max( this.startPoint.x, event.clientX );
		this.pointBottomRight.y = Math.max( this.startPoint.y, event.clientY );
		this.pointTopLeft.x = Math.min( this.startPoint.x, event.clientX );
		this.pointTopLeft.y = Math.min( this.startPoint.y, event.clientY );

		this.element.style.left = this.pointTopLeft.x + 'px';
		this.element.style.top = this.pointTopLeft.y + 'px';
		this.element.style.width = ( this.pointBottomRight.x - this.pointTopLeft.x ) + 'px';
		this.element.style.height = ( this.pointBottomRight.y - this.pointTopLeft.y ) + 'px';

	};

	SelectionHelper.prototype.onSelectOver = function () {
    this.element.parentElement && this.element.parentElement.removeChild( this.element );

	};

	SelectionHelper.prototype.disableBoxSelect = function () {
		this.disable = true
  }
  SelectionHelper.prototype.enableBoxSelect = function () {
    this.disable = false
  }

	return SelectionHelper;

} )();

export { SelectionHelper }
