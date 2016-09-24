import {CellM, CourseDTO, MyUserDTO, MyUserM, TermM} from "../../content/utilities";

$(document).ready(() => {
    var _settingsVM = new SettingsVM();
    _settingsVM.getAllCourses();
});

class SettingsVM {
    //-------------------------------------primitive-----------------------------------//
    public Courses: CourseDTO[];
    public UserCourse: CourseDTO;
    public CourseCourse: CourseDTO;

    constructor() {
        var self = this;
        console.log("constructor: settings");
        $(document).ready(function () {
            $('#course_study_select').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName("#course_course_select",value);
            });
            $('#term_study_select').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName("#term_course_select", value);
            });
            $('#selectCourse').on("change", function () {
                //self.updateValuesAfterSelect();
            });
        });
    }
    //-------------------------------COURSES START-------------------------------------------//
    public getAllCourses = () => {
        //console.log("gettingAllCourses");
        var self = this;
        var serviceURL = '/Table/AllCollegeCourses';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: CourseDTO[], status) {
            self.Courses = data;
            console.log(self.Courses);
            self.populateSelectStudy("#course_study_select");
            self.populateSelectStudy("#term_study_select");
        }
        function errorFunc() {
            alert('error');
        }
    }
    //-------------------------------COURSES END---------------------------------------------//
    //-------------------------------CHOOSE FORM DATA START--------------------------------------------//
    public populateSelectStudy = (selectId:string) => {
        var studies = [];
        var output = [];
        for (var i = 0; i < this.Courses.length; i++) {
            var x = this.Courses[i].Study;
            var alreadyExists = false;
            if (studies.length > 0) {
                for (var j = 0; j < studies.length; j++) {
                    if (studies[j] == x) {
                        alreadyExists = true;
                    }
                }
            }
            if (!alreadyExists) {
                studies.push(x);
            }
        }
        $(selectId).find('option').remove().end();
        for (var i = 0; i < studies.length; i++) {
            output.push('<option value="' + studies[i] + '">' + studies[i] + '</option>');
        }
        $(selectId).html(output.join(''));
        var selectStudyValue = $(selectId).val();
        this.populateSelectCourseName("#course_course_select",selectStudyValue);
        this.populateSelectCourseName("#term_course_select", selectStudyValue);
    }
    public populateSelectCourseName = (selectId:string, studyName: string) => {
        var output = [];
        var names = [];
        for (var i = 0; i < this.Courses.length; i++) {
            var study = this.Courses[i].Study;
            var course = this.Courses[i].Name;
            if (study != studyName) {
                continue;
            }
            var alreadyExists = false;
            if (names.length > 0) {
                for (var j = 0; j < names.length; j++) {
                    if (names[j] == course) {
                        alreadyExists = true;
                    }
                }
            }
            if (!alreadyExists) {
                names.push(course);
            }
        }
        $(selectId).find('option').remove().end();
        for (var i = 0; i < names.length; i++) {
            if (this.Courses[i].Name != "" && this.Courses[i].Name != null) {
                output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
            }
        }
        $(selectId).html(output.join(''));
    }
    //-------------------------------CHOOSE FORM DATA END----------------------------------------------//


}