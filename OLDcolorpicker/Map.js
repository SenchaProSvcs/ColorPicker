/**
 * @class Ext.uxold.colorpicker.Map
 * @extends Ext.uxold.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.uxold.colorpicker.Map', {
    extend : 'Ext.uxold.colorpicker.GenericSlider',

    requires : [
        'Ext.uxold.colorpicker.util'
    ],

    /**
     *
     */
    sliderPosition : [0, 0],

    /**
     *
     */
    renderColor : function() {
        var rgb = Ext.uxold.colorpicker.color.hsv2rgb(this.h, 1, 1);

        this.parent.dom.style.backgroundColor = "rgb(" + rgb[0] + "," + rgb[1] + ", " + rgb[2] + ")";
    },

    /**
     *
     * @param h
     * @param s
     * @param v
     * @return {Boolean}
     */
    shouldUpdate : function(h, s, v) {
        if (h) {
            this.renderColor();
        }
        return false;
    },

    /**
     * OPTIMIZED
     * this should only be used to generate a static image up-front
     * and background-color should be changed to create different saturation-value charts.
     * basically, we're creating an overlay image that we can put on top of a fully saturated/valued color
     * that will create a full saturation/value chart for that color
     *
     * @param x
     * @param y
     * @return {Array}
     * @constructor
     */
    RGBAcolorAt : function(x, y) {
        var w     = 1 - x,
            b     = 1 - y,
            g     = 255,
            alpha = b * (w - 1) + 1,
            baseC = (g * w * b) / (alpha);

        baseC = Math.round(baseC);
        alpha = Math.round(alpha * 255);

        return [baseC, baseC, baseC, alpha]; // rgba
    },

    /**
     *
     */
    renderMap : function() {
        this.renderColor();

        //get color canvas
        var canvas = this.canvas.dom;

        //get context
        var context = canvas.getContext('2d');

        //get the image data of canvas
        var imageData = context.createImageData(this.width, this.height);

        //get height and width of image data
        var height = imageData.height;
        var width  = imageData.width;

        //for each column (x - direction)
        for (var i = 0; i < width; i++) {

            //calculate fractional x
            var x = i / width;

            //for each row
            for (var j = 0; j < height; j++) {

                //calculate fractional y
                var y = j / height;

                //get color at x,y
                var color = this.RGBAcolorAt(x, y);

                //calculate index of imagedata array from row and column
                var cIndex = j * (width * 4) + (i * 4);

                //update image data colors
                imageData.data[cIndex] = color[0];
                imageData.data[cIndex + 1] = color[1];
                imageData.data[cIndex + 2] = color[2];
                imageData.data[cIndex + 3] = color[3];
            }
        }

        //set image data to canvas
        context.putImageData(imageData, 0, 0);
    },

    /**
     *
     * @param dragtracker
     * @param event
     */
    onSliderMoveStart : function(dragtracker, event) {
        var startOnPicker = event.getTarget('.picker-inner');

        if (!startOnPicker) {
            //position picker where the mouse is in the element

            //get local position
            var xy = Ext.uxold.colorpicker.util.getLocalCoords(this.parent, event.xy);
            this.firePositionChange(xy);
        }

        this.startPosition = this.sliderPosition;

    },

    /**
     *
     * @param dx
     * @param dy
     * @param dragtracker
     * @param event
     */
    onSliderMove : function(dx, dy, dragtracker, event) {
        var me  = this,
            pos = me.startPosition;

        me.dragging = true;

        me.firePositionChange([dx + pos[0], dy + pos[1]]);
        me.updatePickerColor( [dx + pos[0], dy + pos[1]]);
    },

    /**
     *
     * @param xy
     * @return {*}
     */
    sanitizePosition : function(xy) {
        xy[0] = Math.max(xy[0], 0);
        xy[0] = Math.min(xy[0], this.width);
        xy[1] = Math.max(xy[1], 0);
        xy[1] = Math.min(xy[1], this.height);

        return xy;
    },

    /**
     * Ensures that x and y stay between 0 and 1
     * @param xy
     * @return {*}
     */
    sanitizeFraction : function(xy) {
        xy[0] = Math.max(xy[0], 0);
        xy[0] = Math.min(xy[0], 1);
        xy[1] = Math.max(xy[1], 0);
        xy[1] = Math.min(xy[1], 1);

        return xy;
    },

    /**
     *
     * @param {Array} xy The position array
     */
    firePositionChange : function(xy) {
        var me         = this,
            fractional = me.sanitizeFraction([xy[0] / me.width, xy[1] / me.height]);

        me.moveSlider(xy);

        me.fireEvent('positionChange', fractional);
    },

    /**
     *
     * @param {Array} xy The position array
     */
    updatePickerColor : function(xy) {
        var color = xy[0] < 127 && xy[1] < 127 ? 'black' : 'white';

        this.pointerInner.setStyle('border-color', color);
        this.pointerOuter.setStyle('border-color', color);
    },

    /**
     *
     * @param {Array} xy The position array
     */
    moveSlider : function(xy) {
        var me = this;

        if (me.sliderPosition[0] !== xy[0] || me.sliderPosition[1] !== xy[1]) {

            xy = me.sanitizePosition(xy);

            me.sliderPosition = xy;

            me.pointerOuter.setStyle({
                left : xy[0] + 'px',
                top  : xy[1] + 'px'
            });

            me.updatePickerColor(xy);
        }
    },

    /**
     *
     * @param fraction
     */
    moveSliderFromFraction : function(fraction) {
        this.moveSlider([
            Math.round(fraction[0] * this.width),
            Math.round(fraction[1] * this.height)
        ]);
    },

    /**
     *
     */
    updatePositionFromHSV : function() {
        this.moveSliderFromFraction([
            this.s,
            1 - this.v
        ]);
    }
});