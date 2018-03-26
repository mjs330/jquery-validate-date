# jquery.validate.date
jquery.validate.date is a lightweight library that uses HTML5 data attributes to:
 * Validate a start date and an end date in a set of two dates
 * Validate that a date adheres to a minimum or maximum date
 
--

#### Dependencies:
* [jQuery](https://jquery.com/)
* [jQuery Validation Plugin](https://jqueryvalidation.org/)

--

#### Setup:
The date validators are not automatically bound by default. After the jQuery Validation plugin is initialized by any means, you can bind the date validators by using the following. You can also use this on the fly to rebind the validators for things such as dynamically cloned elements.
```javascript
jvdate.bind();
```

--

#### Options:
Set the format of the dates you'd like to verify like this.
```javascript
jvdate.format("MM/DD/YYYY");
```
The format() method accepts: "M" or "MM/DD/YYYY "for middle-endian dates, "L" or "DD/MM/YYYY" for little-endian dates, and "B" or "YYYY/MM/DD" for big-endian dates. "M" is the default.

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

<!--Validate that a date is at or after a minimum date-->
<!--Use the value in data-min-date to set the minimum date-->
<input id="After_Or_At_Min_Date" data-min-date="01/01/2000">

<!--Validate that a date is at or before a maximum date-->
<!--Use the value in data-max-date to set the maximum date-->
<input id="Before_Or_At_Max_Date" data-max-date="01/01/2025">
```
