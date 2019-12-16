/* 
 * scheduler.js
 * 
 * Alton Lee
 *
 * 12/9/2019
 *
 * Script file for scheduler415. Contains functions needed
 * for the app to function. 
*/

var schedule;
var dp;

document.addEventListener("DOMContentLoaded", function() {
    schedule = [];
    
    // DayPilot Calendar settings
    dp = $("#dp").daypilotCalendar({
        viewType: "Week",
        headerDateFormat: "dddd",
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: function(args) {
            var name = prompt("New event name:", "Event");
            dp.clearSelection();
            if (!name) return;
            var e = new DayPilot.Event({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                resource: args.resource,
                text: name
            });
            dp.events.add(e);
        },
        eventDeleteHandling: "Update",
        onEventDeleted: function (args) {
            this.message("Event deleted: " + args.e.text());
        },
        eventMoveHandling: "Update",
        onEventMoved: function (args) {
            this.message("Event moved: " + args.e.text());
        },
        eventResizeHandling: "Update",
        onEventResized: function (args) {
            this.message("Event resized: " + args.e.text());
        },
        eventClickHandling: "Select",
        onEventEdited: function (args) {
            this.message("Event selected: " + args.e.text());
        },
        eventHoverHandling: "Disabled",
    });
});


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
        $('#add-course')[0].reset();
        toggle('#add-modal');        
    }
}


// Edits a specified course. 
// Does not take any parameters. 
function editCourse() {
    var selected = document.getElementById("edit-selection").value;
    var form = $("#edit-course").serializeArray();
    var course = [];
    var days = [];

    // Check form results
    for (i = 0; i < form.length; i++) {
        if (form[i].name === "edit-weekday") {
            days.push(form[i].value);
            course["weekdays"] = days;
        } else {
            var name = form[i].name.replace('edit-', "");
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
        schedule[selected].courseName = course.courseName;
        schedule[selected].color = course.color;
        schedule[selected].courseType = course.courseType;
        schedule[selected].instructor = course.instructor;
        schedule[selected].location = course.location;
        schedule[selected].timeStart = course.timeStart;
        schedule[selected].timeEnd = course.timeEnd;
        toggle('#edit-modal');
    }
    
}

// Removes course from schedule[]. 
// Does not take any parameters.
function deleteCourse() {
    var alert = confirm("Are you sure you want to delete this course?");
    if (alert) {
        var selected = document.getElementById("edit-selection").value;
        schedule.splice(selected, 1);
        $('#edit-course')[0].reset();
        toggle('#edit-modal');
    }
}


function deleteSchedule() {
    if (schedule.length > 0) {
        schedule = [];
        toggle('#clear-confirm');
    } else {
        alert("Schedule is already empty!");
        toggle('#clear-confirm');
    }
}

// Autofills 'Edit Course' form with the selected course's details.
// Does not take any parameters.
function autofill() {
    var selected = document.getElementById("edit-selection").value;
    
    if (selected === "none") {
        $("#edit-form")[0].style.display = "none";
    } else {
        $("#edit-form")[0].style.display = "block";
        var course = schedule[selected];
        
        $("#edit-courseName").val = course.courseName;
        $("#edit-color").val = course.color;
        $("#edit-courseType").val = course.courseType;
        $("#edit-instructor").val = course.instructor;
        $("#edit-location").val = course.location;
        $("#edit-timeStart").val = course.timeStart;
        $("#edit-timeEnd").val = course.timeEnd;
    }
}


// Populates the Dropdown list with the current user's courses stored in 
// schedule[].
// Does not take any parameters. 
function editInit() {
    // Make sure edit modal is always hiding form lol
    $("#edit-form")[0].style.display = "none";
    
    var select = document.getElementById("edit-selection");
    $("#edit-selection").empty();
    
    select.options[0] = new Option('- - -', 'none', true, true);
    
    for (var i = 0; i < schedule.length; i++) {
        select.options[select.options.length] = new Option(schedule[i].courseName, i, false, false);
    }
    toggle('#edit-modal');
}


// Toggles modals on and off.
// Takes one parameter, the name of the modal to toggle. 
function toggle(object) {
    $(object).modal('toggle');
}