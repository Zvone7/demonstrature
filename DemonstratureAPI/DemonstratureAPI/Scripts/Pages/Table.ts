$(document).ready(() => {
    console.log("loaded table.");
    var x = new TableVM();
    x.getAllTerms();
});


class TableVM{
    //--------------------------------------observables--------------------------------//
    public Terms0 = ko.observableArray<TermCell>();
    public Terms1 = ko.observableArray<TermCell>();
    public Terms2 = ko.observableArray<TermCell>();
    public Terms3 = ko.observableArray<TermCell>();
    public Users = ko.observableArray<MyUserDTO>();
    //--------------------------------------primitive----------------------------------//
    constructor() {
        ko.applyBindings(this);
    }

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
    public getAllTerms = () => {
        console.log("gettingAllTerms");
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
            //alert(data);
            //self.Users(data);
            //console.log(data);
            //console.log(status);
            self.createTermTable(data);
        }
        function errorFunc() {
            alert('error');
        }

    }
    public createTermTable = (data: TermDTO[][]) => {
        console.log("creating term table");
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var cell = new TermCell();
                cell.x = i;
                cell.y = j;
                cell.owner=data[i][j].UserFullName;
                cell.takeState=data[i][j].IsAvailable;
                cell.skipState = data[i][j].IsAvailable;
                cell.termDate = data[i][j].TermDate;
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else this.Terms3.push(cell);
            }
        }
        console.log("Terms1", this.Terms0());
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
    public TermDate = ko.observable<Date>(new Date());
    public IsAvailable = ko.observable<boolean>(false);
    constructor(myTerm?: TermDTO) {
        if (myTerm) {
            this.Id(myTerm.Id());
            this.IdCollegeCourse(myTerm.IdCollegeCourse());
            this.IdUser(myTerm.IdUser());
            this.UserFullName(myTerm.UserFullName());
            this.TermDate(myTerm.TermDate());
            this.IsAvailable(myTerm.IsAvailable());
        }
    }
}
class TermCell {
    public x :number;
    public y :number;
    public owner = ko.observable<string>();
    public takeState = ko.observable<boolean>();
    public skipState = ko.observable<boolean>();
    public termDate = ko.observable<Date>();
}

