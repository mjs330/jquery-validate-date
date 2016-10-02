# jquery-validate-date
jquery-validate-date is a lightweight library that:
 * Validates a start date and an end date in a set of two dates
 * Validates that a date is in the past or future
 * Validates whether or not a date is the current date
 * Validates that a date adheres to a minimum or maximum date
 
--

#### Dependencies:
* [jQuery](https://jquery.com/)
* [jQuery Validation Plugin](https://jqueryvalidation.org/)

--

#### Options:
Set the format of the dates you'd like to verify like this:
```javascript
var myJvdate = new jvdate();
myJvdate.format("MM/DD/YYYY")
```
The format() method accepts: "M" or "MM/DD/YYYY "for middle-endian dates, "L" or "DD/MM/YYYY" for little-endian dates, and "B" or "YYYY/MM/DD" for big-endian dates.

The date splitter used in both the format() method and in the dates being verified can be /, -, or \*. For example, "MM\*DD\*YYYY" is an acceptable format() and "01\*02\*2000" is an acceptable date.

--

#### Example uses:
```html
<!--Validate a date range-->
<!--Use the same value in data-start-date and data-end-date to link the inputs-->
<input id="Start_Date" data-start-date="123">
<input id="End_Date" data-end-date="123">

<!--Validate that a date is in the future-->
<input id="Future_Date" data-future-date>

<!--Validate that a date is in the past-->
<input id="Past_Date" data-past-date>

<!--Validate that a date is the current date-->
<input id="Current_Date" data-current-date>


<!--Validate that a date is at or after a minimum date-->
<!--Use the value in data-min-date to set the minimum date-->
<input id="After_Or_At_Min_Date" data-min-date="01/01/2000">

<!--Validate that a date is at or before a maximum date-->
<!--Use the value in data-max-date to set the maximum date-->
<input id="Before_Or_At_Max_Date" data-max-date="01/01/2025">
```

--

#### Example combination uses:
```html
<!--Validate that a date is either the current date or in the past-->
<input id="Current_Or_Past_Date" data-current-date data-past-date>

<!--Validate that a start date in a date range is either the current date or in the future-->
<!--Validate that the end date in the same date range is in the future-->
<input id="Current_Or_Future_Start_Date" data-current-date data-future-date data-start-date="456">
<input id="Future_End_Date" data-future-date data-start-date="456">
```