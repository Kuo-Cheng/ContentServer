jQuery(document).ready(function () {
    jQuery('.event').on("dragstart", function (event) {
        var dt = event.originalEvent.dataTransfer;
        dt.setData('Text', jQuery(this).attr('id'));
    });
    jQuery('table td').on("dragenter dragover drop", function (event) {
        event.preventDefault();
        if (event.type === 'drop') {
            var data = event.originalEvent.dataTransfer.getData('Text', jQuery(this).attr('id'));
            de = jQuery('#' + data).detach();
            de.appendTo(jQuery(this));

        };
    });
})