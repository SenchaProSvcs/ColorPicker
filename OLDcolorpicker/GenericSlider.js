/**
 * @class Ext.uxold.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.uxold.colorpicker.GenericSlider', {
    requires : [
        'Ext.uxold.colorpicker.color',
        'Ext.uxold.colorpicker.Drag'
    ],

    mixins : {
        observable : 'Ext.util.Observable'
    },

    dragging       : false,
    sliderPosition : 0,

    h : 0,
    s : 1,
    v : 1,
    a : 1,

    /**
     *
     * @param config
     */
    constructor : function(config) {
        Ext.applyIf(this, config || {});

        this.mixins.observable.constructor.call(this, config);
    },

    /**
     *
     * @param parent
     * @param width
     * @param height
     */
    renderInsideElement : function(parent, width, height) {
        var me = this;

        Ext.create('Ext.XTemplate', [
            '<canvas width="{width}" height="{height}"></canvas>',
            '<div class="picker-outer">',
                '<div class="picker-inner"></div>',
            '</div>'
        ]).append(parent, {width : width, height : height});

        Ext.apply(me, {
            parent       : parent,
            width        : width,
            height       : height,
            canvas       : parent.child("canvas"),
            pointerInner : parent.down('.picker-inner'),
            pointerOuter : parent.down('.picker-outer'),
            dragtracker  : Ext.create('Ext.uxold.colorpicker.Drag', {
                element       : parent,
                onStart       : me.onSliderMoveStart,
                onMove        : me.onSliderMove,
                onMoveEnd     : me.onSliderMoveEnd,
                scope         : me,
                moveThreshold : 1
            })
        });

        me.renderMap();
    },

    /**
     *
     * @param dragtracker
     * @param event
     */
    onSliderMoveStart : function(dragtracker, event) {
        var me            = this,
            startOnPicker = event.getTarget('.picker-inner'),
            xy;

        // simulates the click event on the slider
        if (!startOnPicker) {
            xy = Ext.uxold.colorpicker.util.getLocalCoords(me.parent, event.xy);
            me.firePositionChange(xy[1]);
        }

        me.startPosition = me.sliderPosition;
    },

    /**
     *
     * @param dx
     * @param dy
     * @param dragtracker
     * @param event
     */
    onSliderMove : function(dx, dy, dragtracker, event) {
        this.dragging = true;
        this.firePositionChange(dy + this.startPosition);
    },

    /**
     *
     * @param dx
     * @param dy
     * @param dragtracker
     * @param event
     */
    onSliderMoveEnd : function(dx, dy, dragtracker, event) {
        this.dragging = false;
        this.firePositionChangeComplete();
    },

    /**
     *
     * @param y
     * @return {Number}
     */
    sanitizePosition : function(y) {
        y = Math.max(y, 0);
        y = Math.min(y, this.height);
        return y;
    },

    /**
     *
     * @param y
     * @return {Number}
     */
    sanitizeFraction : function(y) {
        y = Math.max(y, 0);
        y = Math.min(y, 1);
        return y;
    },

    /**
     *
     * @param y
     */
    firePositionChange : function(y) {
        var me = this;

        me.moveSlider(y);

        var fractional = me.sanitizeFraction(y / me.height);

        me.fireEvent('positionChange', fractional);
    },

    /**
     *
     */
    firePositionChangeComplete : function() {
        this.fireEvent('positionChangeComplete');
    },

    /**
     *
     * @param position
     */
    moveSlider : function(position) {
        var me = this;

        if (me.sliderPosition !== position) {
            position = me.sanitizePosition(position);

            me.sliderPosition = position;

            me.pointerOuter.setStyle('top', position + 'px');
        }
    },

    /**
     *
     * @param fraction
     */
    moveSliderFromFraction : function(fraction) {
        this.moveSlider(Math.round(fraction * this.height));
    },

    /**
     *
     */
    renderMap : function() {
        var me        = this,
            canvas    = me.canvas.dom, // get color canvas
            context   = canvas.getContext('2d'), // get context
            imageData = context.createImageData(me.width, me.height), //get the image data of canvas
            data      = imageData.data,
            height    = imageData.height,
            width     = imageData.width,
            color,
            cIndex,
            i,
            j,
            y;

        //for each column (x - direction)
        for (i = 0; i < height; i++) {
            y = i / height; //calculate fractional x

            color = me.RGBAcolorAt(y);

            //for each row
            for (j = 0; j < width; j++) {
                cIndex = i * (width * 4) + (j * 4); //calculate index of imagedata array from row and column

                //update image data colors
                data[cIndex]     = color[0];
                data[cIndex + 1] = color[1];
                data[cIndex + 2] = color[2];
                data[cIndex + 3] = color[3];
            }
        }

        //set image data to canvas
        context.putImageData(imageData, 0, 0);
    },

    /**
     *
     * @param h
     * @param s
     * @param v
     */
    setHSV : function(h, s, v) {
        var me      = this,
            changeH = me.h !== h,
            changeS = me.s !== s,
            changeV = me.v !== v;

        Ext.apply(me, {
            h : h,
            s : s,
            v : v
        });

        if (me.shouldUpdate(changeH, changeS, changeV)) {
            me.renderMap();
        }

        if (!me.dragging) {
            me.updatePositionFromHSV();
        }
    },

    /******* typical methods to override ********/

    /**
     *
     * @param h
     * @param s
     * @param v
     * @return {Boolean}
     */
    shouldUpdate : function(h, s, v) {
        return s || v;
    },

    /**
     *
     * @param y
     * @return {Array}
     * @constructor
     */
    RGBAcolorAt : function(y) {
        var rgb = Ext.uxold.colorpicker.color.hsv2rgb(y, this.s, this.v);
        rgb.push(255); //rgba

        return rgb;
    },

    /**
     *
     */
    updatePositionFromHSV : function() {
        this.moveSliderFromFraction(this.h);
    }
});