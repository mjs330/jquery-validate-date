# jquery-validate-date

 * Validates a start date and an end date in a set of two dates
 * Validates that a date is in the past or future
 * Validates whether or not a date is the current date

--

#### Dependencies:
* [jQuery](https://jquery.com/)
* [jQuery Validation Plugin](https://jqueryvalidation.org/)

--

#### Options:
* Change the dateFormat variable in jquery-validate-date.js to set the format of the dates you'd like validated
* The dateFormat variable accepts: "M" for middle-endian date MM/DD/YYYY, "L" for little-endian date DD/MM/YYYY, "B" for big-endian date YYYY/MM/DD

--

#### Example uses:
```html
<input id="Start_Date" data-start-date="123">
<input id="End_Date" data-end-date="123">
<input id="Future_Date" data-future-date>
<input id="Past_Date" data-past-date>
<input id="Current_Date" data-current-date>
```

--

#### Example combination uses:
```html
<input id="Current_Or_Past_Date" data-current-date data-past-date>
<input id="Current_Or_Future_Start_Date" data-current-date data-future-date data-start-date="456">
<input id="Future_End_Date" data-future-date data-start-date="456">
```