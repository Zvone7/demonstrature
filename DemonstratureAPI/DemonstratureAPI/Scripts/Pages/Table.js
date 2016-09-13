$(document).ready(function () {
    var _tableVM = new TableVM();
    _tableVM.getAllTerms();
    //ko.applyBindings(_tableVM);
    //console.log("loaded table.");
});
var TableVM = (function () {
    function TableVM() {
        var _this = this;
        //--------------------------------------observables--------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        this.allTerms = ko.observableArray();
        this.Users = ko.observableArray();
        //--------------------------------------primitive----------------------------------//
        this.moveX = 0;
        this.moveY = 0;
        //-------------------------------USERS START------------------------------------------------//
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
        //-------------------------------USERS END--------------------------------------------------//
        //-------------------------------TERMS START------------------------------------------------//
        this.getAllTerms = function () {
            //console.log("gettingAllTerms");
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
                self.createTermTable(data);
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.fillAllTerms = function (data) {
            for (var i = 0; i < data.length; i++) {
                //var helperArray: TermCell[];
                _this.allTerms[i] = new Array();
                //this.allTerms[i] = [];
                for (var j = 0; j < data[0].length; j++) {
                    var cell = ko.observable();
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
                    _this.allTerms[i][j] = cell;
                }
            }
            //ko.applyBindings(this);
            //console.log("allTerms:\n",this.allTerms);
        };
        this.updateTermArrays = function (i_, j_) {
            console.log("clicked stuff:", i_, "|", j_);
            //console.log("before:", this.Terms0()[0].termDate);
            console.log("before:", _this.Terms0()[0]);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = _this.allTerms[i_ + i][j_ + i];
                    cell.x = i;
                    cell.y = j;
                    if (i == 0 && j == 0) {
                    }
                    if (i == 0) {
                        _this.Terms0()[j].owner(cell.owner());
                        _this.Terms0()[j].skipState = cell.skipState;
                        _this.Terms0()[j].takeState = cell.skipState;
                        _this.Terms0()[j].termDate = cell.termDate;
                        _this.Terms0()[j].x = i;
                    }
                    else if (i == 1)
                        _this.Terms1()[j] = cell;
                    else if (i == 2)
                        _this.Terms2()[j] = cell;
                    else if (i == 3)
                        _this.Terms3()[j] = cell;
                }
            }
            //console.log("after:", this.Terms0()[0].termDate);
            console.log("after:", _this.Terms0()[0]);
            //console.log(this.Terms0());
        };
        this.createTermTable = function (data) {
            //console.log("data:\n",data);
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    var cell = new TermCell();
                    cell.x = i;
                    cell.y = j;
                    cell.owner = data[i][j].UserFullName;
                    cell.takeState = data[i][j].IsAvailable;
                    cell.skipState = data[i][j].IsAvailable;
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell.termDate = date.getDate() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString();
                    if (i == 0)
                        _this.Terms0.push(cell);
                    else if (i == 1)
                        _this.Terms1.push(cell);
                    else if (i == 2)
                        _this.Terms2.push(cell);
                    else if (i == 3)
                        _this.Terms3.push(cell);
                }
            }
            ko.applyBindings(_this);
            //this.showTerms0();
            //this.showTerms1();
            //this.showTerms2();
            //this.showTerms3();
            _this.fillAllTerms(data);
        };
        //-------------------------------TERMS END--------------------------------------------------//
        //-------------------------------NAVIGATION START-------------------------------------------//
        this.leftClicked = function () {
            _this.moveY++;
            if (_this.moveX >= 0 && _this.moveX < _this.allTerms.length &&
                _this.moveY >= 0) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
            }
        };
        this.rightClicked = function () {
            _this.moveY--;
            if (_this.moveX >= 0 && _this.moveX < _this.allTerms.length &&
                _this.moveY >= 0) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
            }
        };
        this.upClicked = function () {
            _this.moveX++;
            if (_this.moveX >= 0 && _this.moveX < _this.allTerms.length &&
                _this.moveY >= 0) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
            }
        };
        this.downClicked = function () {
            _this.moveX--;
            if (_this.moveX >= 0 && _this.moveX < _this.allTerms.length &&
                _this.moveY >= 0) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
            }
        };
        //-------------------------------NAVIGATION END---------------------------------------------//
        this.change = function () {
            console.log(_this.Terms0()[0].owner);
        };
        this.showTerms0 = function () {
            console.log("Terms0", _this.Terms0());
        };
        this.showTerms1 = function () {
            console.log("Terms1", _this.Terms1());
        };
        this.showTerms2 = function () {
            console.log("Terms2", _this.Terms2());
        };
        this.showTerms3 = function () {
            console.log("Terms3", _this.Terms3());
        };
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
        this.IsAvailable = ko.observable(false);
        if (myTerm) {
            this.Id(myTerm.Id());
            this.IdCollegeCourse(myTerm.IdCollegeCourse());
            this.IdUser(myTerm.IdUser());
            this.UserFullName(myTerm.UserFullName());
            this.TermDate = myTerm.TermDate;
            this.IsAvailable(myTerm.IsAvailable());
        }
    }
    return TermDTO;
}());
var TermCell = (function () {
    function TermCell() {
        this.owner = ko.observable("");
        this.takeState = ko.observable(false);
        this.skipState = ko.observable(true);
    }
    return TermCell;
}());
//# sourceMappingURL=Table.js.map