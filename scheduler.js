/* 
 * scheduler.js
 * 
 * Alton Lee
 *
 * 12/9/2019
 *
 * JQuery file for scheduler415. Contains functions needed
 * for the app to function. 
*/

/*document.addEventListener("DOMContentLoaded", function() {
});*/

// Array of user's Courses
var schedule = [];


// Creates a Course object to be pushed into object schedule. 
// Does not take any parameters.
function addCourse() {
    var form = $("#add-course").serializeArray();
    var course = [];
    var days = [];

    // Check form results
    for (i = 0; i < form.length; i++) {
        if (form[i].name === "weekday") {
            days.push(form[i].value);
            course["weekdays"] = days;
        } else {
            course[form[i].name] = form[i].value;
        }
    }

    // Check required inputs
    if (course['courseName'] === "") {
        alert("Course must have a title.");
    } else if (days.length <= 0) {
        alert("At least one day must be selected.");
    } else if (course['timeStart'] === "") {
        alert("Course is missing a start time.");
    } else if (course['timeEnd'] === "") {
        alert("Course is missing an end time.");
    } else {
        // Push into schedule
        schedule.push(course);
        document.getElementById('add-course').reset();
        console.log(schedule);
        toggle('#add-modal');        
    }
}


// Toggles modals on and off.
// Takes one parameter, the name of the modal to toggle. 
function toggle(object) {
    $(object).modal('toggle');
}