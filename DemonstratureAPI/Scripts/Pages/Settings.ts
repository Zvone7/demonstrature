//import {CellM, CourseDTO, MyUserDTO, MyUserM, TermM} from "../../content/utilities";

$(document).ready(() => {
    var _settingsVM = new SettingsVM();
    _settingsVM.getAllUsers();
    _settingsVM.getAllCourses();
});

class SettingsVM {
    //-------------------------------------observables---------------------------------//
    public UserData = ko.observable<MyUserM>(new MyUserM());
    //-------------------------------------primitive-----------------------------------//
    public Courses: CourseDTO[];
    public Users: MyUserDTO[];
    public UserCourse: CourseDTO;
    public CourseCourse: CourseDTO;

    constructor() {
        var self = this;
        console.log("constructor: settings");
        $(document).ready(function () {
            $('#course_study_select').on("change", () => {
                var value = $(this).val();
                self.populateSelectCourseName("#course_course_select",value);
            });
            $('#term_study_select').on("change", () => {
                var value = $(this).val();
                self.populateSelectCourseName("#term_course_select", value);
            });
            $('#selectCourse').on("change", () => {
                //self.updateValuesAfterSelect();
            });
            $('#user_user_select').on("change", () => {
                var value = $('#user_user_select').val();
                self.updateUserData(value);
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
            self.populateSelectStudy("#course_study_select");
            self.populateSelectStudy("#term_study_select");
        }
        function errorFunc() {
            alert('error');
        }
    }
    public getAllUsers = () => {
        //console.log("gettingAllUsers");
        var self = this;
        var serviceURL = '/Settings/UserData';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: MyUserDTO[], status) {
            self.Users = data;
            self.populateSelectUser();
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
        output.push('<option value="' + "Novi kolegij"+ '">' + "Novi kolegij" + '</option>');
        for (var i = 0; i < names.length; i++) {
            if (this.Courses[i].Name != "" && this.Courses[i].Name != null) {
                output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
            }
        }
        $(selectId).html(output.join(''));
    }
    public populateSelectUser = () => {
        var selectId = "#user_user_select";
        var users = this.Users;
        var output = [];
        $(selectId).find('option').remove().end();
        for (var i = 0; i < users.length; i++) {
            output.push('<option value="' + users[i].Username + '">' + users[i].FullName + '</option>');
        }
        $(selectId).html(output.join(''));
    }
    public updateUserData = (username: string)=>{
        if (this.Users != null) {
            for (var i = 0; i < this.Users.length; i++) {
                if (username == this.Users[i].Username) {
                    this.UserData().Id(this.Users[i].Id);
                    this.UserData().Username(this.Users[i].Username);
                    this.UserData().FullName(this.Users[i].FullName);
                    this.UserData().Role(this.Users[i].Role);
                    console.log(this.UserData());
                }
            }
        }
    }
    //-------------------------------CHOOSE FORM DATA END----------------------------------------------//
}


class MyUserM {
    public Id = ko.observable<number>(0);
    public Username = ko.observable<string>("");
    public FullName = ko.observable<string>("");
    public Role = ko.observable<string>("");
    constructor(myUser?: any) {
        if (myUser) {
            this.Id(myUser.Id);
            this.Username(myUser.Username);
            this.FullName(myUser.FullName);
            this.Role(myUser.Role);
        }
    }
}
class MyUserDTO {
    public Id: number;
    public Username: string;
    public FullName: string;
    public Role: string;
}
class TermM {
    public Id: number;
    public IdCollegeCourse: number;
    public Course: CourseM;
    public IdUser: number;
    public UserPerson: MyUserM;
    public IdGroup: number;
    public Group: GroupM;
    public TermDate: Date;
    constructor(myTerm?: TermM) {
        if (myTerm) {
            this.Id = myTerm.Id;
            this.IdCollegeCourse = myTerm.IdCollegeCourse;
            this.IdUser = myTerm.IdUser;
            this.UserPerson = myTerm.UserPerson;
            this.TermDate = myTerm.TermDate;
            this.Group = myTerm.Group;
        }
    }
}
class CellM {
    public x: number;
    public y: number;
    public TakeState = ko.observable<boolean>(false);
    public SkipState = ko.observable<boolean>(true);
    public TermDate = ko.observable<string>();
    public Group = ko.observable<GroupM>();
    public UserPerson = ko.observable<MyUserM>();
    constructor(c?: CellM) {
        if (c) {
            this.x = c.x;
            this.y = c.y;
            this.TakeState(c.TakeState());
            this.SkipState(c.SkipState());
            this.TermDate(c.TermDate());
            this.Group(c.Group());
            this.UserPerson(c.UserPerson());
        }
        else {
            this.UserPerson(new MyUserM());
        }
    }
}
class CourseDTO {
    public Id: number;
    public Name: string;
    public Study: string;
    public Leader: string;
    public Asistant: string;
    public TermT: TermM[][];
}
class CourseM {
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
    public Study = ko.observable<string>();
    public Leader = ko.observable<string>();
    public Asistant = ko.observable<string>();
    public TermT = ko.observable<TermM[][]>();
}
class GroupM {
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
    public UserPerson = ko.observable<MyUserM>();
}