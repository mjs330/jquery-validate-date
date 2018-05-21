//
// jquery.validate.date
// https://github.com/mjs330
//
// Dependencies:
// jQuery - https://jquery.com/
// jQuery Validation Plugin - https://jqueryvalidation.org/
//




// jvdate object
var jvdate = {
    dateformat: "M",
    onchange: true
};

jvdate.format = function (format) {
    if (format == null || format == "") {
        return;
    } else if (format == "M" || format == "L" || format == "B") {
        jvdate.dateformat = format;
    } else if (format.indexOf("MM") > -1 && format.indexOf("DD") > -1 && format.indexOf("YYYY") > -1
        && (format.indexOf("/") > -1 || format.indexOf("-") > -1 || format.indexOf("*") > -1)) {
        var dateSplitter = jvdate.findsplitter(format);
        switch (format) {
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

jvdate.setonchange = function (toggle) {
    if (toggle != true && toggle != false) {
        return;
    } else {
        onchange = toggle;
        jvdate.bind;
    }
}

jvdate.todate = function (dateStr) {
    var dateSplitter = jvdate.findsplitter(dateStr);
    if (dateSplitter == "") {
        return "Invalid Date";
    }
    var parts = dateStr.split(dateSplitter);
    if (jvdate.dateformat = "M") {
        return (new Date(parts[2], parts[0] - 1, parts[1])).setHours(0, 0, 0, 0);
    } else if (jvdate.dateformat = "L") {
        return (new Date(parts[2], parts[1] - 1, parts[0])).setHours(0, 0, 0, 0);
    } else if (jvdate.dateformat = "B") {
        return (new Date(parts[0], parts[1] - 1, parts[2])).setHours(0, 0, 0, 0);
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

jvdate.rebind = function () {
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
                    if ($(this).data('end-date') == linker) {
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
                if ($(this).data('start-date') == linker) {
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
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                ranged: true
            });
        }

    });
    $("input[data-end-date]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                ranged: true
            });
        }
    });

    //Validate date range max length
    jQuery.validator.addMethod("rangemax", function (value, element) {
        var dateEnd = jvdate.todate(value);
        var dateStart = dateEnd;
        var linked = null;
        //Get range
        var range = element.getAttribute('data-max-date-range');
        //Check for end date attr
        var linker = element.getAttribute('data-end-date');
        if (linker == null) {
            //Check for start date attr
            linker = element.getAttribute('data-start-date');
            if (linker == null) {
                return true;
            } else {
                //Handle start date attr
                var flag = false;
                $('input[data-end-date]').each(function () {
                    if ($(this).data('end-date') == linker) {
                        dateEnd = jvdate.todate($(this).val());
                        linked = this;
                        if (linked.getAttribute('data-max-date-range') != range && linked.getAttribute('data-max-date-range') != null)
                            flag = true;
                    }
                });
                if (flag || isNaN(parseInt(range))) {
                    return true;
                } else if (Math.round(Math.abs((dateStart - dateEnd) / (24 * 60 * 60 * 1000))) > parseInt(range)) {
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
            var flag = false;
            $('input[data-start-date]').each(function () {
                if ($(this).data('start-date') == linker) {
                    dateStart = jvdate.todate($(this).val());
                    linked = this;
                    if (linked.getAttribute('data-max-date-range') != range && linked.getAttribute('data-max-date-range') != null)
                        flag = true;
                }
            });
            if (flag || isNaN(parseInt(range))) {
                return true;
            } else if (Math.round(Math.abs((dateStart - dateEnd) / (24 * 60 * 60 * 1000))) > parseInt(range)) {
                return false;
            } else {
                if ($(linked).hasClass('error')) {
                    $(linked).removeClass('error')
                }
                return true;
            }
        }
    }, "Please enter a date range less than the maximum.");
    $("input[data-max-date-range]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                rangemax: true
            });
        }
    });


    //Validate date range min length
    jQuery.validator.addMethod("rangemin", function (value, element) {
        var dateEnd = jvdate.todate(value);
        var dateStart = dateEnd;
        var linked = null;
        //Get range
        var range = element.getAttribute('data-min-date-range');
        //Check for end date attr
        var linker = element.getAttribute('data-end-date');
        if (linker == null) {
            //Check for start date attr
            linker = element.getAttribute('data-start-date');
            if (linker == null) {
                return true;
            } else {
                //Handle start date attr
                var flag = false;
                $('input[data-end-date]').each(function () {
                    if ($(this).data('end-date') == linker) {
                        dateEnd = jvdate.todate($(this).val());
                        linked = this;
                        if (linked.getAttribute('data-min-date-range') != range && linked.getAttribute('data-min-date-range') != null)
                            flag = true;
                    }
                });
                if (flag || isNaN(parseInt(range))) {
                    return true;
                } else if (Math.round(Math.abs((dateStart - dateEnd) / (24 * 60 * 60 * 1000))) < parseInt(range)) {
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
            var flag = false;
            $('input[data-start-date]').each(function () {
                if ($(this).data('start-date') == linker) {
                    dateStart = jvdate.todate($(this).val());
                    linked = this;
                    if (linked.getAttribute('data-min-date-range') != range && linked.getAttribute('data-min-date-range') != null)
                        flag = true;
                }
            });
            if (flag || isNaN(parseInt(range))) {
                return true;
            } else if (Math.round(Math.abs((dateStart - dateEnd) / (24 * 60 * 60 * 1000))) < parseInt(range)) {
                return false;
            } else {
                if ($(linked).hasClass('error')) {
                    $(linked).removeClass('error')
                }
                return true;
            }
        }
    }, "Please enter a date range greater than the minimum.");
    $("input[data-min-date-range]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                rangemin: true
            });
        }
    });

    ////Validate current date
    //jQuery.validator.addMethod("isCurrent", function (value, element) {
    //    if (typeof ($(element).data('past-date')) != 'undefined' || typeof ($(element).data('future-date')) != 'undefined'
    //        || typeof ($(element).data('start-date')) != 'undefined' || typeof ($(element).data('end-date')) != 'undefined'
    //        || typeof ($(element).data('past-date')) != 'undefined' || typeof ($(element).data('future-date')) != 'undefined') {
    //        return true;
    //    } else {
    //        var date = (jvdate.todate(value));
    //        var now = (new Date()).setHours(0, 0, 0, 0);
    //        if (date == now) {
    //            return true;
    //        } else {
    //            console.log(date + ' ' + now);
    //            return false;
    //        }
    //    }

    //}, "Please enter a valid current date.");
    //$("input[data-current-date]").each(function () {
    //    console.log($(this));
    //    if (typeof $(this) != 'undefined') {
    //        $(this).rules("add", {
    //            isCurrent: true
    //        });
    //    }
    //});

    //Validate past date
    jQuery.validator.addMethod("inPast", function (value, element) {
        var now = (new Date()).setHours(0, 0, 0, 0);
        var date = (jvdate.todate(value));
        if (((date == now) && typeof ($(element).data('current-date')) != undefined) || (date < now)
            //|| typeof ($(element).data('start-date')) != 'undefined' || typeof ($(element).data('end-date')) != 'undefined'
            || typeof ($(element).data('future-date')) != 'undefined') {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date in the past.");
    $("input[data-past-date]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                inPast: true
            });
        }
    });

    //Validate future date
    jQuery.validator.addMethod("inFuture", function (value, element) {
        var now = (new Date()).setHours(0, 0, 0, 0);
        var date = (jvdate.todate(value));
        if (((date == now) && typeof ($(element).data('current-date')) != undefined) || (date > now)
        //|| typeof ($(element).data('start-date')) != 'undefined' || typeof ($(element).data('end-date')) != 'undefined'
        || typeof ($(element).data('past-date')) != 'undefined') {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date in the future.");
    $("input[data-future-date]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                inFuture: true
            });
        }
    });

    //Validate max date
    jQuery.validator.addMethod("beforeOrAtMax", function (value, element) {
        if (typeof ($(element).data('past-date')) != 'undefined' || typeof ($(element).data('future-date')) != 'undefined') {
            return true;
        }
        var _maxDate = "";
        if (jvdate.todate(element.getAttribute('data-max-date')) != "Invalid Date") {
            _maxDate = jvdate.todate(element.getAttribute('data-max-date'));
        } else {
            return true;
        }

        var date = jvdate.todate(value);
        if (date <= _maxDate) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date on or before the maximum date.");
    $("input[data-max-date]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                beforeOrAtMax: true
            });
        }
    });

    //Validate min date
    jQuery.validator.addMethod("afterOrAtMin", function (value, element) {
        if (typeof ($(element).data('past-date')) != 'undefined' || typeof ($(element).data('future-date')) != 'undefined') {
            return true;
        }
        var _minDate = "";
        if (jvdate.todate(element.getAttribute('data-min-date')) != "Invalid Date") {
            _minDate = jvdate.todate(element.getAttribute('data-min-date'));
        } else {
            return true;
        }

        var date = jvdate.todate(value);
        if (date >= _minDate) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a date on or after the minimum date.");
    $("input[data-min-date]").each(function () {
        if (typeof $(this) != 'undefined') {
            $(this).rules("add", {
                afterOrAtMin: true
            });
        }
    });


    //Validate on change
    if (jvdate.onchange == true) {
        //Validate past/future date when changed
        $('body').on('change keyup', 'input[data-future-date]', function () {
            if (jvdate.todate($(this).val()) != "Invalid Date") {
                $(this).valid();
            }
        });
        $('body').on('change keyup', 'input[data-past-date]', function () {
            if (jvdate.todate($(this).val()) != "Invalid Date") {
                $(this).valid();
            }
        });

        //Validate start/end date when date range is changed
        $('body').on('change keyup', 'input[data-start-date]', function () {
            var dateEnd = "Invalid Date";
            var linker = $(this).data('start-date');
            $('input[data-end-date]').each(function () {
                if ($(this).data('end-date') == linker) {
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
            var linker = $(this).data('end-date');
            $('input[data-start-date]').each(function () {
                if ($(this).data('start-date') == linker) {
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
    } else {
        $('body').on('change keyup', 'input[data-future-date]', function () {
        });
        $('body').on('change keyup', 'input[data-past-date]', function () {
        });
        $('body').on('change keyup', 'input[data-start-date]', function () {
        });
        $('body').on('change keyup', 'input[data-end-date]', function () {
        });
    }

};