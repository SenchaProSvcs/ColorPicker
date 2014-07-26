/**
 * @class Ext.uxold.colorpicker.Drag
 *
 */
Ext.define('Ext.uxold.colorpicker.Drag', {
    mixins : {
        observable : 'Ext.util.Observable'
    },

    /**
     *
     * @param config
     */
    constructor : function(config) {
        var me = this;

        Ext.applyIf(me, config || {});

        Ext.applyIf(me, {
            moveThreshold      : 2,
            preventPropagation : false,
            onClick            : Ext.emptyFn,
            onStart            : Ext.emptyFn,
            onMove             : Ext.emptyFn,
            onMoveEnd          : Ext.emptyFn,
            onDoubleClick      : Ext.emptyFn
        });

        if (me.element === undefined) {
            console.error('Needs element');
        }

        me.startPosition = [];

        me.mixins.observable.constructor.call(me, config);

        me.setup();
    },

    /**
     * Setup listener
     */
    setup : function() {
        var me      = this,
            element = me.element;

        element.on({
            dblclick  : me.doubleClick,
            mousedown : me.start,
            scope     : me
        });

        element.dom.onselectstart = function() {
            return false;
        };

        if (me.preventPropagation) {
            element.on({
                click     : me.stopBubbling,
                dblclick  : me.stopBubbling,
                mousedown : me.stopBubbling,
                scope     : me
            });
        }
    },

    /**
     *
     * @param event
     */
    stopBubbling : function(event) {
        event.stopPropagation();
    },

    /**
     *
     * @return {Array}
     */
    getStartPosition : function() {
        return this.startPosition;
    },

    /**
     *
     * @param event
     */
    start : function(event) {
        var me = this;

        Ext.apply(me, {
            firstMove     : true,
            hasMoved      : false,
            selected      : true,
            startPosition : event.getXY()
        });

        me.addDocumentListeners();

        me.onStart.call(me.scope, me, event);
    },

    /**
     *
     * @param event
     */
    doubleClick : function(event) {
        this.onDoubleClick.call(this.scope, this, event);
    },

    /**
     *
     * @param event
     */
    mouseMove : function(event) {
        var me = this,
            dx,
            dy;

        me.currentPosition = event.getXY();

        var distance = me.getDistance(me.startPosition, me.currentPosition);

        if (distance > me.moveThreshold || me.hasMoved) {
            me.hasMoved = true;

            dx = me.currentPosition[0] - me.startPosition[0];
            dy = me.currentPosition[1] - me.startPosition[1];

            me.onMove.call(me.scope, dx, dy, me, event);

            me.firstMove = false;
        }
    },

    /**
     *
     * @param event
     */
    mouseUp : function(event) {
        var me = this,
            dx,
            dy;

        me.endPosition = event.getXY();

        if (me.hasMoved) {
            dx = me.endPosition[0] - me.startPosition[0];
            dy = me.endPosition[1] - me.startPosition[1];

            me.onMoveEnd.call(me.scope, dx, dy, me, event);

        } else {
            me.onClick.call(me.scope, me, event);
        }

        me.removeDocumentListeners();
    },

    /**
     * Adds the mousemove and mouseup listeners on document level
     * @private
     */
    addDocumentListeners : function() {
        var me = this;

        Ext.getDoc().on({
            mousemove : me.mouseMove,
            mouseup   : me.mouseUp,
            scope     : me
        });
    },

    /**
     * Removes the mousemove and mouseup listeners on document level
     * @private
     */
    removeDocumentListeners : function() {
        var me = this;

        Ext.getDoc().un({
            mousemove : me.mouseMove,
            mouseup   : me.mouseUp,
            scope     : me
        });
    },

    /**
     * Removes the mousemove and mouseup listeners on document level
     */
    cancel : function() {
        this.removeDocumentListeners();
    },

    /**
     * Removes the document and element listeners
     * @private
     */
    remove : function() {
        var me      = this,
            element = me.element;

        me.removeDocumentListeners();

        if (!element) {
            return;
        }

        element.un({
            dblclick  : me.doubleClick,
            mousedown : me.start,
            scope     : me
        });

        if (me.preventPropagation) {
            element.un({
                click     : me.stopBubbling,
                dblclick  : me.stopBubbling,
                mousedown : me.stopBubbling,
                scope     : me
            });
        }

        me.element = null;
    },

    /**
     * Calculates the distance between two points
     * @param {Array} xy1
     * @param {Array} xy2
     * @return {Number}
     */
    getDistance : function(xy1, xy2) {
        var dx = xy1[0] - xy2[0],
            dy = xy1[1] - xy2[1];

        return Math.sqrt(dx * dx + dy * dy);
    }
});