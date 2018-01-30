"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KoTerm = (function () {
    function KoTerm() {
        this.Course = ko.observable();
        this.User = ko.observable();
        this.Group = ko.observable();
        this.TermDate = ko.observable();
        this.SuggestedUserId = ko.observable();
        this.SuggestedUser = ko.observable();
        this.CellState = ko.observable();
        this.ButtonTakeState = ko.observable();
        this.ButtonSkipState = ko.observable();
        this.DemoPickerState = ko.observable();
        this.x = ko.observable();
        this.y = ko.observable();
        //constructor(term?: any) {
        //    if (term) {
        //        this.Id = term.Id;
        //        this.CourseId = term.CourseId;
        //        this.Course = term.Course;
        //        this.UserId = term.Id;
        //        this.User = term.User;
        //        this.GroupId = term.GroupId;
        //        this.Group = term.Group;
        //        this.TermDate = term.TermDate;
        //    }
        //}
    }
    return KoTerm;
}());
exports.KoTerm = KoTerm;
var RawTerm = (function () {
    //constructor(term?: any) {
    //    if (term) {
    //        this.Id = term.Id;
    //        this.CourseId = term.CourseId;
    //        this.Course = term.Course;
    //        this.UserId = term.Id;
    //        this.User = term.User;
    //        this.GroupId = term.GroupId;
    //        this.Group = term.Group;
    //        this.TermDate = term.TermDate;
    //    }
    //}
    function RawTerm() {
        this.TermDate = new Date();
    }
    return RawTerm;
}());
exports.RawTerm = RawTerm;
var KoCell = (function () {
    function KoCell() {
        this.x = ko.observable();
        this.y = ko.observable();
        this.CellState = ko.observable();
        this.ButtonTakeState = ko.observable();
        this.ButtonSkipState = ko.observable();
        this.DemoPickerState = ko.observable();
        this.Term = ko.observable();
    }
    return KoCell;
}());
exports.KoCell = KoCell;
var KoUser = (function () {
    function KoUser(myUser, name) {
        this.Username = ko.observable();
        this.Name = ko.observable();
        this.LastName = ko.observable();
        this.Role = ko.observable();
        if (myUser) {
            this.Id = myUser.Id;
            this.Username = myUser.Username;
            this.Name = myUser.Name;
            this.LastName = myUser.LastName;
            this.Role = myUser.Role;
        }
        else if (name) {
            this.Name(name);
        }
        else {
            //this.Id = defaultId;
            //this.Name(defaultUserName);
            //this.Username(defaultUserUsername);
            //this.LastName(defaultUserLastName);
            //this.Role(defaultUserRole);
            this.Id = 0;
            this.Name("name");
            this.Username("username");
            this.LastName("lastname");
            this.Role("d");
        }
    }
    return KoUser;
}());
exports.KoUser = KoUser;
var KoStudy = (function () {
    function KoStudy() {
        this.Name = ko.observable();
    }
    return KoStudy;
}());
exports.KoStudy = KoStudy;
var KoCourse = (function () {
    function KoCourse() {
        this.Name = ko.observable();
        this.Study = ko.observable();
    }
    return KoCourse;
}());
exports.KoCourse = KoCourse;
var KoGroup = (function () {
    function KoGroup() {
        this.Name = ko.observable();
        this.Owner = ko.observable();
        //public OwnerId = ko.observable<number>();
        //constructor(group?: KoGroup) {
        //    if (group) {
        //        this.CourseId = group.CourseId;
        //        this.Id = group.Id;
        //        this.Name = group.Name;
        //        this.Owner = group.Owner;
        //        this.OwnerId = group.OwnerId;
        //    }
        //}
    }
    return KoGroup;
}());
exports.KoGroup = KoGroup;
var KoDemonstrator = (function () {
    function KoDemonstrator(name, id) {
        this.Name = ko.observable();
        if (name && id) {
            this.Id = id;
            this.Name(name);
        }
    }
    return KoDemonstrator;
}());
exports.KoDemonstrator = KoDemonstrator;
var TermPackage = (function () {
    function TermPackage() {
        this.row0 = Array();
        this.row1 = Array();
        this.row2 = Array();
        this.row3 = Array();
        this.row0 = [];
        this.row1 = [];
        this.row2 = [];
        this.row3 = [];
        this.disableLeft = false;
        this.disableRight = false;
        this.disableUp = false;
        this.disableDown = false;
    }
    return TermPackage;
}());
exports.TermPackage = TermPackage;
//# sourceMappingURL=CustomClasses.js.map