/**
 * @class Ext.uxold.colorpicker.util
 *
 */
Ext.define('Ext.uxold.colorpicker.util', {
    statics: {
        /**
         * Takes an element and a set of global coordinates.
         * Returns the local cordinates (e.g. coords based from the element)
         * @param element
         * @param xy
         * @return {Array}
         */
        getLocalCoords: function(element, xy) {
            var offsetX = 0,
                offsetY = 0;

            element = element.dom;

            do {
                offsetX += element.offsetLeft + element.clientLeft - element.scrollLeft;
                offsetY += element.offsetTop  + element.clientTop  - element.scrollTop;

            } while (element = element.offsetParent);

            return [
                xy[0] - offsetX,
                xy[1] - offsetY
            ];
        }
    }
});