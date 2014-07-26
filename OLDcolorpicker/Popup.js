/**
 * @class Ext.uxold.colorpicker.Popup
 * @extends Ext.Component
 *
 */
Ext.define('Ext.uxold.colorpicker.Popup', {
    extend : 'Ext.Component',

    displayTpl : new Ext.XTemplate([
        '<div class="pointer-mask">',
            '<div class="pointer"></div>',
        '</div>',
        '<div class="content {contentClass}"></div>'
    ]),

    tipSize     : 13, //size of tip
    tipDeadZone : 5, //due to border radius etc, we can push it all they way to the cornder
    tipBorder   : 4, //size of the tip border, for correction of centering 

    floating     : true,
    height       : 100,
    width        : 100,
    shadow       : false,
    cls          : 'th-panel-popup',
    contentClass : '',

    /**
     *
     */
    onRender : function() {
        var me = this;

        me.callParent(arguments);

        me.displayTpl.append(me.el, {contentClass : me.contentClass});

        me.contentEl     = me.el.down('.content');
        me.pointerMaskEl = me.el.down('.pointer-mask');
    },

    /**
     *
     * @param x
     * @param y
     * @param targetWidth
     * @param targetHeight
     */
    showWithTipAt : function(x, y, targetWidth, targetHeight, tipMarginLeft) {
        targetWidth  = targetWidth  || 0;
        targetHeight = targetHeight || 0;

        var me = this;

        //if is hidden, we could cache sizes, and only do this on first render
        me.show();

        var height     = me.getHeight(),
            width      = me.getWidth(),
            viewport   = Ext.getBody(), // todo: changed by tobiu -> viewport = xds.designer;
            viewHeight = viewport.getHeight(),
            viewWidth  = viewport.getWidth(),

            //assume we can fit in on page

            //we preffer bottom position, but we'll do top in case we can fit
            //this could also be expanded to left/right in the future
            placement  = 'bottom',
            bottomSize = (viewHeight - y) - height;

        if (bottomSize < 50) {
            //if margin is less than 50px on bottom placements, let's do top placement
            placement = 'top';
            y = y - height - me.tipSize + 6;
        } else {
            y = y + targetHeight + me.tipSize - 6;
        }


        //tip placement
        //prefer left
        var tipPosition = 0, //left
            rightMargin = viewWidth - (x + width);

        if (rightMargin < 10) {
            //too close to the edge, 
            tipPosition = 6 - rightMargin;
            x = x - (10 - rightMargin);
        }

        //could also check left margin here

        //tip can't be on the corner. checking left corner
        if (tipPosition < me.tipDeadZone) {
            x = x - (me.tipDeadZone - tipPosition);
            tipPosition = me.tipDeadZone;
        }

        me.showAt(x, y);

        me.pointerMaskEl.dom.style.left = tipPosition - (me.tipBorder) + tipMarginLeft + 'px';

        if (placement === 'bottom') {
            //this "bottom" refers to tip placements (e.g. inverse of panel placement)
            me.pointerMaskEl.dom.classList.remove('bottom');
        } else {
            me.pointerMaskEl.dom.classList.add('bottom');
        }
    },

    /**
     *
     */
    afterShow : function() {
        this.callParent(arguments);
        Ext.getDoc().on('mousedown', this.onDocumentClick, this);
    },

    /**
     *
     */
    onHide : function() {
        this.callParent(arguments);
        Ext.getDoc().un('mousedown', this.onDocumentClick, this);
    },

    /**
     *
     */
    beforeDestroy : function() {
        Ext.getDoc().un('mousedown', this.onDocumentClick, this);
        this.callParent(arguments);
    },

    /**
     *
     * @param event
     */
    onDocumentClick : function(event) {
        var target = event.getTarget("#" + this.el.id);

        if (!target) {
            this.hide();
        }
    }
});