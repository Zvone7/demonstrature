$(document).ready(function () {
    ko.applyBindings(new TableVM());
    console.log("loaded table.");
});
function TableVM() {
    var _this = this;
    this.z = ko.observable("dat value tho");
    this.Users = ko.observableArray();
    this.f1 = function () {
        console.log("f1 called");
    };
    this.f2 = function () {
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
}
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
