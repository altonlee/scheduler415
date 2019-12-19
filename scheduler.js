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
    * settings options
    * html to image 
    * export to json
    * import from json
    * readd click & drag functionality :)
*/ 

var schedule;
var dp;
var weekday = {
    MO: "2019-12-16",
    TU: "2019-12-17",
    WE: "2019-12-18",
    TH: "2019-12-19",
    FR: "2019-12-20",
    SA: "2019-12-21",
    SU: "2019-12-15"
};

// EventListener for when document is fully loaded.
// Loads default courses and calendar settings. 
document.addEventListener("DOMContentLoaded", function() {
    $('#button-save').dropdown({
        on: 'hover'
      })
    ;
    schedule = [
    {
        id: DayPilot.guid(),
        color: "ff0000",
        courseName: "KOR 201",
        courseType: "lecture",
        instructor: "Bonni",
        location: "Moore 111",
        timeEnd: "10:30",
        timeStart: "11:20",
        weekdays: ["MO", "TU", "WE", "TH"]
    },
    {
        id: DayPilot.guid(),
        color: "00ff00",
        courseName: "Calc II",
        courseType: "lab",
        instructor: "John Doe",
        location: "Keller 215",
        timeEnd: "13:00",
        timeStart: "14:20",
        weekdays: ["FR"]
    }];
    
    // DayPilot Calendar settings
    dp = $("#dp").daypilotCalendar({
        theme: "semantic",
        viewType: "WorkWeek",
        headerDateFormat: "dddd",
        businessBeginsHour: 7,
        businessEndsHour: 19,
        dayBeginsHour: 7,
        dayEndsHour: 20,
        cellHeight: 20,
        heightSpec: "Parent100Pct",
        eventArrangement: "Full",
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: function (args) {
            console.log();
        },
        eventDeleteHandling: "Disabled",
        onEventDeleted: function (args) {
        this.message("Event deleted: " + args.e.text());
        },
        eventMoveHandling: "Disabled",
        onEventMoved: function (args) {
        this.message("Event moved: " + args.e.text());
        },
        eventResizeHandling: "Disabled",
        onEventResized: function (args) {
        this.message("Event resized: " + args.e.text());
        },
        eventClickHandling: "Enabled",
        eventHoverHandling: "Disabled",
        onEventClick: function(args) {
            clickCourse(args, "edit");
        },
    });
    
    dp.events.list = [
    {
        start: "2019-12-16T10:30:00",
        end: "2019-12-16T11:20:00",
        id: schedule[0].id,
        text: "KOR 201",
        barColor: "#ff0000"
    },
    {
        start: "2019-12-17T10:30:00",
        end: "2019-12-17T11:20:00",
        id: schedule[0].id,
        text: "KOR 201",
        barColor: "#ff0000"
    },
    {
        start: "2019-12-18T10:30:00",
        end: "2019-12-18T11:20:00",
        id: schedule[0].id,
        text: "KOR 201",
        barColor: "#ff0000"
    },
    {
        start: "2019-12-19T10:30:00",
        end: "2019-12-19T11:20:00",
        id: schedule[0].id,
        text: "KOR 201",
        barColor: "#ff0000"
    },
    {
        start: "2019-12-20T13:00:00",
        end: "2019-12-20T14:20:00",
        id: schedule[1].id,
        text: "Calc II",
        barColor: "#00ff00"
    }];
    dp.update();
});


// Add a Course object into schedule[], and adds Events
// into the calendar. 
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
        // Add course to schedule[]
        schedule.push(course);
        // Add events to calendar
        for (i = 0; i < days.length; i++) {
            var str = weekday[days[i]] + "T";
            
            var e = new DayPilot.Event({
                start: str + course.timeStart + ":00",
                end: str + course.timeEnd + ":00",
                id: course.id,
                text: course.courseName,
                barColor: course.color
            });
            dp.events.add(e);
        }
        
        // Reset form & close modal
        $('#add-course')[0].reset();
        toggle('#add-modal');
    }
}


// Edits a Course from schedule[] and its Events
// from the calendar.
// Does not take any parameters. 
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
        var index = schedule.findIndex(function (obj) {
            return obj.id === course["id"];
        });
        // Edit course from schedule[]
        schedule[index] = course;
        /* "Edit" events from calendar; explanation below:
           * due to DayPilot locking client-side event updating,
           * I will be removing the events first, then readding
           * them with the new course details
        */
        for (i = 0; i < dp.events.list.length; i++) {
            if (dp.events.list[i].id == course.id) {
                dp.events.remove(course.id);
                i--;
            }
        }
        for (i = 0; i < days.length; i++) {
            var str = weekday[days[i]] + "T";
            
            var e = new DayPilot.Event({
                start: str + course.timeStart + ":00",
                end: str + course.timeEnd + ":00",
                id: course.id,
                text: course.courseName,
                barColor: course.color
            });
            dp.events.add(e);
        }
        // Reset form & close modal
        $('#edit-course')[0].reset();
        toggle('#edit-modal');
    }
}


// Deletes a Course from schedule[] and its Events
// from the calendar.
// Does not take any parameters. 
function deleteCourse() {
    var alert = confirm("Are you sure you want to delete this course?");
    if (alert) {
        var id = document.getElementById("edit-id").value;
        var index = schedule.findIndex(function (obj) {
            return obj.id === id;
        });
        // Remove course from schedule[]
        schedule.splice(index, 1);
        // Remove events from calendar
        for (i = 0; i < dp.events.list.length; i++) {
            if (dp.events.list[i].id === id) {
                dp.events.remove(id);
                i--;
            }
        }
        // Reset form & close modal
        $('#edit-course')[0].reset();
        toggle('#edit-modal');
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
    } else if (mode === "del") {
        console.log("delete");
    }
}


// Removes all courses in schedule[].
// Does not take any parameters. 
function deleteSchedule() {
    if (schedule.length > 0) {
        // remove course from schedule[]
        while (schedule.length > 0) {
            schedule.pop();
        }
        // remove events from calendar
        while (dp.events.list.length > 0) {
            var id = dp.events.list[0].id;
            dp.events.remove(id);
        }
    } else {
        alert("Your schedule is currently empty!");
    }
    toggle('#clear-confirm');
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

// Processes the user's settings.
// Does not take any parameters. 
function saveSettings() {
    var form = $("#settings-form").serializeArray();
    
    // Check form results
    for (i = 0; i < form.length; i++) {
        var name = form[i].name.replace('set-', "");
        if (name === "dayBeginsHour" || name === "dayEndsHour") {
            dp[name] = form[i].value.split(":")[0];
        } else 
            dp[name] = form[i].value;
    }
    if (document.getElementById("set-viewType").checked) {
        dp.viewType = "Week";
    } else {
        dp.viewType = "WorkWeek";
    }
    
    dp.update();
    toggle("#settings-modal");
}


// save as image
// uses tsayen's dom-to-image framework
function save() {
    domtoimage.toBlob(document.getElementById('dp'))
        .then(function (blob) {
            let url = window.URL;
            let a = document.createElement("a");
            a.href = url.createObjectURL(blob);
            a.download = "schedule.png";
            document.body.appendChild(a);
            a.click();
            document.body.appendChild(a);
        });
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