$(document).ready(() => {
    ko.applyBindings(new TableVM());
    console.log("loaded table.");
});

function TableVM() {
    this.z = ko.observable("dat value tho");
    this.Users = ko.observableArray<MyUserDTO>();
    this.f1 = () => {
        console.log("f1 called");
    }
    this.f2 = () => {
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