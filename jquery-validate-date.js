//
// jquery-validate-date
//
// Validates a start date and an end date in a set of two dates
//
// Example usage:
// <input name="startDate1" data-start-date="1">
// <input name="endDate1" data-end-date="1">
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
    jQuery.validator.addClassRules({
        dateSelect: {
            ranged: true
        },
        date: {
            ranged: true
        }
    });
    //Validate when date range is changed
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
