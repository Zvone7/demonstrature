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
    public Id: number;
    public Name = ko.observable<string>();
    public Study = ko.observable<string>();
    public Professor = ko.observable<string>();
    public Asistant = ko.observable<string>();
    constructor(course?: any) {
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
    public Id: number;
    public Username = ko.observable<string>();
    public Name = ko.observable<string>();
    public LastName = ko.observable<string>();
    public Role = ko.observable<string>();
    public Password = ko.observable<string>();
    public Courses: KoCourse[] = [];
    constructor(myUser?: KoUser, name?: string) {
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
    public Id: number;
    public CourseId: number;
    public Course = ko.observable<KoCourse>();
    public UserId: number;
    public User = ko.observable<KoUser>();
    public GroupId: number;
    public Group = ko.observable<KoGroup>();
    public TermDate = ko.observable<string>("");
    public SuggestedUserId = ko.observable<number>();
    public SuggestedUser = ko.observable<KoUser>();
    public CellState = ko.observable<number>();
    public ButtonTakeState = ko.observable<boolean>();
    public ButtonSkipState = ko.observable<boolean>();
    public DemoPickerState = ko.observable<boolean>();
    public x = ko.observable<number>();
    public y = ko.observable<number>();
    public IsCourseTerm = ko.observable<boolean>();
    constructor(term?: any) {
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
    public Id: number;
    public CourseId: number;
    public UserId: number;
    public GroupId: number;
    public TermDate: Date;
    public CellState: number;
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
    public x = ko.observable<number>();
    public y = ko.observable<number>();
    public CellState = ko.observable<number>();
    public ButtonTakeState = ko.observable<boolean>();
    public ButtonSkipState = ko.observable<boolean>();
    public DemoPickerState = ko.observable<boolean>();
    public Term = ko.observable<KoTerm>();
}
class KoStudy {
    public Id: number;
    public Name = ko.observable<string>();
}
class KoGroup {
    public Id: number;
    public CourseId: number;
    public Name = ko.observable<string>();
    public Owner = ko.observable<KoUser>();
    public OwnerId: number;
    constructor(group?: any) {
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
    public Id: number;
    public Name = ko.observable<string>();
    constructor(name?: string, id?: number) {
        if (name && id) {
            this.Id = id;
            this.Name(name);
        }
    }
}
class TermPackage {
    public row0 = Array<KoTerm>();
    public row1 = Array<KoTerm>();
    public row2 = Array<KoTerm>();
    public row3 = Array<KoTerm>();
    public row0Dt: string;
    public row1Dt: string;
    public row2Dt: string;
    public row3Dt: string;
    public disableLeft: boolean;
    public disableRight: boolean;
    public disableUp: boolean;
    public disableDown: boolean;
    constructor() {
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
    OldPassword: string;
    NewPassword: string;
}

