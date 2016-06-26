//
// jquery-validate-date
//
// Dependencies:
// jQuery - https://jquery.com/
// jQuery Validation Plugin - https://jqueryvalidation.org/
//


//
// Options
//
var splitter = "/";     //Change date splitter accordingly, example: / or -
var format = "US";      //"US" for MM/DD/YYYY, "EU" for DD/MM/YYYY


$(document).ready(function () {
    //
    //Check past/future dates
    //
    $('input[data-date-past]').blur(function () {
        var now = new Date();
        var date = toDate($(this).val());
        if (date > now) {
            var name = $(this).attr('name');
            eval("$validator.showErrors({ " + name + ": \"Please enter a past date.\" });");
        }
    });
    $('input[data-date-future]').blur(function () {
        var now = new Date();
        var date = toDate($(this).val());
        if (date < now) {
            var name = $(this).attr('name');
            eval("$validator.showErrors({ " + name + ": \"Please enter a future date.\" });");
        }
    });
    $("input[data-date-past]").datepicker('change', { minDate: -99999, maxDate: 0 });
    $("input[data-date-future]").datepicker('change', { minDate: 0, maxDate: 99999 });
    //
    //End Check past/future dates
    //


    //
    //Check start/end dates
    //
    $('input[data-date-start]').change(function () {
        var dateStart = toDate($(this).val());
        var dateEnd = dateStart;
        var linker = $(this).attr('data-date-start');
        $('input[data-date-end]').each(function () {
            if ($(this).attr('data-date-end') == linker) {
                dateEnd = toDate($(this).val());
                $(this).datepicker('change', {
                    minDate: dateStart
                });
            }
        });
    });
    $('input[data-date-start]').blur(function () {
        var dateStart = toDate($(this).val());
        var dateEnd = dateStart;
        var linker = $(this).attr('data-date-start');
        $('input[data-date-end]').each(function () {
            if ($(this).attr('data-date-end') == linker) {
                dateEnd = toDate($(this).val());
            }
        });
        if (dateStart > dateEnd) {
            var name = $(this).attr('name');
            eval("$validator.showErrors({ " + name + ": \"Please enter a valid start date.\" });");
        }
    });
    $('input[data-date-end]').change(function () {
        var dateEnd = toDate($(this).val());
        var dateStart = dateEnd;
        var linker = $(this).attr('data-date-end');
        $('input[data-date-start]').each(function () {
            if ($(this).attr('data-date-start') == linker) {
                dateStart = toDate($(this).val());
                $(this).datepicker('change', {
                    maxDate: dateEnd
                });
            }
        });
    });
    $('input[data-date-end]').blur(function () {
        var dateEnd = toDate($(this).val());
        var dateStart = dateEnd;
        var linker = $(this).attr('data-date-end');
        $('input[data-date-start]').each(function () {
            if ($(this).attr('data-date-start') == linker) {
                dateStart = toDate($(this).val());
            }
        });
        if (dateStart > dateEnd) {
            var name = $(this).attr('name');
            eval("$validator.showErrors({ " + name + ": \"Please enter a valid end date.\" });");
        }
    });
    $("input[data-date-start]").datepicker();
    $("input[data-date-end]").datepicker();

    
    jQuery.validator.addMethod("ranged", function (value, element) {
        var dateEnd = toDate(value);
        var dateStart = dateEnd;
        //Check for end date attr
        var linker = element.getAttribute('data-end-date');
        if (linker == null) {
            //Check for start end attr
            linker = element.getAttribute('data-start-date');
            if (linker == null) {
                return true;
            } else {
                //Handle start date attr
                $('input[data-end-date]').each(function () {
                    if ($(this).attr('data-end-date') == linker) {
                        dateEnd = toDate($(this).val());
                    }
                });
                if (dateStart > dateEnd) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            //Handle end date attr
            $('input[data-start-date]').each(function () {
                if ($(this).attr('data-start-date') == linker) {
                    dateStart = toDate($(this).val());
                }
            });
            if (dateStart > dateEnd) {
                return false;
            } else {
                return true;
            }
        }
    }, "Please enter a valid date range.");
    $( 'input[data-date-start]' ).rules( 'add', {
        ranged: true,
    });
    $( 'input[data-date-end]' ).rules( 'add', {
        ranged: true,
    });
    //
    //End Check start/end dates
    //

});

//
//Convert date
//
function toDate(dateStr) {
    var parts = dateStr.split(splitter);
    if (format = "US") {
        return new Date(parts[2], parts[0] - 1, parts[1]);
    } else if (format = "EU") {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        return null;
    }
}

