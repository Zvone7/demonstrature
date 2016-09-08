$(document).ready(function () {
    console.log("loaded table.");
    var x = new TableVM();
    x.getAllTerms();
});
var TableVM = (function () {
    //--------------------------------------primitive----------------------------------//
    function TableVM() {
        var _this = this;
        //--------------------------------------observables--------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        this.Users = ko.observableArray();
        this.getAllUsers = function () {
            var self = _this;
            var serviceURL = '/Table/AllUsers';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //alert(data);
                self.Users(data);
                console.log(self.Users());
                console.log(status);
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.getAllTerms = function () {
            console.log("gettingAllTerms");
            var self = _this;
            var serviceURL = '/Table/AllTerms';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //alert(data);
                //self.Users(data);
                //console.log(data);
                //console.log(status);
                self.createTermTable(data);
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.createTermTable = function (data) {
            console.log("creating term table");
            //console.log(data);
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    var cell = new TermCell();
                    cell.x = i;
                    cell.y = j;
                    cell.owner = data[i][j].UserFullName;
                    cell.takeState = data[i][j].IsAvailable;
                    cell.skipState = data[i][j].IsAvailable;
                    cell.termDate = data[i][j].TermDate;
                    if (i == 0)
                        _this.Terms0.push(cell);
                    else if (i == 1)
                        _this.Terms1.push(cell);
                    else if (i == 2)
                        _this.Terms2.push(cell);
                    else
                        _this.Terms3.push(cell);
                }
            }
            console.log("Terms1", _this.Terms0());
        };
        ko.applyBindings(this);
    }
    return TableVM;
}());
var MyUserDTO = (function () {
    function MyUserDTO(myUser) {
        this.Id = ko.observable(0);
        this.UserName = ko.observable("");
        this.FullName = ko.observable("");
        this.Role = ko.observable("");
        if (myUser) {
            this.Id(myUser.Id());
            this.UserName(myUser.UserName());
            this.FullName(myUser.FullName());
            this.Role(myUser.Role());
        }
    }
    return MyUserDTO;
}());
var TermDTO = (function () {
    function TermDTO(myTerm) {
        this.Id = ko.observable(0);
        this.IdCollegeCourse = ko.observable(0);
        this.IdUser = ko.observable(0);
        this.UserFullName = ko.observable("");
        this.TermDate = ko.observable(new Date());
        this.IsAvailable = ko.observable(false);
        if (myTerm) {
            this.Id(myTerm.Id());
            this.IdCollegeCourse(myTerm.IdCollegeCourse());
            this.IdUser(myTerm.IdUser());
            this.UserFullName(myTerm.UserFullName());
            this.TermDate(myTerm.TermDate());
            this.IsAvailable(myTerm.IsAvailable());
        }
    }
    return TermDTO;
}());
var TermCell = (function () {
    function TermCell() {
        this.owner = ko.observable();
        this.takeState = ko.observable();
        this.skipState = ko.observable();
        this.termDate = ko.observable();
    }
    return TermCell;
}());
