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

document.addEventListener("DOMContentLoaded", function() {
});

// Array of user's Courses
var schedule = [];
var course = {
    id: "01",
    className: "ICS 415"
}
schedule.push(course);
console.log(schedule);

// Toggles Add modal on and off
function toggle(object) {
    $(object).modal('toggle');
}

// Adds or removes meeting times from a course

// Creates a Course object to be pushed into object schedule. 
// Takes parameters to be filled in. 
function addToScheduler() {
    var course = {
        id: "",
        courseName: "",
        meets {
            id: "",
            days {
                mo: false,
                tu: false,
                we: false,
                th: false,
                fr: false,
                sa: false,
                su: false
            }
            startHour: 10,
            startMin: 30,
            endHour: 11,
            endMin: 20,
            courseType: "",
            instructor: "",
            location: ""
        }
    }
}