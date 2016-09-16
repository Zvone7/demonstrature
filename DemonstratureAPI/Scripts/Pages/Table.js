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
        this.disableLeft = ko.observable(false);
        this.disableRight = ko.observable(true);
        this.disableUp = ko.observable(false);
        this.disableDown = ko.observable(true);
        this.moveX = 0;
        this.moveY = 0;
        this.numberOfGroups = 0;
        this.numberOfTerms = 0;
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
        //-------------------------------COURSE START------------------------------------------------//
        this.getAllCourses = function () {
            console.log("gettingAllCourses");
            var self = _this;
            var serviceURL = '/Table/AllCollegeCourses';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                console.log(data);
                this.courses = data;
            }
            function errorFunc() {
                alert('error');
            }
        };
        //-------------------------------COURSE END--------------------------------------------------//
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
                self.fillAllTerms(data);
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.fillAllTerms = function (data) {
            var stringResult = "";
            _this.numberOfTerms = data.length;
            _this.numberOfGroups = data[0].length;
            for (var i = 0; i < data.length; i++) {
                _this.allTerms[i] = new Array();
                for (var j = 0; j < data[0].length; j++) {
                    var cell = ko.observable(new TermCell());
                    cell().x = i;
                    cell().y = j;
                    cell().owner(data[i][j].UserFullName);
                    cell().takeState(data[i][j].IsAvailable);
                    cell().skipState(data[i][j].IsAvailable);
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell().termDate(date.getDate().toString() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString());
                    _this.allTerms[i][j] = cell;
                    //console.log(i,",",j,": ",this.allTerms[i][j]());
                    if (j == 0) {
                        stringResult += "\nrow" + i.toString() + "|" + cell().termDate() + "\n";
                    }
                    stringResult += cell().owner() + ",";
                }
            }
            //console.log("allTerms:\n", this.allTerms());
            //console.log(stringResult);
            _this.createTermTable(data);
        };
        this.createTermTable = function (data) {
            //console.log("data:\n",data);
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    var cell = new TermCell();
                    cell.x = i;
                    cell.y = j;
                    cell.owner(data[i][j].UserFullName);
                    cell.takeState(data[i][j].IsAvailable);
                    cell.skipState(data[i][j].IsAvailable);
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell.termDate(date.getDate() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString());
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
        };
        this.updateTermArrays = function (i_, j_) {
            //console.log("clicked stuff:", i_, "|", j_);
            //i_ = 0; j_ = 0;
            var helper = "";
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = _this.allTerms[i_ + i][j_ + j];
                    cell().x = i;
                    cell().y = j;
                    if (i == 0) {
                        _this.Terms0()[j].owner(cell().owner());
                        _this.Terms0()[j].skipState(cell().skipState());
                        _this.Terms0()[j].takeState(cell().skipState());
                        _this.Terms0()[j].termDate(cell().termDate());
                        _this.Terms0()[j].x = cell().x;
                        _this.Terms0()[j].y = cell().y;
                    }
                    else if (i == 1) {
                        _this.Terms1()[j].owner(cell().owner());
                        _this.Terms1()[j].skipState(cell().skipState());
                        _this.Terms1()[j].takeState(cell().skipState());
                        _this.Terms1()[j].termDate(cell().termDate());
                        _this.Terms1()[j].x = cell().x;
                        _this.Terms1()[j].y = cell().y;
                    }
                    else if (i == 2) {
                        _this.Terms2()[j].owner(cell().owner());
                        _this.Terms2()[j].skipState(cell().skipState());
                        _this.Terms2()[j].takeState(cell().skipState());
                        _this.Terms2()[j].termDate(cell().termDate());
                        _this.Terms2()[j].x = cell().x;
                        _this.Terms2()[j].y = cell().y;
                    }
                    else if (i == 3) {
                        _this.Terms3()[j].owner(cell().owner());
                        _this.Terms3()[j].skipState(cell().skipState());
                        _this.Terms3()[j].takeState(cell().skipState());
                        _this.Terms3()[j].termDate(cell().termDate());
                        _this.Terms3()[j].x = cell().x;
                        _this.Terms3()[j].y = cell().y;
                    }
                }
            }
        };
        //-------------------------------TERMS END--------------------------------------------------//
        //-------------------------------NAVIGATION START-------------------------------------------//
        this.leftClicked = function () {
            _this.moveY++;
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                _this.disableRight(false);
                _this.updateTermArrays(_this.moveX, _this.moveY);
            }
            else {
                _this.handleWrongMove();
                _this.moveY--;
                _this.disableLeft(true);
            }
            console.log(_this.disableLeft());
        };
        this.rightClicked = function () {
            _this.moveY--;
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableLeft(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveY++;
                _this.disableRight(true);
            }
        };
        this.upClicked = function () {
            _this.moveX++;
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableDown(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveX--;
                _this.disableUp(true);
            }
        };
        this.downClicked = function () {
            _this.moveX--;
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableUp(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveX++;
                _this.disableDown(true);
            }
        };
        this.handleWrongMove = function () {
            console.log("Wrong move!");
        };
        //-------------------------------NAVIGATION END---------------------------------------------//
        this.change = function () {
            console.log(_this.Terms0()[0].owner);
        };
        this.showTerms0 = function () {
            console.log("Terms0|", _this.Terms0()[0].termDate());
            var result = "";
            for (var i = 0; i < _this.Terms0().length; i++) {
                result += _this.Terms0()[i].owner() + ",";
            }
            console.log(result);
        };
        this.showTerms1 = function () {
            console.log("Terms1|", _this.Terms1()[0].termDate());
            var result = "";
            for (var i = 0; i < _this.Terms1().length; i++) {
                result += _this.Terms1()[i].owner() + ",";
            }
            console.log(result);
        };
        this.showTerms2 = function () {
            var result = "";
            for (var i = 0; i < _this.Terms2().length; i++) {
                result += _this.Terms2()[i].owner() + ",";
            }
            console.log(result);
        };
        this.showTerms3 = function () {
            console.log("Terms3|", _this.Terms3()[0].termDate());
            var result = "";
            for (var i = 0; i < _this.Terms3().length; i++) {
                result += _this.Terms3()[i].owner() + ",";
            }
            console.log(result);
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
        if (myTerm) {
            this.Id = myTerm.Id;
            this.IdCollegeCourse = myTerm.IdCollegeCourse;
            this.IdUser = myTerm.IdUser;
            this.UserFullName = myTerm.UserFullName;
            this.TermDate = myTerm.TermDate;
            this.IsAvailable = myTerm.IsAvailable;
        }
    }
    return TermDTO;
}());
var TermCell = (function () {
    function TermCell() {
        this.owner = ko.observable("");
        this.takeState = ko.observable(false);
        this.skipState = ko.observable(true);
        this.termDate = ko.observable();
    }
    return TermCell;
}());
var CourseDTO = (function () {
    function CourseDTO() {
    }
    return CourseDTO;
}());
