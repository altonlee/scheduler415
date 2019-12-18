/* 
 * scheduler.js
 * 
 * Alton Lee
 *
 * 12/18/2019
 *
 * Script file for scheduler415. Contains functions needed
 * for the app to function. 
*/

/** TODO:
    * add Semantic theme to daypilotCalendar
    * link functions to calendar
    * html to image 
    * export to json
    * import from json
*/ 

var schedule;
var dp;

document.addEventListener("DOMContentLoaded", function() {
    schedule = [/*
    {
        id: DayPilot.guid(),
        color: "00f",
        courseName: "MATH 241",
        courseType: "lecture",
        instructor: "John Doe",
        location: "Keller 204",
        timeEnd: "13:30",
        timeStart: "14:20",
        weekdays: ["MO", "WE", "FR"]
    },
    {
        id: DayPilot.guid(),
        color: "0f0",
        courseName: "KOR 102",
        courseType: "lecture",
        instructor: "Bonni",
        location: "Moore 102",
        timeEnd: "10:30",
        timeStart: "11:20",
        weekdays: ["MO", "TU", "WE", "TH"]
    }*/
    ];
    
    // DayPilot Calendar settings
    dp = $("#dp").daypilotCalendar({
        viewType: "Week",
        headerDateFormat: "dddd",
        onEventClick: function(args) {
            clickCourse(args, "edit");
        },
    });
    
    console.log(dp.events);
});

// Add a Course object into schedule[].
// Does not take any parameters.
function addCourse() {
    var form = $("#add-course").serializeArray();
    var course = [];
    var days = [];
    
    // Push form results into obj
    for (i = 0; i < form.length; i++) {
        if (form[i].name === "add-weekday") {
            days.push(form[i].value);
            course["weekdays"] = days;
        } else {
            var name = form[i].name.replace('add-', '');
            course[name] = form[i].value;
        }
        course["id"] = DayPilot.guid();
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
        schedule.push(course);
        console.log(schedule);
        $('#add-course')[0].reset();
        toggle('#add-modal');
        
        var e = new DayPilot.Event({
            start: "2019-12-18T" + course.timeStart + ":00",
            end: "2019-12-18T" + course.timeEnd + ":00",
            id: course.id,
            text: course.courseName,
        });
        dp.events.add(e);
    }
}

function editCourse() {
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
        console.log(course);
        var index = schedule.findIndex(function (obj) {
            return obj.id === course["id"];
        });
        schedule[index] = course;
        $('#edit-course')[0].reset();
        toggle('#edit-modal');
        dp.events.update(index);
    }
}

function deleteCourse() {
    var alert = confirm("Are you sure you want to delete this course?");
    if (alert) {
        var index = schedule.findIndex(function (obj) {
            return obj.id === $("#edit-course")["id"];
        });
        schedule.splice(index, 1);
        $('#edit-course')[0].reset();
        toggle('#edit-modal');
        dp.events.delete(index);
    }
}

// Handles Event click behavior.
// Takes two parameters, Event arguments and mode function. 
function clickCourse(args, mode) {
    if (mode === "add") {
        console.log("add!");
    } else if (mode === "edit") {
        var course = schedule.find(function (obj) {
            return obj.id === args.e.id();
        });
        editInit(course);
    }
}


// Initializes the Edit modal by populating the dropdown list with the
// current user's courses stored in schedule[].
// Takes one parameter, a Course object.
function editInit(argv) {
    var select = document.getElementById("edit-selection");
    $("#edit-selection").empty();
    
    select.options[0] = new Option('- - -', 'none', true, true);
    for (var i = 0; i < schedule.length; i++) {
        select.options[select.options.length] = new Option(schedule[i].courseName, i, false, false);
    }
    
    if (argv != null) {
        $("#edit-form")[0].style.display = "block";
        autofill(argv);
    } else {
        $("#edit-form")[0].style.display = "none";
    }
    toggle('#edit-modal');
}


// Autofills the Edit modal form with a selected Course.
// Takes one parameter, a Course to edit.
function autofill(argv) {
    if (argv != null) {
        $("#edit-form")[0].style.display = "block";
        var course = argv;
        
        $("#edit-id").val(course.id);
        $("#edit-courseName").val(course.courseName);
        $("#edit-color").val(course.color);
        $("#edit-courseType").val(course.courseType);
        $("#edit-instructor").val(course.instructor);
        $("#edit-location").val(course.location);
        $("#edit-timeStart").val(course.timeStart);
        $("#edit-timeEnd").val(course.timeEnd);
    } else {
        var selected = document.getElementById("edit-selection").value;
        
        if (selected === "none") {
            $("#edit-form")[0].style.display = "none";
        } else {
            $("#edit-form")[0].style.display = "block";
            var course = schedule[selected];
            
            $("#edit-id").val(course.id);
            $("#edit-courseName").val(course.courseName);
            $("#edit-color").val(course.color);
            $("#edit-courseType").val(course.courseType);
            $("#edit-instructor").val(course.instructor);
            $("#edit-location").val(course.location);
            $("#edit-timeStart").val(course.timeStart);
            $("#edit-timeEnd").val(course.timeEnd);
        }
    }
}

// Toggles modals on and off.
// Takes one parameter, the name of the modal to toggle. 
function toggle(object) {
    $(object).modal('toggle');
}