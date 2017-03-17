"use strict";
var MyUserM = (function () {
    function MyUserM(myUser) {
        this.Id = ko.observable(0);
        this.Username = ko.observable("");
        this.FullName = ko.observable("");
        this.Role = ko.observable("");
        if (myUser) {
            this.Id(myUser.Id);
            this.Username(myUser.Username);
            this.FullName(myUser.FullName);
            this.Role(myUser.Role);
        }
    }
    return MyUserM;
}());
exports.MyUserM = MyUserM;
var MyUserDTO = (function () {
    function MyUserDTO() {
    }
    return MyUserDTO;
}());
exports.MyUserDTO = MyUserDTO;
var TermM = (function () {
    function TermM(myTerm) {
        if (myTerm) {
            this.Id = myTerm.Id;
            this.IdCollegeCourse = myTerm.IdCollegeCourse;
            this.IdUser = myTerm.IdUser;
            this.UserPerson = myTerm.UserPerson;
            this.TermDate = myTerm.TermDate;
            this.Group = myTerm.Group;
        }
    }
    return TermM;
}());
exports.TermM = TermM;
var CellM = (function () {
    function CellM(c) {
        this.TakeState = ko.observable(false);
        this.SkipState = ko.observable(true);
        this.TermDate = ko.observable();
        this.Group = ko.observable();
        this.UserPerson = ko.observable();
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
    return CellM;
}());
exports.CellM = CellM;
var CourseDTO = (function () {
    function CourseDTO() {
    }
    return CourseDTO;
}());
exports.CourseDTO = CourseDTO;
var CourseM = (function () {
    function CourseM() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Study = ko.observable();
        this.Leader = ko.observable();
        this.Asistant = ko.observable();
        this.TermT = ko.observable();
    }
    return CourseM;
}());
exports.CourseM = CourseM;
var GroupM = (function () {
    function GroupM() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.UserPerson = ko.observable();
    }
    return GroupM;
}());
exports.GroupM = GroupM;
//# sourceMappingURL=Utilities.js.map