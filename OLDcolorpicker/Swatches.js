/**
 * @class Ext.uxold.colorpicker.Swatches
 *
 */
Ext.define('Ext.uxold.colorpicker.Swatches', {
    requires : [
        'Ext.uxold.colorpicker.color',
        'Ext.uxold.colorpicker.Drag'
    ],

    mixins : {
        observable : 'Ext.util.Observable'
    },

    /**
     *
     */
    template : new Ext.XTemplate(
        '<div class="swatches">',
            '<div class="swatch-row" id="swatchRow"></div>',
        '</div>'
    ),

    /**
     *
     */
    swatchTpl : new Ext.XTemplate(
        '<div class="swatch-container" id="{uuid}">',
            '<div class="swatch-background">',
                '<div class="swatch-color" style="background-color:rgba({r},{g},{b},{a});"></div>',
            '</div>',
        '</div>'
    ),

    /**
     *
     */
    draggableTpl : new Ext.XTemplate(
        '<div class="draggableSwatch" id="draggableSwatch">',
            '<div class="draggableColor" id="draggableColor"></div>',
        '</div>'
    ),

    /**
     *
     */
    draggableIndicatorTpl : new Ext.XTemplate(
        '<div class="draggableIndicator" id="draggableIndicator"></div>'
    ),

    /**
     *
     */
    draggableVisible : false,

    /**
     *
     */
    rgba : [0, 0, 0, 0],

    /**
     *
     */
    defaultPalette : [
        {
            uuid : 'pregen-colorpicker-swatch-1',
            r    : 255,
            g    : 255,
            b    : 255,
            a    : 0
        },
        {
            uuid : 'pregen-colorpicker-swatch-2',
            r    : 255,
            g    : 255,
            b    : 255,
            a    : 1
        },
        {
            uuid : 'pregen-colorpicker-swatch-3',
            r    : 0,
            g    : 0,
            b    : 0,
            a    : 1
        }
    ],

    /**
     *
     */
    maxPaletteLength : 21,

    /**
     *
     */
    swatchWidth : 20,

    /**
     *
     * @param config
     */
    constructor : function(config) {
        config = config || {};
        Ext.applyIf(this, config);

        this.mixins.observable.constructor.call(this, config);

        this.currentPalette = this.load();
    },

    /**
     *
     * @param parent
     */
    renderInsideElement : function(parent) {
        this.parent = parent;
        this.clearPalette();
        this.setupDragHandler();
        this.refreshPalette();
    },

    /**
     *
     */
    setupDragHandler : function() {
        var me = this;

        me.innerParent = me.parent.getById('swatchRow');

        me.dragHandler = new Ext.uxold.colorpicker.Drag({
            element            : me.innerParent,
            preventPropagation : me,
            scope              : me,

            // todo tobiu: global events?

            onStart : function() {
                this.prepareDraggable(event.x, event.y);
            },

            onMove : function() {
                this.updateDraggable(event.x, event.y);
            },

            onMoveEnd : function() {
                this.hideDraggable(event.x, event.y);
            },

            onClick : function() {
                this.setSwatch(event.x);
            }
        });

        me.createDraggable();
        me.createIndicator();
    },

    /**
     *
     */
    refreshPalette : function() {
        var me  = this,
            len = me.currentPalette.length,
            leftOffset,
            addedSwatch,
            i;

        for (i = 0; i < len; i++) {
            me.appendSwatchToPalette(me.currentPalette[i]);
            leftOffset  = i * me.swatchWidth + 'px';
            addedSwatch = me.innerParent.getById(me.currentPalette[i].uuid);
            addedSwatch.setStyle('left', leftOffset);
        }

        if (me.currentPalette.length >= me.maxPaletteLength) {
            me.fireEvent('paletteFull');
        }
    },

    /**
     *
     */
    clearPalette : function() {
        this.template.overwrite(this.parent);
    },

    /**
     *
     * @return {*}
     */
    load : function() { // todo: changed by tobiu
        return this.defaultPalette;
        //return sencha.io.LocalStorage.getItem('colorpicker-palette', this.defaultPalette);
    },

    /**
     *
     */
    save : function() { // todo: disabled by tobiu
        //sencha.io.LocalStorage.setItem('colorpicker-palette', this.currentPalette);
    },

    /**
     * Appends el to the innerParent
     * @param swatch
     */
    appendSwatchToPalette : function(swatch) {
        this.swatchTpl.append(this.innerParent, swatch);
    },

    /**
     *
     * @param index
     */
    removeSwatchFromPalette : function(index) {
        var swatch = this.innerParent.getById(this.currentPalette[index].uuid);
        swatch.destroy();
        this.deleteSwatch(index);
        this.calcShift(index);
    },

    /**
     * Adds swatch to currentPalette in the right place and appends el to the innerParent in the right spot
     * @param swatch
     * @param index
     * @param animate
     */
    insertSwatchToPalette : function(swatch, index, animate) {
        var leftOffset = 0;

        if (index === 0) {
            this.currentPalette.unshift(swatch);
            this.swatchTpl.insertFirst(this.innerParent, swatch);
        } else if (index >= this.currentPalette.length || index === -1) {
            this.currentPalette.push(swatch);
            this.swatchTpl.append(this.innerParent, swatch);
            leftOffset = (this.currentPalette.length - 1) * this.swatchWidth + 'px';
        } else {
            var currentEluuid = this.currentPalette[index].uuid;
            var currentEl = this.innerParent.getById(currentEluuid);
            this.swatchTpl.insertBefore(currentEl, swatch);
            this.currentPalette.splice(index, 0, swatch);
            leftOffset = index * this.swatchWidth + 'px';
        }

        var addedSwatch = this.innerParent.getById(swatch.uuid);
        addedSwatch.setStyle('left', leftOffset);

        if (index < this.currentPalette.length && index > -1) {
            this.calcShift(index + 1);
        }

        if (this.currentPalette.length >= this.maxPaletteLength) {
            this.fireEvent('paletteFull');
        }
        if (animate) {
            var time = 0.2;

            this.animateSwatch(swatch.uuid, animate, time);
        }

        this.save();
    },

    /**
     * Calculates which swatches should be shifted
     * @param index
     */
    calcShift : function(index) {
        if (index !== -1) {
            var deleteTask,
                leftOffset,
                swatch,
                taskIndexes = [];

            for (var i = index; i < this.currentPalette.length; i++) {
                leftOffset = i * this.swatchWidth + 'px';
                swatch     = this.innerParent.getById(this.currentPalette[i].uuid);

                //add transition
                swatch.setStyle('-webkit-transition', '0.1s');

                taskIndexes.push(i);

                swatch.setStyle('left', leftOffset);
            }

            //remove transition after it's played
            deleteTask = new Ext.util.DelayedTask(function() {
                for (var i = 0; i < taskIndexes.length; i++) {
                    var swatchTemp = this.innerParent.getById(this.currentPalette[taskIndexes[i]].uuid);
                    swatchTemp.setStyle('-webkit-transition', '');
                }
            }, this);
            deleteTask.delay(200);
        }
    },

    /**
     *
     * @param uuid
     * @param anim Available anims are popIn, dropIn
     * @param seconds
     */
    animateSwatch : function(uuid, anim, seconds) {
        var animatedSwatch = this.innerParent.getById(uuid).child('.swatch-background');
        animatedSwatch.setStyle('-webkit-animation', anim + ' ' + seconds + 's linear');

        //remove animation after it played
        var deleteTask = new Ext.util.DelayedTask(function() {
            animatedSwatch.setStyle('-webkit-animation', '');
        }, this);

        deleteTask.delay(seconds * 1000 + 100);
    },

    /**
     *
     * @param seconds
     */
    animateDraggableSwatch : function(seconds) {
        var me = this;

        me.draggableSwatch.setStyle('-webkit-animation', 'popOut ' + seconds + 's linear');

        var deleteTask = new Ext.util.DelayedTask(function() {
            this.draggableSwatch.setStyle('-webkit-animation', '');
        }, me);

        deleteTask.delay(seconds * 1000 + 100);
    },

    //****INTERACTION****

    /**
     * Adds a swatch to the palette
     * @param r
     * @param g
     * @param b
     * @param a
     */
    addSwatch : function(r, g, b, a) {
        var me = this;

        if (me.currentPalette.length < me.maxPaletteLength) {
            var uuid = Ext.id();
            me.save();
            me.insertSwatchToPalette({uuid : uuid, r : r, g : g, b : b, a : a}, me.currentPalette.length, 'popIn');
        }
    },

    /**
     * Deletes a swatch from the palette
     * @param index
     */
    deleteSwatch : function(index) {
        this.currentPalette.splice(index, 1);
        this.save();
        this.fireEvent('paletteAvailable');
    },

    /**
     * Fires event broadcasting which color should be set as a current color
     * @param offset
     */
    setSwatch : function(offset) {
        var me = this;

        me.draggableSwatch.setStyle('display', 'none'); //just in case mouse didn't move but draggable was up

        var swatchIndex = me.getSwatchClickIndex(offset);

        if (swatchIndex >= 0 && swatchIndex < me.maxPaletteLength) {
            me.fireEvent('paletteSetSwatch', me.currentPalette[swatchIndex]);
        }
    },

    //****UTILITY****

    /**
     * Gets the x and y coordinates of the innerParent
     * @return {Array}
     */
    getXY : function() {
        return this.innerParent.getXY();
    },

    /**
     * Gets the width of the innerParent
     * @return {Number}
     */
    getWidth : function() {
        return this.innerParent.getWidth();
    },

    /**
     * Gets the height of the innerParent
     * @return {Number}
     */
    getHeight : function() {
        return this.innerParent.getHeight();
    },

    /**
     *
     * @param offset
     * @return {Number}
     */
    getSwatchClickIndex : function(offset) {
        var xyRow          = this.getXY(),
            dx             = offset - (xyRow[0] + 2), //+2 to correct for clicking on the border
            nrSwatches     = this.currentPalette.length,
            allSwatchWidth = nrSwatches * this.swatchWidth;

        if (dx > allSwatchWidth) {
            return -1;
        } else {
            var pos = Math.floor(dx / this.swatchWidth);
            if (pos < 0) {
                pos = 0;
            }
            return pos;
        }
    },

    /**
     * Calculates the distance between two points
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @return {Number}
     */
    getXYdistance : function(x1, y1, x2, y2) {
        var distX = Math.abs(x1 - x2),
            distY = Math.abs(y1 - y2);

        return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    },

    /**
     *
     * @param margin
     * @param x
     * @param y
     * @return {Boolean}
     */
    isOutsideMargin : function(margin, x, y) {
        var xy         = this.getXY(),
            marginMinX = xy[0] - margin,
            marginMaxX = xy[0] + this.getWidth() + margin,
            marginMinY = xy[1] - margin,
            marginMaxY = xy[1] + this.getHeight() + margin;

        return !(x > marginMinX && x < marginMaxX && y > marginMinY && y < marginMaxY);
    },

    //****DRAGGABLE SWATCH****

    /**
     *
     */
    createDraggable : function() {
        var me = this;

        if (!me.draggableSwatch) {
            me.draggableTpl.append(me.parent);

            me.draggableSwatch = me.parent.getById('draggableSwatch');

            me.draggableSwatch.setStyle('display', 'none');
        }
    },

    /**
     *
     */
    createIndicator : function() {
        var me = this;

        if (!me.draggableIndicator) {
            me.draggableIndicatorTpl.append(me.parent);

            me.draggableIndicator = me.parent.getById('draggableIndicator');

            me.draggableIndicator.setStyle('display', 'none');
        }
    },

    /**
     *
     * @param x
     * @param y
     */
    prepareDraggable : function(x, y) {
        var me = this;

        me.initialDragX = x;
        me.initialDragY = y;
        me.swatchIndex  = me.getSwatchClickIndex(x);
    },

    /**
     *
     * @param rgba
     */
    showDraggable : function(rgba) {
        var me = this,
            selectedColorRGBA,
            selectedColorString;

        if (rgba) {
            selectedColorString = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
        } else if (me.swatchIndex > -1) {
            selectedColorRGBA = me.currentPalette[me.swatchIndex];
            selectedColorString = 'rgba(' +
                selectedColorRGBA.r + ',' +
                selectedColorRGBA.g + ',' +
                selectedColorRGBA.b + ',' +
                selectedColorRGBA.a + ')';
        } else {
            return;
        }

        var color = me.draggableSwatch.getById('draggableColor');
        color.setStyle('background-color', selectedColorString);

        me.draggableSwatch.setStyle('display', 'block');
        me.draggableVisible = true;
        me.animateDraggableSwatch(0.2);

        // hide the swatch since it's picked up now

        if (me.swatchIndex !== -1) {
            me.draggableSwatchData = me.currentPalette[me.swatchIndex];
            me.removeSwatchFromPalette(me.swatchIndex);
        } else {
            me.draggableSwatchData = {r : rgba[0], g : rgba[1], b : rgba[2], a : rgba[3], uuid : Ext.id()};
        }
    },

    /**
     *
     * @param x
     * @param y
     * @param rgba
     */
    updateDraggable : function(x, y, rgba) {
        var me             = this,
            distFromOrigin = me.getXYdistance(me.initialDragX, me.initialDragY, x, y);

        me.draggableSwatch.setX(x - 11); //draggable is 22x22 (20 + 1 border)
        me.draggableSwatch.setY(y - 11);

        if (!me.draggableVisible) {
            if (distFromOrigin > 10) {
                me.showDraggable(rgba);
            }
        } else {
            if (me.isOutsideMargin(20, x, y)) {
                me.draggableSwatch.setStyle('opacity', '0.5');
                me.hideIndicator();
            } else {
                me.draggableSwatch.setStyle('opacity', '1');
                me.updateIndicator(x);
            }
        }
    },

    /**
     *
     * @param x
     * @param y
     */
    hideDraggable : function(x, y) {
        var me = this;

        if (me.draggableVisible) {
            if (!me.isOutsideMargin(20, x, y)) {
                me.insertSwatchToPalette(me.draggableSwatchData, me.swatchOver, 'dropIn');
            }

            me.draggableSwatch.setStyle('display', 'none');
            me.draggableVisible = false;
            me.hideIndicator();
        }
    },

    /**
     *
     * @param offset
     */
    updateIndicator : function(offset) {
        var me = this;

        me.swatchOver = me.getSwatchClickIndex(offset + 10); //correct for middle of the swatches

        var leftOffset;

        if (me.currentPalette.length === 0) {
            leftOffset = '-1px';
        } else if (me.swatchOver !== -1) {
            leftOffset = me.swatchOver * me.swatchWidth - 1 + 'px';
        } else {
            leftOffset = me.currentPalette.length * me.swatchWidth - 1 + 'px';
        }

        me.draggableIndicator.setStyle({
            display : 'block',
            left    : leftOffset
        });
    },

    /**
     *
     */
    hideIndicator : function() {
        this.draggableIndicator.setStyle('display', 'none');
    }
});