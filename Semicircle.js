L.Circle = L.Circle.extend({
	options: {
		startAngle: 45,
		stopAngle: 135
	},

	// make sure 0 degrees is up (North) and convert to radians.
	startAngle: function () {
		return (this.options.startAngle - 90) * Math.PI/180;
	},
	stopAngle: function() {
		return (this.options.stopAngle - 90) * Math.PI/180;
	},

	//rotate point x,y+r around x,y with angle.
	rotated: function(angle, r) {
		return this._point.add(
			L.point(Math.cos(angle), Math.sin(angle)).multiplyBy(r)
		).round();
	},

	getPathString: function () {
		var center = this._point,
		    r = this._radius;

		var start = this.rotated(this.startAngle(), r),
			end = this.rotated(this.stopAngle(), r);;

		if (this._checkIfEmpty()) {
			return '';
		}

		if (L.Browser.svg) {
			var largeArc = (this.options.stopAngle - this.options.startAngle >= 180) ? '1' : '0';
			//move to center
			var ret = "M" + center.x + "," + center.y;
			//lineTo point on circle startangle from 0
			ret += "L " + start.x + "," + start.y;
			//make circle from point start - end:
			ret += "A " + r + "," + r + ",0," + largeArc + ",1," + (end.x ) + "," + (end.y ) + " z";;

			return ret;
		} else {
			//TODO: fix this for semicircle...
			p._round();
			r = Math.round(r);
			return "A " + p.x + "," + p.y + " " + r + "," + r + " 0," + (65535 * 360);
		}
	},

});
L.Circle.include(!L.Path.CANVAS ? {} : {
	_drawPath: function () {
		var center = this._point,
		    r = this._radius;

		var start = this.rotated(this.startAngle(), r).round(),
			end = this.rotated(this.stopAngle(), r).round();

		this._ctx.beginPath();
		this._ctx.moveTo(center.x, center.y);
		this._ctx.lineTo(start.x, start.y);

		this._ctx.arc(center.x, center.y, this._radius,
			this.startAngle() , this.stopAngle(), false);
		this._ctx.lineTo(center.x, center.y);
	},

	// _containsPoint: function (p) {
	// TODO: fix for semicircle.
	// 	var center = this._point,
	// 	    w2 = this.options.stroke ? this.options.weight / 2 : 0;

	// 	return (p.distanceTo(center) <= this._radius + w2);
	// }
});
