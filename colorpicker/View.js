/**
 * @class Ext.ux.colorpicker.View
 *
 */
Ext.define('Ext.ux.colorpicker.View', {
    requires : [
        'Ext.ux.colorpicker.AlphaSlider',
        'Ext.ux.colorpicker.color',
        'Ext.ux.colorpicker.Drag',
        'Ext.ux.colorpicker.HueSlider',
        'Ext.ux.colorpicker.Map',
        'Ext.ux.colorpicker.SaturationSlider',
        'Ext.ux.colorpicker.Swatches',
        'Ext.ux.colorpicker.ValueSlider'
    ],

    mixins : {
        observable : 'Ext.util.Observable'
    },

    /**
     *
     * @param config
     */
    constructor : function(config) {
        config = config || {};
        Ext.applyIf(this, config);

        this.mixins.observable.constructor.call(this, config);
    },

    /**
     *
     * @param parent
     */
    renderInsideElement : function(parent) {
        var me = this;

        me.parent = parent;

        var template = new Ext.XTemplate(
            '<div class="pickers">',
                '<div class="map"></div>',
                '<div class="barH slider"></div>',
                '<div class="barS slider"></div>',
                '<div class="barV slider"></div>',
                '<div class="barA slider"></div>',
            '</div>',
            '<div class="preview">',
                '<div class="new"></div>',
                '<div class="old"></div>',
            '</div>',
            '<div class="buttons"></div>',
            '<div class="labels">',
                '<div class="hex">HEX</div>',
                '<div class="red">R</div>',
                '<div class="green">G</div>',
                '<div class="blue">B</div>',
                '<div class="hue">H</div>',
                '<div class="saturation">S</div>',
                '<div class="value">V</div>',
                '<div class="alpha">A</div>',
            '</div>',
            '<div class="fields">',
                '<div class="hex"></div>',
                '<div class="red"></div>',
                '<div class="green"></div>',
                '<div class="blue"></div>',
                '<div class="hue"></div>',
                '<div class="saturation"></div>',
                '<div class="value"></div>',
                '<div class="alpha"></div>',
            '</div>',
            '<div class="library">',
                '<div class="label">PALETTE</div>',
                '<div class="palette-container"></div>',
                '<div class="button-container"></div>',
            '</div>'
        );

        template.append(parent);

        //create a shadow/clone for measurements
        var clone = new Ext.Element(document.createElement('div'));
        //cc = clone; // todo tobiu: removed the global var

        clone.addCls('hiddenContainer th-colorpicker');

        Ext.getBody().appendChild(clone);
        template.append(clone);

        //******** FIELDS ****************
        var fields = parent.down('.fields');

        // var fieldsClone = cloneContainer.down('.fields')
        me.hexField = new Ext.form.TextField({
            renderTo        : fields.down('.hex'),
            value           : "#ff1122",
            enableKeyEvents : true,
            colorParameter  : 'hex',
            listeners       : {
                scope : me,
                keyup : me.onFieldKeyup,
                blur  : me.onFieldBlur,
                focus : me.onFieldFocus
            },
            width : 63
        });

        //TODO, port over sliderfields
        var AN = {};
        AN.SliderField = Ext.form.field.Text;

        var fieldConfig = {
            enableKeyEvents : true,
            width           : 30,
            maxValue        : 255,
            minValue        : 0,
            value           : 0,
            listeners       : {
                scope : me,
                keyup : me.onFieldKeyup,
                blur  : me.onFieldBlur,
                focus : me.onFieldFocus
            }
        };

        me.redField = new AN.SliderField(
            Ext.apply({}, {colorParameter : 'r', renderTo : fields.down('.red')}, fieldConfig)
        );

        me.greenField = new AN.SliderField(
            Ext.apply({}, {colorParameter : 'g', renderTo : fields.down('.green')}, fieldConfig)
        );

        me.blueField = new AN.SliderField(
            Ext.apply({}, {colorParameter : 'b', renderTo : fields.down('.blue')}, fieldConfig)
        );

        Ext.apply(fieldConfig, {
            maxValue   : 100,
            multiplier : 100
        });

        me.saturationField = new AN.SliderField(
            Ext.apply({}, {colorParameter : 's', renderTo : fields.down('.saturation')}, fieldConfig)
        );

        me.valueField = new AN.SliderField(
            Ext.apply({}, {colorParameter : 'v', renderTo : fields.down('.value')}, fieldConfig)
        );

        me.alphaField = new AN.SliderField(
            Ext.apply({}, {colorParameter : 'a', renderTo : fields.down('.alpha')}, fieldConfig)
        );

        me.hueField = new AN.SliderField(
            Ext.apply({}, {
                colorParameter : 'h',
                maxValue        : 360,
                multiplier      : 360,
                renderTo       : fields.down('.hue')
            }, fieldConfig)
        );

        //******** MAPS/BARS ****************

        var mapClone = clone.down('.map').dom;
        me.map = new Ext.ux.colorpicker.Map();
        me.map.renderInsideElement(parent.down('.map'), mapClone.clientWidth, mapClone.clientHeight);

        var hueClone = clone.down('.barH').dom;
        me.barH = new Ext.ux.colorpicker.HueSlider();
        me.barH.renderInsideElement(parent.down('.barH'), hueClone.clientWidth, hueClone.clientHeight);

        var saturationClone = clone.down('.barS').dom;
        me.barS = new Ext.ux.colorpicker.SaturationSlider();
        me.barS.renderInsideElement(parent.down('.barS'), saturationClone.clientWidth, saturationClone.clientHeight);

        var valueClone = clone.down('.barV').dom;
        me.barV = new Ext.ux.colorpicker.ValueSlider();
        me.barV.renderInsideElement(parent.down('.barV'), valueClone.clientWidth, valueClone.clientHeight);

        var alphaClone = clone.down('.barA').dom;
        me.barA = new Ext.ux.colorpicker.AlphaSlider();
        me.barA.renderInsideElement(parent.down('.barA'), alphaClone.clientWidth, alphaClone.clientHeight);

        //******** PREVIEWS ****************

        var previews = parent.down('.preview');
        me.newColorPreview = previews.down('.new');
        me.oldColorPreview = previews.down('.old');

        me.oldColorPreview.on('click', function() {
            me.fireEvent('defaultColorClick');
        }, me);

        //******** PALETTE ****************

        var palette = parent.down('.palette-container');
        me.swatches = new Ext.ux.colorpicker.Swatches();

        var storeButton = parent.down('.button-container');

        Ext.create('Ext.Container', {
            renderTo : storeButton,
            width    : 62,
            height   : 25,
            defaults : {
                xtype   : 'button',
                height  : 23,
                width   : 62,
                padding : 0
            },
            items : [
                {
                    cls     : 'xds-button',
                    id      : 'addToPaletteButton',
                    text    : 'Add',
                    handler : function() {
                        this.fireEvent('addToPalette');
                    },
                    scope : me
                }
            ]
        });

        me.addToPaletteButton = Ext.getCmp('addToPaletteButton');

        //per default we assume that palette has space
        me.swatchAddingEnabled = true;

        me.swatches.on('paletteFull', function() {
            me.addToPaletteButton.disable();
            me.swatchAddingEnabled = false;
            console.log("FULL");
        }, this);

        me.swatches.on('paletteAvailable', function() {
            me.addToPaletteButton.enable();
            me.swatchAddingEnabled = true;
        }, me);

        me.swatches.renderInsideElement(palette);

        //plug in new preview area into swatches
        me.newColorHandler = new Ext.ux.colorpicker.Drag({
            element : me.newColorPreview,

            onStart : function() {
                if (me.swatchAddingEnabled) {
                    me.swatches.prepareDraggable(event.x, event.y);
                }
            },

            onMove : function() {
                if (me.swatchAddingEnabled) {
                    me.swatches.updateDraggable(event.x, event.y, this.newPreviewColorRGBA);
                }
            },

            onMoveEnd : function() {
                if (me.swatchAddingEnabled) {
                    me.swatches.hideDraggable(event.x, event.y);
                }
            },
            preventPropagation : true,
            scope              : me
        });

        //plug in old preview area into swatches
        me.oldColorHandler = new Ext.ux.colorpicker.Drag({
            element : me.oldColorPreview,
            onStart : function() {
                if (me.swatchAddingEnabled) {
                    me.swatches.prepareDraggable(event.x, event.y);
                }
            },

            onMove : function() {
                if (me.swatchAddingEnabled) {
                    me.swatches.updateDraggable(event.x, event.y, this.oldPreviewColorRGBA);
                }
            },

            onMoveEnd : function() {
                if (me.swatchAddingEnabled) {
                    me.swatches.hideDraggable(event.x, event.y);
                }
            },

            preventPropagation : true,
            scope              : me
        });

        //******** BUTTONS ****************

        var buttons = parent.down('.buttons');

        Ext.create('Ext.Container', {
            renderTo : buttons,
            layout   : 'vbox',
            width    : 62,
            height   : 90,

            defaults : {
                xtype   : 'button',
                height  : 23,
                width   : 62,
                padding : 0,
                margin  : '0 0 5 0' //margin added for spacing between the buttons top->down
            },

            items : [
                {
                    cls     : 'xds-btn-action',
                    text    : 'OK',
                    scope   : me,
                    handler : function() {
                        this.fireEvent('save');
                    }
                },
                {
                    cls     : 'xds-button',
                    text    : 'Cancel',
                    scope   : me,
                    handler : function() {
                        this.fireEvent('cancel');
                    }
                }
            ]
        });

        clone.remove();
    },

    /**
     *
     * @param rgb
     * @param a
     */
    setNewPreviewColor : function(rgb, a) {
        this.setPreviewColor(this.newColorPreview, rgb, a);
        this.newPreviewColorRGBA = rgb.concat(a);
    },

    /**
     *
     * @param rgb
     * @param a
     */
    setOldPreviewColor : function(rgb, a) {
        this.setPreviewColor(this.oldColorPreview, rgb, a);
        this.oldPreviewColorRGBA = rgb.concat(a);
    },

    /**
     *
     * @param element
     * @param rgb
     * @param a
     */
    setPreviewColor : function(element, rgb, a) {
        element.dom.style.backgroundColor = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
    },

    /**
     *
     * @param field
     * @param event
     */
    onFieldFocus : function(field, event) {
        // console.log('focus');
    },

    /**
     *
     * @param field
     * @param event
     */
    onFieldBlur : function(field, event) {
        this.fireEvent('fieldChangeDone');
    },

    /**
     *
     * @param field
     * @param event
     */
    onFieldKeyup : function(field, event) {
        var value = field.getValue();

        if (field.maxValue !== undefined) {
            // console.log('minval');
            value = Math.max(value, field.minValue);
        }
        if (field.maxValue !== undefined) {
            value = Math.min(value, field.maxValue);
        }

        if (field.multiplier) {
            value = value / field.multiplier;
        }
        this.fireEvent('fieldChange', value, field.colorParameter);
    },

    /**
     * Rounds a number to have a decimal precision of 1
     * @param number
     * @return {Number}
     */
    roundOneDecimal : function(number) {
        return Math.round(number * 10) / 10;
    },

    /**
     *
     * @param rgb
     * @param alpha
     * @param hsv
     */
    setColor : function(rgb, alpha, hsv) {
        var me = this;

        me.setField(me.redField,        rgb[0]);
        me.setField(me.greenField,      rgb[1]);
        me.setField(me.blueField,       rgb[2]);
        me.setField(me.hueField,        Math.round(hsv[0] * me.hueField.multiplier));
        me.setField(me.saturationField, me.roundOneDecimal(hsv[1] * me.saturationField.multiplier));
        me.setField(me.valueField,      me.roundOneDecimal(hsv[2] * me.valueField.multiplier));
        me.setField(me.alphaField,      Math.round(alpha * me.alphaField.multiplier));
        me.setField(me.hexField,        "#" + Ext.ux.colorpicker.color.rgb2hex(rgb));
    },

    /**
     * Sets the value of a field, in case it does not have focus and the value has changed
     * @param field
     * @param value
     */
    setField : function(field, value) {
        if (!field.hasFocus && field.getValue() !== value) {
            field.setValue(value);
        }
    }
});