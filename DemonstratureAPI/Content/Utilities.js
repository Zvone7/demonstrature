define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyUserM {
        constructor(myUser) {
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
    }
    exports.MyUserM = MyUserM;
    class MyUserDTO {
    }
    exports.MyUserDTO = MyUserDTO;
    class TermM {
        constructor(myTerm) {
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
    exports.TermM = TermM;
    class CellM {
        constructor(c) {
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
    }
    exports.CellM = CellM;
    class CourseDTO {
    }
    exports.CourseDTO = CourseDTO;
    class CourseM {
        constructor() {
            this.Id = ko.observable();
            this.Name = ko.observable();
            this.Study = ko.observable();
            this.Leader = ko.observable();
            this.Asistant = ko.observable();
            this.TermT = ko.observable();
        }
    }
    exports.CourseM = CourseM;
    class GroupM {
        constructor() {
            this.Id = ko.observable();
            this.Name = ko.observable();
            this.UserPerson = ko.observable();
        }
    }
    exports.GroupM = GroupM;
});
//# sourceMappingURL=Utilities.js.map