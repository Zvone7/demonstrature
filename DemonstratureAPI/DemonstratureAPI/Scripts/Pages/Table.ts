
$(document).ready(() => {
    var _tableVM = new TableVM();
    _tableVM.getAllTerms();
    //ko.applyBindings(_tableVM);
    //console.log("loaded table.");
});

class TableVM{
    //--------------------------------------observables--------------------------------//
    public Terms0 = ko.observableArray<TermCell>();
    public Terms1 = ko.observableArray<TermCell>();
    public Terms2 = ko.observableArray<TermCell>();
    public Terms3 = ko.observableArray<TermCell>();
    public allTerms = ko.observableArray<TermCell[][]>();
    public Users = ko.observableArray<MyUserDTO>();
    //--------------------------------------primitive----------------------------------//
    public moveX: number = 0;
    public moveY: number = 0;
    constructor() {
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

    //-------------------------------TERMS START------------------------------------------------//
    public getAllTerms = () => {
        //console.log("gettingAllTerms");
        var self = this;
        var serviceURL = '/Table/AllTerms';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: TermDTO[][], status) {
            self.createTermTable(data);
        }
        function errorFunc() {
            alert('error');
        }
    }
    public fillAllTerms = (data: TermDTO[][])=>{
        for (var i = 0; i < data.length; i++) {
            //var helperArray: TermCell[];
            this.allTerms[i] = new Array<TermCell>();
            //this.allTerms[i] = [];
            for (var j = 0; j < data[0].length; j++) {
                var cell = ko.observable<TermCell>();
                cell().x = i;
                cell().y = j;
                cell().owner = data[i][j].UserFullName;
                cell().takeState = data[i][j].IsAvailable;
                cell().skipState = data[i][j].IsAvailable;
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell().termDate = date.getDate() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString();
                //helperArray.push(cell);
                this.allTerms[i][j] = cell;
            }
            //this.allTerms.push(helperArray);
        }
        //ko.applyBindings(this);
        //console.log("allTerms:\n",this.allTerms);
    }
    public updateTermArrays = (i_: number, j_: number) => {
        console.log("clicked stuff:", i_, "|", j_);
        //console.log("before:", this.Terms0()[0].termDate);
        console.log("before:", this.Terms0()[0]);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var cell = this.allTerms[i_ + i][j_ + i];
                cell.x = i;
                cell.y = j;
                if (i==0 && j == 0) {
                    //console.log("cell from Terms0:\n", this.Terms0()[0]);
                    //console.log("cell from allTerms:\n", cell);
                }
                if (i == 0) {
                    this.Terms0()[j].owner(cell.owner());
                    this.Terms0()[j].skipState = cell.skipState;
                    this.Terms0()[j].takeState = cell.skipState;
                    this.Terms0()[j].termDate = cell.termDate;
                    this.Terms0()[j].x = i;
                }
                else if (i == 1) this.Terms1()[j] = cell;
                else if (i == 2) this.Terms2()[j] = cell;
                else if (i == 3) this.Terms3()[j] = cell;
            }
        }
        //console.log("after:", this.Terms0()[0].termDate);
        console.log("after:", this.Terms0()[0]);
        //console.log(this.Terms0());
    }
    public createTermTable = (data: TermDTO[][]) => {
        //console.log("data:\n",data);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var cell = new TermCell();
                cell.x = i;
                cell.y = j;
                cell.owner=data[i][j].UserFullName;
                cell.takeState=data[i][j].IsAvailable;
                cell.skipState = data[i][j].IsAvailable;
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell.termDate = date.getDate() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString();
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
        this.fillAllTerms(data);
    }
    //-------------------------------TERMS END--------------------------------------------------//
    //-------------------------------NAVIGATION START-------------------------------------------//
    public leftClicked = () => {
        this.moveY++;
        if (this.moveX >= 0 && this.moveX < this.allTerms.length &&
            this.moveY >= 0) {
            this.updateTermArrays(this.moveX, this.moveY);
        }
    }
    public rightClicked = () => {
        this.moveY--;
        if (this.moveX >= 0 && this.moveX < this.allTerms.length &&
            this.moveY >= 0) {
            this.updateTermArrays(this.moveX, this.moveY);
        }
    }
    public upClicked = () => {
        this.moveX++;
        if (this.moveX >= 0 && this.moveX < this.allTerms.length &&
            this.moveY >= 0) {
            this.updateTermArrays(this.moveX, this.moveY);
        }
    }
    public downClicked = () => {
        this.moveX--;
        if (this.moveX >= 0 && this.moveX < this.allTerms.length &&
            this.moveY >= 0) {
            this.updateTermArrays(this.moveX, this.moveY);
        }
    }
    //-------------------------------NAVIGATION END---------------------------------------------//
    public change = () => {
        console.log(this.Terms0()[0].owner);
    }
    public showTerms0 = () => {
        console.log("Terms0", this.Terms0());
    }
    public showTerms1 = () => {
        console.log("Terms1", this.Terms1());
    }
    public showTerms2 = () => {
        console.log("Terms2", this.Terms2());
    }
    public showTerms3 = () => {
        console.log("Terms3", this.Terms3());
    }
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
    public Id = ko.observable<number>(0);
    public IdCollegeCourse = ko.observable<number>(0);
    public IdUser = ko.observable<number>(0);
    public UserFullName = ko.observable<string>("");
    public TermDate: Date;
    public IsAvailable = ko.observable<boolean>(false);
    constructor(myTerm?: TermDTO) {
        if (myTerm) {
            this.Id(myTerm.Id());
            this.IdCollegeCourse(myTerm.IdCollegeCourse());
            this.IdUser(myTerm.IdUser());
            this.UserFullName(myTerm.UserFullName());
            this.TermDate = myTerm.TermDate;
            this.IsAvailable(myTerm.IsAvailable());
        }
    }
}
class TermCell {
    public x :number;
    public y :number;
    public owner = ko.observable<string>("");
    public takeState = ko.observable<boolean>(false);
    public skipState = ko.observable<boolean>(true);
    public termDate: string;
}

