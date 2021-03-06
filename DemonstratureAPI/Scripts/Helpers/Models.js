const defaultTextButtonSkip = "Otkaži termin";
const defaultTextButtonTake = "Uzmi termin";
const defaultCourseName = "Kolegij";
const defaultDate = new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear() + ".";
const defaultGroupName = "Grupa";
const defaultId = 0;
const defaultStudyName = "Smjer";
const defaultUserLastName = "-";
const defaultUserName = "-";
const defaultUserRole = "Demonstrator";
const defaultUserUsername = "...";
class KoCourse {
    constructor(course) {
        this.Name = ko.observable();
        this.Study = ko.observable();
        this.Professor = ko.observable();
        this.Asistant = ko.observable();
        if (course) {
            this.Id = course.Id;
            this.Name(course.Name);
            this.Study(course.Study);
            this.Professor(course.Professor);
            this.Asistant(course.Asistant);
        }
    }
}
class KoUser {
    constructor(myUser, name) {
        this.Username = ko.observable();
        this.Name = ko.observable();
        this.LastName = ko.observable();
        this.Role = ko.observable();
        this.Password = ko.observable();
        this.Courses = [];
        if (myUser) {
            this.Id = myUser.Id;
            this.Username = myUser.Username;
            this.Name = myUser.Name;
            this.LastName = myUser.LastName;
            this.Role = myUser.Role;
            this.Password("");
            this.Courses = myUser.Courses;
        }
        else if (name) {
            this.Name(name);
        }
        else {
            this.Id = defaultId;
            this.Name(defaultUserName);
            this.Username(defaultUserUsername);
            this.LastName(defaultUserLastName);
            this.Role(defaultUserRole);
            this.Password("");
            this.Courses = [];
        }
    }
}
class KoTerm {
    constructor(term) {
        this.Course = ko.observable();
        this.User = ko.observable();
        this.Group = ko.observable();
        this.TermDate = ko.observable("");
        this.SuggestedUserId = ko.observable();
        this.SuggestedUser = ko.observable();
        this.CellState = ko.observable();
        this.ButtonTakeState = ko.observable();
        this.ButtonSkipState = ko.observable();
        this.DemoPickerState = ko.observable();
        this.x = ko.observable();
        this.y = ko.observable();
        this.IsCourseTerm = ko.observable();
        if (term) {
            this.Id = term.Id;
            this.CourseId = term.CourseId;
            this.Course = term.Course;
            this.UserId = term.Id;
            this.User = term.User;
            this.GroupId = term.GroupId;
            this.Group = term.Group;
            this.TermDate = term.TermDate;
            this.IsCourseTerm = term.IsCourseTerm;
        }
    }
}
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
class KoStudy {
    constructor() {
        this.Name = ko.observable();
    }
}
class KoGroup {
    constructor(group) {
        this.Name = ko.observable();
        this.Owner = ko.observable();
        if (group) {
            this.Id = group.Id;
            this.CourseId = group.CourseId;
            this.Name(group.Name);
            this.Owner(group.Owner);
            this.OwnerId = group.OwnerId;
        }
    }
}
class KoDemonstrator {
    constructor(name, id) {
        this.Name = ko.observable();
        if (name && id) {
            this.Id = id;
            this.Name(name);
        }
    }
}
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
class PasswordUpdater {
}
//# sourceMappingURL=Models.js.map