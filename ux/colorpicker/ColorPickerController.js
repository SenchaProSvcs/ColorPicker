Ext.define('Ext.ux.colorpicker.ColorPickerController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.colorpickercontroller',

    requires: [
        'Ext.ux.colorpicker.ColorUtils'
    ],

    // Updates Saturation/Value in the model based on ColorMap; params:
    // xPercent - where is the handle relative to the color map width
    // yPercent - where is the handle relative to the color map height
    onColorMapHandleDrag: function(xPercent, yPercent) {
        var me            = this,
            vm            = me.getViewModel(),
            selectedColor = vm.get('selectedColor'),
            newHSV,
            newRGB;

        // Color map selection really only affects saturation and value of the color
        newHSV = { h: selectedColor.h, s: selectedColor.s, v: selectedColor.v };

        // x-axis of color map with value 0-1 translates to saturation
        newHSV.s = xPercent;

        // y-axis of color map with value 0-1 translates to reverse of "value"
        newHSV.v = 1-yPercent;

        newRGB = Ext.ux.colorpicker.ColorUtils.hsv2rgb(newHSV.h, newHSV.s, newHSV.v);

        // Save back to view model
        Ext.apply(selectedColor, newHSV);
        Ext.apply(selectedColor, newRGB);
        vm.set('selectedColor', selectedColor);
    },

    // Updates HSV Value in the model and downstream RGB settings
    onValueSliderHandleDrag: function(yPercent) {
        var me            = this,
            vm            = me.getViewModel(),
            selectedColor = vm.get('selectedColor'),
            newHSV,
            newRGB;

        // Slider selection only affects value of the color
        newHSV   = { h: selectedColor.h, s: selectedColor.s, v: selectedColor.v };
        newHSV.v = 1-yPercent;
        newRGB   = Ext.ux.colorpicker.ColorUtils.hsv2rgb(newHSV.h, newHSV.s, newHSV.v);

        // Save back to view model
        Ext.apply(selectedColor, newHSV);
        Ext.apply(selectedColor, newRGB);
        vm.set('selectedColor', selectedColor);
    },

    // Updates HSV Saturation in the model and downstream RGB settings
    onSaturationSliderHandleDrag: function(yPercent) {
        var me            = this,
            vm            = me.getViewModel(),
            selectedColor = vm.get('selectedColor'),
            newHSV,
            newRGB;

        // Slider selection only affects value of the color
        newHSV   = { h: selectedColor.h, s: selectedColor.s, v: selectedColor.v };
        newHSV.s = 1-yPercent;
        newRGB   = Ext.ux.colorpicker.ColorUtils.hsv2rgb(newHSV.h, newHSV.s, newHSV.v);

        // Save back to view model
        Ext.apply(selectedColor, newHSV);
        Ext.apply(selectedColor, newRGB);
        vm.set('selectedColor', selectedColor);
    },

    // Updates Hue in the model and downstream RGB settings
    onHueSliderHandleDrag: function(yPercent) {
        var me            = this,
            vm            = me.getViewModel(),
            selectedColor = vm.get('selectedColor'),
            newHSV,
            newRGB;

        // Slider selection only affects value of the color
        newHSV   = { h: selectedColor.h, s: selectedColor.s, v: selectedColor.v };
        newHSV.h = 1-yPercent;
        newRGB   = Ext.ux.colorpicker.ColorUtils.hsv2rgb(newHSV.h, newHSV.s, newHSV.v);

        // Save back to view model
        Ext.apply(selectedColor, newHSV);
        Ext.apply(selectedColor, newRGB);
        vm.set('selectedColor', selectedColor);
    },

    onAlphaSliderHandleDrag: function (yPercent) {
        var me            = this,
            vm            = me.getViewModel(),
            selectedColor = vm.get('selectedColor');

        // Slider selection only affects value of the color
        selectedColor.a = 1-yPercent;

        // Save back to view model
        vm.set('selectedColor', selectedColor);
    },

    onPreviousColorSelected: function (comp, color) {
        var me = this,
            vm = me.getViewModel();
            
        vm.set('selectedColor', Ext.clone(color));
    },

    onOkBtn: function () {
        var me   = this,
            view = me.getView(),
            vm   = me.getViewModel();

        view.fireEvent('okbuttonclick', view, view.getValue());
    },

    onCancelBtn: function () {
        var me   = this,
            view = me.getView();

        view.fireEvent('cancelbuttonclick', view);
    }
});