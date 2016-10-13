//
// jquery-validate-date
//
// Validates a start date and an end date in a set of two dates
// Validates that a date is in the past or future
// Validates whether or not a date is the current date
//
// Example uses:
// <input id="Start_Date_1" data-start-date="1">
// <input id="End_Date_1" data-end-date="1">
// <input id="Future_Date" data-future-date>
// <input id="Past_Date" data-past-date>
// <input id="Current_Date" data-current-date>
//
// Example combination uses:
// <input id="Current_Or_Past_Date" data-current-date data-past-date>
//
// Dependencies:
// jQuery - https://jquery.com/
// jQuery Validation Plugin - https://jqueryvalidation.org/
//


//
// Options
//
// "M" for middle-endian date MM/DD/YYYY, "L" for little-endian date DD/MM/YYYY, "B" for big-endian date YYYY/MM/DD
//
var dateFormat = "M";
//




// jvdate object
var jvdate = {
    // minDate: function(date) {
    //     if (toDate(date) != "Invalid Date") {
    //         minDate = date;
    //     }
    // },
    // maxDate: function(date) {
    //     if (toDate(date) != "Invalid Date") {
    //         maxDate = date;
    //     }
    // },
    format: function(format) {
        if (format == "M" || format == "L" || format == "B") { 
            dateFormat = format;
        } else if ($(format).contains("MM") && $(format).contains("DD") && $(format).contains("YYYY") 
            && ($(format).contains("/") || $(format).contains("-") || $(format).contains("*"))) {
            var dateSplitter = findSplitter(format);
            switch(format) {
                case "MM" + dateSplitter + "DD" + dateSplitter + "YYYY":
                    dateFormat = "M";
                    break;
                case "DD" + dateSplitter + "MM" + dateSplitter + "YYYY":
                    dateFormat = "M";
                    break;
                case "YYYY" + dateSplitter + "MM" + dateSplitter + "DD":
                    dateFormat = "B";
                    break; 
            }
        }
    },
    rebind: function() {
        jvBind();
    }
};

//Find splitter
function findSplitter(dateStr) {
    if ($(dateStr).contains("-") && !($(dateStr).contains("/")) && !($(dateStr).contains("*"))) {
        return "-";
    } else if ($(dateStr).contains("*") && !($(dateStr).contains("/")) && !($(dateStr).contains("-"))) {
        return "*";
    } else if ($(dateStr).contains("/") && !($(dateStr).contains("-")) && !($(dateStr).contains("*"))) {
        return "/";
    } else {
        return "";
    }
}

//Convert date
function toDate(dateStr) {
    var dateSplitter = findSplitter(dateStr);
    if (dateSplitter == "") {
        return "Invalid Date";
    }
    var parts = dateStr.split(dateSplitter);
    if (dateFormat = "M") {
        return (new Date(parts[2], parts[0] - 1, parts[1])).setHours(0,0,0,0);
    } else if (dateFormat = "L") {
        return (new Date(parts[2], parts[1] - 1, parts[0])).setHours(0,0,0,0);
    } else if (dateFormat = "B") {
        return (new Date(parts[0], parts[1] - 1, parts[2])).setHours(0,0,0,0);
    } else {
        return "Invalid Date";
    }
}     

// Min/max date setting
// var maxDate = "";
// var minDate = "";


// Bind validators
function jvBind() {

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

    //Validate current date
    jQuery.validator.addMethod("isCurrent", function (value, element) {
        if ( ($(element).attr('data-past-date') != undefined) || ($(element).attr('data-future-date') != undefined) ) {
            return true;
        } else {
            var date = (toDate($(element).val()));
            var now = (new Date());
            if (date == now) {
                return true;
            } else {
                return false;
            }
        }

    }, "Please enter a valid current date.");
    $("input[data-current-date]").each(function(){
        $(this).rules( "add", {
            isCurrent: true
        });
    });

    //Validate past date
    jQuery.validator.addMethod("inPast", function (value, element) {
        var now = (new Date());
        var date = (toDate($(element).val()));
        if ( ((date == now) && ($(element).attr('data-current-date') != undefined)) || (date < now) ) {
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
    jQuery.validator.addMethod("inFuture", function (value, element) {
        var now = (new Date());
        var date = (toDate($(element).val()));
        if ( ((date == now) && ($(element).attr('data-current-date') != undefined)) || (date > now) ) {
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

    //Validate max date
    jQuery.validator.addMethod("beforeOrAtMax", function (value, element) {
        var _maxDate = "";
        if (toDate(element.getAttribute('data-max-date')) != "Invalid Date" ) {
            _maxDate = toDate(element.getAttribute('data-max-date'));
        // } else if (toDate($(maxDate).val()) != "Invalid Date") {
        //     _maxDate = maxDate;
        } else {
            return true;
        }
        var date = toDate($(element).val());
        if (date <= _maxDate ) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date on or before the maximum date.");
    $("input[data-max-date]").each(function() {
        $(this).rules( "add", {
            beforeOrAtMax: true
        });
    });

    //Validate min date
    jQuery.validator.addMethod("afterOrAtMin", function (value, element) {
        var _minDate = "";
        if (toDate(element.getAttribute('data-min-date')) != "Invalid Date" ) {
            _minDate = toDate(element.getAttribute('data-min-date'));
        // } else if (toDate($(minDate).val()) != "Invalid Date") {
        //     _minDate = minDate;
        } else {
            return true;
        }
        var date = toDate($(element).val());
        if (date >= _minDate ) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date on or after the minimum date.");
    $("input[data-min-date]").each(function() {
        $(this).rules( "add", {
            afterOrAtMin: true
        });
    });

}


$(document).ready(function () {
    jvBind();
});