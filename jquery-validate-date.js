//
// jquery-validate-date
//
// Validates a start date and an end date in a set of two dates
//
// Example usages:
// <input name="startDate1" data-start-date="1">
// <input name="endDate1" data-end-date="1">
// <input name="futureDate" data-future-date>
// <input name="pastDate" data-past-date>
//
// Dependencies:
// jQuery - https://jquery.com/
// jQuery Validation Plugin - https://jqueryvalidation.org/
//
// Options
var splitter = "/";     //Change date splitter accordingly, example: / or -
var format = "US";      //"US" for MM/DD/YYYY, "EU" for DD/MM/YYYY
//


$(document).ready(function () {
    //Start/End date validation
    jQuery.validator.addMethod("ranged", function (value, element) {
        var dateEnd = toDate(value);
        var dateStart = dateEnd;
        var linked = null;
        //Check for end date attr
        var linker = element.getAttribute('data-end-date');
        if (linker == null) {
            //Check for start date attr
            linker = element.getAttribute('data-start-date');
            if (linker == null) {
                return true;
            } else {
                //Handle start date attr
                $('input[data-end-date]').each(function () {
                    if ($(this).attr('data-end-date') == linker) {
                        dateEnd = toDate($(this).val());
                        linked = this;
                    }
                });
                if (dateStart > dateEnd) {
                    return false;
                } else {
                    if ($(linked).hasClass('error')) {
                        $(linked).removeClass('error')
                    }
                    return true;
                }
            }
        } else {
            //Handle end date attr
            $('input[data-start-date]').each(function () {
                if ($(this).attr('data-start-date') == linker) {
                    dateStart = toDate($(this).val());
                    linked = this;
                }
            });
            if (dateStart > dateEnd) {
                return false;
            } else {
                if ($(linked).hasClass('error')) {
                    $(linked).removeClass('error')
                }
                return true;
            }
        }
    }, "Please enter a valid date range.");
    $("[data-start-date]").rules( "add", {
        ranged: true
    });
    $("[data-end-date]").rules( "add", {
        ranged: true
    });
    //Validate start/end date when date range is changed
    $('body').on('change blur', 'input[data-start-date]', function () {
        var dateEnd = "Invalid Date";
        var linker = $(this).attr('data-start-date');
        $('input[data-end-date]').each(function () {
            if ($(this).attr('data-end-date') == linker) {
                dateEnd = toDate($(this).val());
                if (dateEnd != "Invalid Date") {
                    $(this).valid();
                }

            }
        });
        if (dateEnd != "Invalid Date") {
            $(this).valid();
        }
    });
    $('body').on('change blur', 'input[data-end-date]', function () {
        var dateStart = "Invalid Date";
        var linker = $(this).attr('data-end-date');
        $('input[data-start-date]').each(function () {
            if ($(this).attr('data-start-date') == linker) {
                dateStart = toDate($(this).val());
                if (dateStart != "Invalid Date") {
                    $(this).valid();
                }

            }
        });
        if (dateStart != "Invalid Date") {
            $(this).valid();
        }
    });

    //Validate past/future dates
    jQuery.validator.addMethod("past", function (value, element) {
        var now = new Date();
        var date = toDate($(element).val());
        if (date > now) {
            return false;
        } else {
            return true;
        }
    }, "Please enter a valid past date.");
        jQuery.validator.addMethod("future", function (value, element) {
        var now = new Date();
        var date = toDate($(element).val());
        if (date < now) {
            return false;
        } else {
            return true;
        }
    }, "Please enter a valid future range.");
    $("[data-past-date]").rules( "add", {
        past: true
    });
    $("[data-future-date]").rules( "add", {
        future: true
    });

});

//Convert date
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
