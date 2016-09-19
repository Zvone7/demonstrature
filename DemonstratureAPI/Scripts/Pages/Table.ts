﻿
$(document).ready(() => {
    var _tableVM = new TableVM();
    _tableVM.getAllCourses();
});

class TableVM{
    //------------------------------------observables----------------------------------//
    public Terms0 = ko.observableArray<TermCell>();
    public Terms1 = ko.observableArray<TermCell>();
    public Terms2 = ko.observableArray<TermCell>();
    public Terms3 = ko.observableArray<TermCell>();
    public allTerms = ko.observableArray<TermCell[][]>();
    public Users = ko.observableArray<MyUserDTO>();
    public disableLeft = ko.observable<boolean>(false);
    public disableRight = ko.observable<boolean>(true);
    public disableUp = ko.observable<boolean>(false);
    public disableDown = ko.observable<boolean>(true);
    //-------------------------------------primitive-----------------------------------//
    public Courses: CourseDTO[];
    public moveX: number = 0;
    public moveY: number = 0;
    public numberOfGroups: number = 0;
    public numberOfTerms: number = 0;
    constructor() {
        var self = this;
        $(document).ready(function () {
            $('#selectStudy').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName(value);
            });
            $('#selectCourse').on("change", function () {
                self.updateValuesAfterSelect();
            });
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
        function successFunc(data: Array<MyUserDTO>, status) {
            //alert(data);
            self.Users(data);
            console.log(self.Users());
            console.log(status);
        }
        function errorFunc() {
            alert('error');
        }

    }
    //-------------------------------USERS END--------------------------------------------------//
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
        function successFunc(data: CourseDTO[], status) {
            self.Courses = data;
            //console.log(self.Courses);
            self.populateSelectStudy();
        }
        function errorFunc() {
            alert('error');
        }
    }
    public populateSelectStudy = () => {
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
        this.updateValuesAfterSelect();
    }
    public populateSelectCourseName = (studyName: string) => {
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
    }
    //-------------------------------COURSE END-------------------------------------------------//
    //-------------------------------TERMS START------------------------------------------------//
    public fillAllTerms = (data: TermDTO[][]) => {
        var stringResult = "";
        this.numberOfTerms = data.length;
        this.numberOfGroups = data[0].length;
        for (var i = 0; i < data.length; i++) {
            this.allTerms[i] = new Array<TermCell>();
            for (var j = 0; j < data[0].length; j++) {
                var cell = ko.observable<TermCell>(new TermCell());
                cell().x = i;
                cell().y = j;
                cell().Owner(data[i][j].UserFullName);
                cell().TakeState(data[i][j].IsAvailable);
                cell().SkipState(data[i][j].IsAvailable);
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell().TermDate(date.getDate().toString() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString());
                cell().Group(data[i][j].Group);
                this.allTerms[i][j] = cell;
                //console.log(i,",",j,": ",this.allTerms[i][j]());
                if (j == 0) { stringResult += "\nrow" + i.toString() + "|" + cell().TermDate() + "\n"; }
                stringResult += cell().Owner() + ",";
            }
        }
        //console.log("allTerms:\n", this.allTerms());
        //console.log(stringResult);

        this.createTermTable(data);
    }
    public createTermTable = (data: TermDTO[][]) => {
        //console.log("data:\n",data);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var cell = new TermCell();
                cell.x = i;
                cell.y = j;
                cell.Owner(data[i][j].UserFullName);
                cell.TakeState(data[i][j].IsAvailable);
                cell.SkipState(data[i][j].IsAvailable);
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell.TermDate(date.getDate() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString());
                cell.Group(data[i][j].Group);
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else if (i == 3) this.Terms3.push(cell);
            }
        }
        ko.applyBindings(this);
        //this.showTerms0();
        //this.showTerms1();
        //this.showTerms2();
        //this.showTerms3();
    }
    public updateTermTable = (data: TermDTO[][]) => {
        //console.log("data:\n",data);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var cell = new TermCell();
                cell.x = i;
                cell.y = j;
                cell.Owner(data[i][j].UserFullName);
                cell.TakeState(data[i][j].IsAvailable);
                cell.SkipState(data[i][j].IsAvailable);
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell.TermDate(date.getDate() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString());
                cell.Group(data[i][j].Group);
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else if (i == 3) this.Terms3.push(cell);
            }
        }
        //ko.applyBindings(this);
        //this.showTerms0();
        //this.showTerms1();
        //this.showTerms2();
        //this.showTerms3();
    }
    public updateTermArrays = (i_: number, j_: number) => {
        //console.log("clicked stuff:", i_, "|", j_);
        //i_ = 0; j_ = 0;
        var helper = "";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var cell = this.allTerms[i_ + i][j_ + j];
                cell().x = i;
                cell().y = j;
                if (i == 0) {
                    this.Terms0()[j].Owner(cell().Owner());
                    this.Terms0()[j].SkipState(cell().SkipState());
                    this.Terms0()[j].TakeState(cell().SkipState());
                    this.Terms0()[j].TermDate(cell().TermDate());
                    this.Terms0()[j].x = cell().x;
                    this.Terms0()[j].y = cell().y;
                    this.Terms0()[j].Group(cell().Group());
                }
                else if (i == 1) {
                    this.Terms1()[j].Owner(cell().Owner());
                    this.Terms1()[j].SkipState(cell().SkipState());
                    this.Terms1()[j].TakeState(cell().SkipState());
                    this.Terms1()[j].TermDate(cell().TermDate());
                    this.Terms1()[j].x = cell().x;
                    this.Terms1()[j].y = cell().y;
                    this.Terms1()[j].Group(cell().Group());
                }
                else if (i == 2) {
                    this.Terms2()[j].Owner(cell().Owner());
                    this.Terms2()[j].SkipState(cell().SkipState());
                    this.Terms2()[j].TakeState(cell().SkipState());
                    this.Terms2()[j].TermDate(cell().TermDate());
                    this.Terms2()[j].x = cell().x;
                    this.Terms2()[j].y = cell().y;
                    this.Terms2()[j].Group(cell().Group());
                }
                else if (i == 3) {
                    this.Terms3()[j].Owner(cell().Owner());
                    this.Terms3()[j].SkipState(cell().SkipState());
                    this.Terms3()[j].TakeState(cell().SkipState());
                    this.Terms3()[j].TermDate(cell().TermDate());
                    this.Terms3()[j].x = cell().x;
                    this.Terms3()[j].y = cell().y;
                    this.Terms3()[j].Group(cell().Group());
                }
            }
        }
    }
    public updateValuesAfterSelect = () => {
        var selectStudy = $('#selectStudy').val();
        var selectCourse = $('#selectCourse').val()
        var self = this;
        var course = new CourseDTO();
        for (var i = 0; i < self.Courses.length; i++) {
            var y = self.Courses[i];
            if (y.Study == selectStudy && y.Name == selectCourse) {
                course = y;
            }
        }
        if (self.Terms0().length > 0) {
            self.updateTermTable(course.TermT);
        }
        else {
            self.fillAllTerms(course.TermT);
        }
    }
    //-------------------------------TERMS END--------------------------------------------------//
    //-------------------------------NAVIGATION START-------------------------------------------//
    public leftClicked = () => {
        this.moveY++;
        if (this.checkValidMovement(this.moveX, this.moveY))
        {
            this.disableRight(false);
            this.updateTermArrays(this.moveX, this.moveY);
        }
        else {
            this.handleWrongMove();
            this.moveY--;
            this.disableLeft(true);
        }
    }
    public rightClicked = () => {
        this.moveY--;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableLeft(false);
        }
        else {
            this.handleWrongMove();
            this.moveY++;
            this.disableRight(true);
        }
    }
    public upClicked = () => {
        this.moveX++;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableDown(false);
        }
        else {
            this.handleWrongMove();
            this.moveX--;
            this.disableUp(true);
        }        
    }
    public downClicked = () => {
        this.moveX--;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableUp(false);
        }
        else {
            this.handleWrongMove();
            this.moveX++;
            this.disableDown(true);
        }
    }
    public handleWrongMove = () => {
        //console.log("Wrong move!");
    }
    public checkValidMovement = (moveX: number, moveY: number) => {
        //console.log(this.moveX, this.moveY);
        if (moveX >= 0 && moveX + 4 <= this.numberOfTerms
            && moveY >= 0 && moveY + 5 <= this.numberOfGroups
        ) {
            return true;
        }
        else {
            return false;
        }
    }
    //-------------------------------NAVIGATION END---------------------------------------------//
}

class MyUserDTO {
    public Id = ko.observable<number>(0);
    public UserName = ko.observable<string>("");
    public FullName = ko.observable<string>("");
    public Role = ko.observable<string>("");
    constructor(myUser?: MyUserDTO) {
        if (myUser) {
            this.Id(myUser.Id());
            this.UserName(myUser.UserName());
            this.FullName(myUser.FullName());
            this.Role(myUser.Role());
        }
    }
}
class TermDTO {
    public Id:number;
    public IdCollegeCourse :number;
    public IdUser:number;
    public UserFullName :string;
    public TermDate: Date;
    public IsAvailable: boolean;
    public Group: GroupDTO;
    constructor(myTerm?: TermDTO) {
        if (myTerm) {
            this.Id=myTerm.Id;
            this.IdCollegeCourse=myTerm.IdCollegeCourse;
            this.IdUser=myTerm.IdUser;
            this.UserFullName=myTerm.UserFullName;
            this.TermDate = myTerm.TermDate;
            this.IsAvailable = myTerm.IsAvailable;
            this.Group = myTerm.Group;
        }
    }
}
class TermCell {
    public x :number;
    public y :number;
    public Owner = ko.observable<string>("");
    public TakeState = ko.observable<boolean>(false);
    public SkipState = ko.observable<boolean>(true);
    public TermDate = ko.observable<string>();
    public Group = ko.observable<GroupDTO>();
}
class CourseDTO {
    public Id: number;
    public Name: string;
    public Study: string;
    public Leader: string;
    public Asistant: string;
    public TermT: TermDTO[][];    
}
class GroupDTO {
    public Id: number;
    public Name: string;
    public Owner: string;
}

