define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class KoTerm {
        constructor() {
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
    }
    exports.KoTerm = KoTerm;
    class RawTerm {
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
        constructor() {
            this.TermDate = new Date();
        }
    }
    exports.RawTerm = RawTerm;
    class KoCell {
        constructor() {
            this.x = ko.observable();
            this.y = ko.observable();
            this.CellState = ko.observable();
            this.ButtonTakeState = ko.observable();
            this.ButtonSkipState = ko.observable();
            this.DemoPickerState = ko.observable();
            this.Term = ko.observable();
        }
    }
    exports.KoCell = KoCell;
    class KoUser {
        constructor(myUser, name) {
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
    }
    exports.KoUser = KoUser;
    class KoStudy {
        constructor() {
            this.Name = ko.observable();
        }
    }
    exports.KoStudy = KoStudy;
    class KoCourse {
        constructor() {
            this.Name = ko.observable();
            this.Study = ko.observable();
        }
    }
    exports.KoCourse = KoCourse;
    class KoGroup {
        constructor() {
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
    }
    exports.KoGroup = KoGroup;
    class KoDemonstrator {
        constructor(name, id) {
            this.Name = ko.observable();
            if (name && id) {
                this.Id = id;
                this.Name(name);
            }
        }
    }
    exports.KoDemonstrator = KoDemonstrator;
    class TermPackage {
        constructor() {
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
    }
    exports.TermPackage = TermPackage;
    class KoTestClass {
        constructor() {
            this.name = "test name";
            this.age = 7;
        }
    }
    exports.KoTestClass = KoTestClass;
});
//# sourceMappingURL=DemonstratureCustomClasses.js.map