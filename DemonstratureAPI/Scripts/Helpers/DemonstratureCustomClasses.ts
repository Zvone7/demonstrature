export class KoTerm {
    public Id: number;
    public CourseId: number;
    public Course = ko.observable<KoCourse>();
    public UserId: number;
    public User = ko.observable<KoUser>();
    public GroupId: number;
    public Group = ko.observable<KoGroup>();
    public TermDate = ko.observable<string>();
    public SuggestedUserId = ko.observable<number>();
    public SuggestedUser = ko.observable<KoUser>();
    public CellState = ko.observable<number>();
    public ButtonTakeState = ko.observable<boolean>();
    public ButtonSkipState = ko.observable<boolean>();
    public DemoPickerState = ko.observable<boolean>();
    public x = ko.observable<number>();
    public y = ko.observable<number>();
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
export class RawTerm {
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
export class KoCell {
    public x = ko.observable<number>();
    public y = ko.observable<number>();
    public CellState = ko.observable<number>();
    public ButtonTakeState = ko.observable<boolean>();
    public ButtonSkipState = ko.observable<boolean>();
    public DemoPickerState = ko.observable<boolean>();
    public Term = ko.observable<KoTerm>();
}
export class KoUser {
    public Id: number;
    public Username = ko.observable<string>();
    public Name = ko.observable<string>();
    public LastName = ko.observable<string>();
    public Role = ko.observable<string>();
    constructor(myUser?: KoUser, name?: string) {
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
export class KoStudy {
    public Id: number;
    public Name = ko.observable<string>();
}
export class KoCourse {
    public Id: number;
    public Name = ko.observable<string>();
    public Study = ko.observable<string>();
}
export class KoGroup {
    public Id: number;
    public CourseId: number;
    public Name = ko.observable<string>();
    public Owner = ko.observable<KoUser>();
    public OwnerId: number;
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
export class KoDemonstrator {
    public Id: number;
    public Name = ko.observable<string>();
    constructor(name?: string, id?: number) {
        if (name && id) {
            this.Id = id;
            this.Name(name);
        }
    }
}
export class TermPackage {
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
export class KoTestClass {
    public name: string;
    public age: number;
    constructor() {
        this.name = "test name";
        this.age = 7;
    }
}