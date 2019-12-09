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
        if (form[i].name === "add-weekday") {
            days.push(form[i].value);
            course["weekdays"] = days;
        } else {
            var name = form[i].name.replace('add-', "");
            course[name] = form[i].value;
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


// Grabs form data and edits Course's values.
// Does not take any parameters. 
function editCourse() {
    console.log("saved!");
    toggle('#edit-modal');
}

// Pops course from schedule[]. 
// Does not take any parameters.
function deleteCourse() {
    console.log("delete!");
    toggle('#edit-modal');
}

// Autofills Edit Course form with the selected course's details.
// Does not take any parameters.
function autofill() {
    var selected = document.getElementById("edit-selection").value;
    
    if (selected === "none") {
        document.getElementById("edit-course").style.display = "none";
    } else {
        var course = schedule[selected];
        document.getElementById("edit-course").style.display = "block";
        
        document.getElementById("edit-courseName").value = course.courseName;
        document.getElementById("edit-color").value = course.color;
        document.getElementById("edit-courseType").value = course.courseType;
        document.getElementById("edit-instructor").value = course.instructor;
        document.getElementById("edit-location").value = course.location;
        document.getElementById("edit-timeStart").value = course.timeStart;
        document.getElementById("edit-timeEnd").value = course.timeEnd;
    }
}


// Populates the Dropdown list with the current user's courses stored in 
// schedule[].
// Does not take any parameters. 
function editSelection() {
    var select = document.getElementById("edit-selection");
    select.options[0] = new Option('- - -', 'none', true, true);
    
    for (var i = 0; i < schedule.length; i++) {
        select.options[select.options.length] = new Option(schedule[i].courseName, i, false, false);
    }
}


// Toggles modals on and off.
// Takes one parameter, the name of the modal to toggle. 
function toggle(object) {
    $(object).modal('toggle');
}