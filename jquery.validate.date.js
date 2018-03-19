//
// jquery.validate.date
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




// jvdate object
var jvdate = {
    dateformat: "M"
};

jvdate.initvalidator = function() {
        $.validate();
        this.bind();
}

jvdate.format = function (format) {
    if (format == null || format == "") {
        return;
    } else if (format == "M" || format == "L" || format == "B") { 
        jvdate.dateformat = format;
    } else if (format.indexOf("MM") > -1 && format.indexOf("DD") > -1 && format.indexOf("YYYY") > -1
        && (format.indexOf("/") > -1 || format.indexOf("-") > -1 || format.indexOf("*") > -1)) {
        var dateSplitter = jvdate.findsplitter(format);
        switch(format) {
            case "MM" + dateSplitter + "DD" + dateSplitter + "YYYY":
                jvdate.dateformat = "M";
                break;
            case "DD" + dateSplitter + "MM" + dateSplitter + "YYYY":
                jvdate.dateformat = "M";
                break;
            case "YYYY" + dateSplitter + "MM" + dateSplitter + "DD":
                jvdate.dateformat = "B";
                break; 
        }
    }
};

jvdate.setformat = function (format) {
    jvdate.format(format);
};

jvdate.todate = function(dateStr) {
    var dateSplitter = jvdate.findsplitter(dateStr);
    if (dateSplitter == "") {
        return "Invalid Date";
    }
    var parts = dateStr.split(dateSplitter);
    if (jvdate.dateformat = "M") {
        return (new Date(parts[2], parts[0] - 1, parts[1])).setHours(0,0,0,0);
    } else if (jvdate.dateformat = "L") {
        return (new Date(parts[2], parts[1] - 1, parts[0])).setHours(0,0,0,0);
    } else if (jvdate.dateformat = "B") {
        return (new Date(parts[0], parts[1] - 1, parts[2])).setHours(0,0,0,0);
    } else {
        return "Invalid Date";
    }
};

jvdate.findsplitter = function (dateStr) {
    if (dateStr == null || dateStr == "") {
        return "";
    } else if (dateStr.indexOf("-") > -1 && !(dateStr.indexOf("/") > -1) && !(dateStr.indexOf("*") > -1)) {
        return "-";
    } else if (dateStr.indexOf("*") > -1 && !(dateStr.indexOf("/") > -1) && !(dateStr.indexOf("-") > -1)) {
        return "*";
    } else if (dateStr.indexOf("/") > -1 && !(dateStr.indexOf("-") > -1) && !(dateStr.indexOf("*") > -1)) {
        return "/";
    } else {
        return "";
    }
};

jvdate.rebind = function() {
    this.bind();
};

jvdate.bind = function () {
    //Validate start/end dates
    jQuery.validator.addMethod("ranged", function (value, element) {
        var dateEnd = jvdate.todate(value);
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
                        dateEnd = jvdate.todate($(this).val());
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
                    dateStart = jvdate.todate($(this).val());
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
    $("input[data-start-date]").each(function () {
        $(this).rules("add", {
            ranged: true
        });
    });
    $("input[data-end-date]").each(function () {
        $(this).rules("add", {
            ranged: true
        });
    });

    //Validate start/end date when date range is changed
    $('body').on('change keyup', 'input[data-start-date]', function () {
        var dateEnd = "Invalid Date";
        var linker = $(this).attr('data-start-date');
        $('input[data-end-date]').each(function () {
            if ($(this).attr('data-end-date') == linker) {
                dateEnd = jvdate.todate($(this).val());
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
                dateStart = jvdate.todate($(this).val());
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
        if (($(element).attr('data-past-date') != undefined) || ($(element).attr('data-future-date') != undefined)) {
            return true;
        } else {
            var date = (jvdate.todate($(element).val()));
            var now = (new Date());
            if (date == now) {
                return true;
            } else {
                return false;
            }
        }

    }, "Please enter a valid current date.");
    $("input[data-current-date]").each(function () {
        $(this).rules("add", {
            isCurrent: true
        });
    });

    //Validate past date
    jQuery.validator.addMethod("inPast", function (value, element) {
        var now = (new Date());
        var date = (jvdate.todate($(element).val()));
        if (((date == now) && ($(element).attr('data-current-date') != undefined)) || (date < now)) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a valid past date.");
    $("input[data-past-date]").each(function () {
        $(this).rules("add", {
            inPast: true
        });
    });

    //Validate future date
    jQuery.validator.addMethod("inFuture", function (value, element) {
        var now = (new Date());
        var date = (jvdate.todate($(element).val()));
        if (((date == now) && ($(element).attr('data-current-date') != undefined)) || (date > now)) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a valid future date.");
    $("input[data-future-date]").each(function () {
        $(this).rules("add", {
            inFuture: true
        });
    });

    //Validate past/future date when changed
    $('body').on('change keyup', 'input[data-future-date]', function () {
        if (jvdate.todate($(this).val()) != "Invalid Date") {
            $(this).valid();
        }
    });
    $('body').on('change keyup', 'input[data-end-date]', function () {
        if (jvdate.todate($(this).val()) != "Invalid Date") {
            $(this).valid();
        }
    });

    //Validate max date
    jQuery.validator.addMethod("beforeOrAtMax", function (value, element) {
        var _maxDate = "";
        if (jvdate.todate(element.getAttribute('data-max-date')) != "Invalid Date") {
            _maxDate = jvdate.todate(element.getAttribute('data-max-date'));
        } else {
            return true;
        }
        var date = jvdate.todate($(element).val());
        if (date <= _maxDate) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date on or before the maximum date.");
    $("input[data-max-date]").each(function () {
        $(this).rules("add", {
            beforeOrAtMax: true
        });
    });

    //Validate min date
    jQuery.validator.addMethod("afterOrAtMin", function (value, element) {
        var _minDate = "";
        if (jvdate.todate(element.getAttribute('data-min-date')) != "Invalid Date") {
            _minDate = jvdate.todate(element.getAttribute('data-min-date'));
        } else {
            return true;
        }
        var date = jvdate.todate($(element).val());
        if (date >= _minDate) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date on or after the minimum date.");
    $("input[data-min-date]").each(function () {
        $(this).rules("add", {
            afterOrAtMin: true
        });
    });
};