//
// jquery-validate-date
//
// Validates a start date and an end date in a set of two dates
// Validates that a date is in the past or future
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
var dateSplitter = "/";     //Change date dateSplitter accordingly, example: / or -
var dateFormat = "M";       //"M" for middle-endian MM/DD/YYYY, "L" for little-endian DD/MM/YYYY, "B" for big-endian YYYY/MM/DD
var allowToday = true;      //Change to allow or disallow the current date when checking for past and future dates
//


$(document).ready(function () {

    //Validate start/end dates
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
    $("input[data-start-date]").each(function(){
        $(this).rules( "add", {
            ranged: true
        });
    });
    $("input[data-end-date]").each(function(){
            $(this).rules( "add", {
            ranged: true
        });
    });
    
    //Validate start/end date when date range is changed
    $('body').on('change keyup', 'input[data-start-date]', function () {
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
    $('body').on('change keyup', 'input[data-end-date]', function () {
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

    //Validate past date
    //Valid if a date is in the past or is the current date
    jQuery.validator.addMethod("inPast", function (value, element) {
        var now = (new Date()).setHours(0,0,0,0);
        var date = (toDate($(element).val())).setHours(0,0,0,0);
        if ( ((date == now) && (allowToday == true)) || (date < now) ) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a valid past date.");
    $("input[data-past-date]").each(function(){
        $(this).rules( "add", {
            inPast: true
        });
    });

    //Validate future date
    //Valid if a date is in the future or is the current date
    jQuery.validator.addMethod("inFuture", function (value, element) {
        var now = (new Date()).setHours(0,0,0,0);
        var date = (toDate($(element).val())).setHours(0,0,0,0);
        if ( ((date == now) && (allowToday == true)) || (date > now) ) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a valid future date.");
    $("input[data-future-date]").each(function(){
        $(this).rules( "add", {
            inFuture: true
        });
    });

    //Validate past/future date when changed
    $('body').on('change keyup', 'input[data-future-date]', function () {
        if (toDate($(this).val()) != "Invalid Date") {
            $(this).valid();
        }
    });
    $('body').on('change keyup', 'input[data-end-date]', function () {
        if (toDate($(this).val()) != "Invalid Date") {
            $(this).valid();
        }
    });

});

//Convert date
function toDate(dateStr) {
    var parts = dateStr.split(dateSplitter);
    if (dateFormat = "M") {
        return new Date(parts[2], parts[0] - 1, parts[1]);
    } else if (dateFormat = "L") {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (dateFormat = "B") {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
        return null;
    }
}
