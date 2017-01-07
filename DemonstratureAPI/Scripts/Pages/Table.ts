$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
});

class TableVM{
    //------------------------------------TERM----------------------------------//
    public Terms0: CellM_T[] = new Array<CellM_T>();
    public Terms1: CellM_T[] = new Array<CellM_T>();
    public Terms2: CellM_T[] = new Array<CellM_T>();
    public Terms3: CellM_T[] = new Array<CellM_T>();
    public EmptyTerms: Term2DTO[];
    public ActiveTerms: TermM_T[] = new Array<TermM_T>();
    public AllTerms: CellM_T[][];
    //------------------------------------USER----------------------------------//
    public ActiveUsers: MyUserM_T[];
    public AllUsers: MyUser2DTO[] = new Array<MyUser2DTO>();
    public Users: MyUserM_T[];
    public UserData: MyUserM_T;
    public BlankUser: MyUserM_T = new MyUserM_T({ Id: '0', Username: 'blank', FullName: '-', Role: 'D' });
    //------------------------------------COURSE--------------------------------//
    public AllCourses;
    public Courses: Course2DTO[];
    public Course: Course2DTO;
    //------------------------------------GROUP----------------------------------//
    public ActiveGroups: GroupM_T[];
    public AllGroups;
    public BlankGroup: GroupM_T = new GroupM_T({ Id: '0', Name: '-', OwnerId: '0', CourseId: '0', UserPerson: this.BlankUser });
    //------------------------------------PRIMITIVE------------------------------//
    public disableLeft: boolean = false;
    public disableRight: boolean = true;
    public disableUp: boolean = false;
    public disableDown: boolean = true;
    //-------------------------------------primitive-----------------------------------//
    public moveX: number = 0;
    public moveY: number = 0;
    public numberOfGroups: number = 0;
    public numberOfTerms: number = 0;
    public notification_no_available_data: string = "Nema podataka";
    public notification_no_term_owner: string = "-";
    public notification_no_group_owner: string = "Nema";
    public notification_no_group_name: string = "Nema";
    //------------------------------------FUNCTIONS------------------------------------//
    constructor() {
        var self = this;
        $(document).ready(function () {
            self.getAllCourses();
            //this.getAllUsers();
            //this.setTodayDate();
            $('#selectStudy').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName(value);
            });
            $('#selectCourse').on("change", function () {
                console.log("selectCourse changed");
                self.updateValuesAfterSelect();
            });
            //navigation
            $('#arrowLeft').on("click", () => {
                console.log("lalaa");
                self.leftClicked();
            });
            $('#arrowRight').on("click", () => {
                self.rightClicked();
            });
            $('#arrowUp').on("click", () => {
                self.upClicked();
            });
            $('#arrowDown').on("click", () => {
                self.downClicked();
            });
            //css
            $('#myUl').css("visibility", "visible");
        });
    }
    //-------------------------------USERS START------------------------------------------------//
    public getAllUsers = () => {
        var self = this;
        var serviceURL = '/Table/AllUsers';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: Array<MyUserM_T>, status) {
            //alert(data);
            self.Users=data;
            console.log(self.Users);
            console.log(status);
        }
        function errorFunc() {
            alert('error');
        }

    }
    public getUsersByCourseId = (courseId:number) => {
        //console.log("getting users by course Id");
        var self = this;
        var serviceURL = '/Settings/GetUsersByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: MyUserM_T[], status) {
            self.ActiveUsers = new Array<MyUserM_T>();
            //console.log("users by course id:",data);
            self.ActiveUsers = data;
            self.createFullTermData();
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }
    }
    //-------------------------------USERS END--------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------COURSE START-----------------------------------------------//
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
        function successFunc(data: Course2DTO[], status) {
            self.Courses = data;
            //console.log(self.Courses);
            self.populateSelectStudy();
        }
        function errorFunc() {
            alert('error');
        }
    }
    public populateSelectStudy = () => {
        //console.log("pupulating select study");
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
        $('#selectStudy').find('option').remove().end();
        for (var i = 0; i < studies.length; i++) {
            output.push('<option value="' + studies[i] + '">' + studies[i] + '</option>');
        }
        $('#selectStudy').html(output.join(''));
        var selectStudyValue = $('#selectStudy').val();
        this.populateSelectCourseName(selectStudyValue);
        //this.updateValuesAfterSelect(); // mislim da tu ne treba
    }
    public populateSelectCourseName = (studyName: string) => {
        //console.log("pupulating select course");
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
        $('#selectCourse').find('option').remove().end();
        for (var i = 0; i < names.length; i++) {
            if (this.Courses[i].Name != "" && this.Courses[i].Name != null) {
                output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
            }
        }       
        $('#selectCourse').html(output.join(''));
        this.updateValuesAfterSelect();
    }
    //-------------------------------COURSE END--------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------TERM START------------------------------------------------//
    public getTermsByCourseId = (courseId) => {
        //console.log("getting terms by course Id");
        var self = this;
        var serviceURL = '/Settings/GetTermsByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: Term2DTO[], status) {
            self.EmptyTerms = data;
            self.getGroupsByCourseId(courseId);

        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
        }

    }
    public fillAllTerms = () => {
        //console.log("filling all terms");
        var stringResult = "";
        var flags = [], TermDates = [], foundDate:boolean;
        for (var i = 0; i < this.ActiveTerms.length; i++) {
            foundDate = false;
            if (TermDates.length == 0){
                TermDates.push(this.ActiveTerms[i].TermDate);
                continue;
            }
            for (var j = 0; j < TermDates.length; j++) {
                if (TermDates[j] == this.ActiveTerms[i].TermDate) {
                    foundDate = true;
                }
            }
            if (foundDate) {
                TermDates.push(this.ActiveTerms[i].TermDate);
            }
        }
        this.numberOfTerms = TermDates.length;
        this.numberOfGroups = this.ActiveGroups.length;
        this.AllTerms = new Array<CellM_T[]>();
        for (var i = 0; i < TermDates.length; i++) {
            this.AllTerms[i] = new Array<CellM_T>();
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                var cell: CellM_T = new CellM_T();
                cell.x = i;
                cell.y = j;
                //console.log(i, j);
                if (i == 0 && j == 0) {
                    //console.log(this.ActiveTerms[i]);
                }
                cell.UserPerson = this.ActiveTerms[i].UserPerson;
                //var jsonDate = this.ActiveTerms[i].TermDate.toString();
                //console.log("jsonDate", jsonDate);
                //var date = jsonDate.split('.');
                //cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                cell.TermDate = this.ActiveTerms[i].TermDate.getDate() + "." +
                                (this.ActiveTerms[i].TermDate.getMonth() + 1) + "." +
                                this.ActiveTerms[i].TermDate.getFullYear() + ".";
                cell.Group = this.ActiveTerms[i].Group;
                this.AllTerms[i][j] = cell;
            }
        }
        //console.log("All Terms:", this.AllTerms);
        this.createTermTable();
    }
    public createTermTable = () => {
        for (var i = 0; i < this.AllTerms.length; i++) {
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                var cell = new CellM_T();
                cell.x = i;
                cell.y = j;
                cell.UserPerson = new MyUserM_T(this.AllTerms[i][j].UserPerson);
                var jsonDate = this.AllTerms[i][j].TermDate.toString();
                var date = jsonDate.split('.');
                cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                cell.Group = this.AllTerms[i][j].Group;
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else if (i == 3) this.Terms3.push(cell);
            }
        }
        //console.log(this.Terms0); console.log(this.Terms1); console.log(this.Terms2); console.log(this.Terms3);
        this.updateWebData(this.Terms0, 0);
        this.updateWebData(this.Terms1, 1);
        this.updateWebData(this.Terms2, 2);
        this.updateWebData(this.Terms3, 3);
    }
    public createFullTermData = () => {
        //console.log("creating full term data");
        //console.log("Empty terms", this.EmptyTerms);
        //console.log("Active Users", this.ActiveUsers);
        //console.log("Active Groups", this.ActiveGroups);
        this.ActiveTerms = new Array<TermM_T>();
        for (var i = 0; i < this.EmptyTerms.length; i++) {
            this.ActiveTerms[i] = new TermM_T();
            this.ActiveTerms[i].Id = this.EmptyTerms[i].Id;
            this.ActiveTerms[i].CourseId = this.EmptyTerms[i].CourseId;
            this.ActiveTerms[i].Course = this.Course;
            /*start date conversion*/
            var date = this.EmptyTerms[i].TermDate;
            var realDate = parseInt(date.toString().substr(6, date.toString().trim().length - 8));
            var realDate2 = new Date(realDate);
            /*date conversion end*/
            this.ActiveTerms[i].TermDate = realDate2;
            this.ActiveTerms[i].UserId = this.EmptyTerms[i].UserId;
        }
        for (var i = 0; i < this.ActiveTerms.length; i++) {
            for (var j = 0; j < this.ActiveUsers.length; j++) {
                if (this.ActiveTerms[i].UserId == this.ActiveUsers[j].Id) {
                    this.ActiveTerms[i].UserPerson = this.ActiveUsers[j];
                }
                else {
                    this.ActiveTerms[i].UserPerson = this.BlankUser;
                }
            }
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                if (this.ActiveTerms[i].GroupId == this.ActiveGroups[j].Id) {
                    this.ActiveTerms[i].Group = this.ActiveGroups[j];
                }
                else {
                    this.ActiveTerms[i].Group = this.BlankGroup;
                }
            }
        }
        //console.log("Active Terms", this.ActiveTerms);
        if (this.Terms0.length > 0) {
            console.log("self.Terms0.length>0");
            //self.updateTermTable(Terms);
        }
        else {
            console.log("self.Terms0.length=0");
            this.fillAllTerms();
        }
    }
    public updateTermTable = (data: TermM_T[][]) => {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var cell = new CellM_T();
                cell.x = i;
                cell.y = j;
                cell.UserPerson=data[i][j].UserPerson;
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell.TermDate=date.getDate() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString();
                cell.Group=data[i][j].Group;
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else if (i == 3) this.Terms3.push(cell);
            }
        }
    }
    public updateTermArrays = (i_: number, j_: number) => {
        console.log("clicked stuff:", i_, "|", j_);
        //i_ = 0; j_ = 0;
        var helper = "";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var cell = this.AllTerms[i_ + i][j_ + j];
                cell.x = i;
                cell.y = j;
                if (i == 0) {
                    this.Terms0[j].UserPerson=cell.UserPerson;
                    this.Terms0[j].SkipState=cell.SkipState;
                    this.Terms0[j].TakeState=cell.SkipState;
                    this.Terms0[j].TermDate=cell.TermDate;
                    this.Terms0[j].x = cell.x;
                    this.Terms0[j].y = cell.y;
                    this.Terms0[j].Group=cell.Group;
                }
                else if (i == 1) {
                    this.Terms1[j].UserPerson=cell.UserPerson;
                    this.Terms1[j].SkipState=cell.SkipState;
                    this.Terms1[j].TakeState=cell.SkipState;
                    this.Terms1[j].TermDate=cell.TermDate;
                    this.Terms1[j].x = cell.x;
                    this.Terms1[j].y = cell.y;
                    this.Terms1[j].Group=cell.Group;
                }
                else if (i == 2) {
                    this.Terms2[j].UserPerson=cell.UserPerson;
                    this.Terms2[j].SkipState=cell.SkipState;
                    this.Terms2[j].TakeState=cell.SkipState;
                    this.Terms2[j].TermDate=cell.TermDate;
                    this.Terms2[j].x = cell.x;
                    this.Terms2[j].y = cell.y;
                    this.Terms2[j].Group=cell.Group;
                }
                else if (i == 3) {
                    this.Terms3[j].UserPerson=cell.UserPerson;
                    this.Terms3[j].SkipState=cell.SkipState;
                    this.Terms3[j].TakeState=cell.SkipState;
                    this.Terms3[j].TermDate=cell.TermDate;
                    this.Terms3[j].x = cell.x;
                    this.Terms3[j].y = cell.y;
                    this.Terms3[j].Group=cell.Group;
                }
            }
        }
        console.log("terms0 userperson:", this.Terms0[0].UserPerson);
    }
    public updateValuesAfterSelect = () => {
        //console.log("updating values after select");
        var selectStudy = $('#selectStudy').val();
        var selectCourse = $('#selectCourse').val()
        var self = this;
        var course = new Course2DTO();
        for (var i = 0; i < self.Courses.length; i++) {
            var y = self.Courses[i];
            if (y.Study == selectStudy && y.Name == selectCourse) {
                course = y;
            }
        }
        //console.log(course);
        self.Course = course;
        self.getTermsByCourseId(course.Id);
    }
    public updateWebData = (termsX: CellM_T[], x: number) => {
        var i = x;
        console.log("updating web data for row ", i.toString(), " with this data ", termsX);

        var dateLabelId = "#date" + i.toString();
        var termOwnerLabelId = "#termOwner";
        var groupOwnerLabelId = "#groupOwner";
        var groupNameLabelId = "#groupName";

        if (termsX.length != 0) {
            var date = termsX[0].TermDate;
            $(dateLabelId).text(date);
            $(groupOwnerLabelId).text(this.notification_no_group_owner);
            for (var j = 0; j < 5; j++) {
                termOwnerLabelId += i.toString() + j.toString();
                groupOwnerLabelId += j.toString();
                groupNameLabelId += j.toString();
                var termOwner = "";
                var groupOwner = "";
                var groupName = "";
                if (termsX.length <= j) {
                    termOwner = this.notification_no_term_owner;
                    groupOwner = this.notification_no_group_owner;
                    groupName = this.notification_no_group_name;
                }
                else {
                    termOwner = termsX[j].UserPerson.FullName;
                    groupOwner = termsX[j].Group.UserPerson.FullName;
                    groupName = termsX[j].Group.Name;
                }
                $(termOwnerLabelId).text(termOwner);
                $(groupOwnerLabelId).text(groupOwner);
                $(groupNameLabelId).text(groupName);
                //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                //console.log("[", i, "],[", j, "]", "\nTerm Owner Id:", termOwnerLabelId, "\nGroup Owner Id:", groupOwnerLabelId, "\nGroup Name Id:", groupNameLabelId);
                termOwnerLabelId = "#termOwner";
            }
        }
        else {
            $(dateLabelId).text(this.notification_no_available_data);
            for (var j = 0; j < 5; j++) {
                termOwnerLabelId += i.toString() + j.toString();
                groupOwnerLabelId += j.toString();
                groupNameLabelId += j.toString();
                var termOwner = this.notification_no_term_owner;
                var groupOwner = this.notification_no_group_owner;
                var groupName = this.notification_no_group_name;

                $(termOwnerLabelId).text(termOwner);
                $(groupOwnerLabelId).text(groupOwner);
                $(groupNameLabelId).text(groupName);
                //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                termOwnerLabelId = "#termOwner";
            }
        }
    }
    //-------------------------------TERM END---------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------GROUP START------------------------------------------------//
    public getGroupsByCourseId = (courseId:number) => {
        //console.log("getting groups for", selectGroupId, "and needNew is", needsNew.toString());
        var self = this;
        var serviceURL = '/Settings/GetGroupsByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: GroupM_T[], status) {
            self.ActiveGroups = new Array<GroupM_T>();
            self.ActiveGroups = data;
            //console.log("active groups", self.ActiveGroups);
            self.getUsersByCourseId(courseId);
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }

    }
    //-------------------------------GROUP END--------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------NAVIGATION START-------------------------------------------//
    public leftClicked = () => {
        this.moveY++;
        if (this.checkValidMovement(this.moveX, this.moveY))
        {
            this.disableRight=false;
            //this.updateTermArrays(this.moveX, this.moveY);
        }
        else {
            this.handleWrongMove();
            this.moveY--;
            this.disableLeft=true;
        }
    }
    public rightClicked = () => {
        this.moveY--;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableLeft=false;
        }
        else {
            this.handleWrongMove();
            this.moveY++;
            this.disableRight=true;
        }
    }
    public upClicked = () => {
        this.moveX++;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableDown=false;
        }
        else {
            this.handleWrongMove();
            this.moveX--;
            this.disableUp=true;
        }        
    }
    public downClicked = () => {
        this.moveX--;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableUp=false;
        }
        else {
            this.handleWrongMove();
            this.moveX++;
            this.disableDown=true;
        }
    }
    public handleWrongMove = () => {
        console.log("Wrong move!");
    }
    public checkValidMovement = (moveX: number, moveY: number) => {
        //console.log(this.moveX, this.moveY);
        if (moveX >= 0 && moveX + 4 <= this.numberOfTerms
            && moveY >= 0 && moveY + 5 <= this.numberOfGroups
        ) {
            console.log("true");
            return true;
        }
        else {
            console.log("false");
            return false;
        }
    }
    //-------------------------------NAVIGATION END---------------------------------------------//
    public test = () => {
        this.Terms0[0].UserPerson.Username="lalala";
    }
}
class MyUserM_T {
    public Id:number;
    public Username : string;
    public FullName : string;
    public Role : string;
    constructor(myUser?: any) {
        if (myUser) {
            this.Id=myUser.Id;
            this.Username=myUser.Username;
            this.FullName=myUser.FullName;
            this.Role=myUser.Role;
        }
    }
}
class MyUser2DTO {
    public Id: number;
    public Username: string;
    public FullName: string;
    public Role: string;
}
class TermM_T {
    public Id:number;
    public CourseId: number;
    public Course: CourseM_T;
    public UserId: number;
    public UserPerson: MyUserM_T;
    public GroupId: number;
    public Group: GroupM_T;    
    public TermDate: Date;    
}
class Term2DTO {
    public Id: number;
    public CourseId: number;
    public GroupId: GroupDTO;
    public UserId: number;
    public TermDate: Date = new Date();
}
class CellM_T {
    public x :number;
    public y :number;
    public TakeState : boolean;
    public SkipState : boolean;
    public TermDate : string;
    public Group : GroupM_T;
    public UserPerson : MyUserM_T;    
}
class Course2DTO {
    public Id: number;
    public Name: string;
    public Study: string;
    public Leader: string;
    public Asistant: string;
    public TermT: TermM_T[][];    
}
class CourseM_T {
    public Id : number;
    public Name : string;
    public Study : string;
    public Leader : string;
    public Asistant : string;
    public TermT : TermM_T[][]; 
}
class GroupM_T {
    public Id : number;
    public Name: string;
    public OwnerId: number;
    public CourseId: number;
    public UserPerson: MyUserM_T;
    constructor(group?: any) {
        if (group) {
            this.Id = group.Id;
            this.Name = group.Name;
            this.OwnerId = group.OwnerId;
            this.CourseId = group.CourseId;
            this.UserPerson = group.UserPerson;
        }
    }
}

