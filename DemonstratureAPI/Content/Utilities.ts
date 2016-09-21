    export class MyUserM {
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
    export class MyUserDTO {
        public Id: number;
        public Username: string;
        public FullName: string;
        public Role: string;
    }
    export class TermM {
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
    export class CellM {
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
    export class CourseDTO {
        public Id: number;
        public Name: string;
        public Study: string;
        public Leader: string;
        public Asistant: string;
        public TermT: TermM[][];
    }
    export class CourseM {
        public Id = ko.observable<number>();
        public Name = ko.observable<string>();
        public Study = ko.observable<string>();
        public Leader = ko.observable<string>();
        public Asistant = ko.observable<string>();
        public TermT = ko.observable<TermM[][]>();
    }
    export class GroupM {
        public Id = ko.observable<number>();
        public Name = ko.observable<string>();
        public UserPerson = ko.observable<MyUserM>();
    }
