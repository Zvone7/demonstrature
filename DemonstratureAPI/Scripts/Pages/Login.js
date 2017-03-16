$(document).ready(function () {
    var l = new LoginVM();
    l.createEmptyCookie();
});
var LoginVM = (function () {
    function LoginVM() {
        var _this = this;
        this.warning_blank_field = "Molim popunite sva polja!";
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        this.cookieMinuteTimeout = 30;
        this.button_tryLogin = function () {
            var username = $("#login_username").val();
            var password = $("#login_password").val();
            if (username == "" || password == "") {
                alert(_this.warning_blank_field);
            }
            else {
                var ld = new LoginDataBM();
                ld.Username = username;
                ld.Password = password;
                _this.tryLogin(ld);
            }
        };
        this.tryLogin = function (ld) {
            var self = _this;
            var serviceURL = '/Login/TryLogin';
            $.ajax({
                type: "POST",
                url: serviceURL,
                data: ld,
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                if (status == "success" && data == true) {
                    console.log("Succesfull login.");
                    self.createCookie(ld.Username, ld.Password);
                }
                else {
                    console.log('Error logging in(1)');
                    var password = $("#login_password").val("");
                }
            }
            function errorFunc() {
                console.log('Error logging in(2)');
            }
        };
        this.createCookie = function (username, password) {
            var cookieName = 'LoginData';
            var cookieValue = username + " " + password;
            var myDate = new Date();
            var expiryDate = new Date();
            expiryDate.setMinutes(myDate.getMinutes() + _this.cookieMinuteTimeout);
            document.cookie =
                cookieName + "=" +
                    cookieValue + ";expires=" +
                    expiryDate +
                    location.hostname.split('.').reverse()[1] + "." +
                    location.hostname.split('.').reverse()[0] + "; path=/";
            location.href = _this.link_main + _this.link_table;
        };
        this.createEmptyCookie = function () {
            var cookieName = 'LoginData';
            var cookieValue = "";
            var myDate = new Date();
            var expiryDate = new Date();
            expiryDate.setMinutes(myDate.getFullYear() + 10);
            document.cookie =
                cookieName + "=" +
                    cookieValue + ";expires=" +
                    expiryDate +
                    location.hostname.split('.').reverse()[1] + "." +
                    location.hostname.split('.').reverse()[0] + "; path=/";
        };
        var self = this;
        $('#login_login').on("click", function () {
            //self.button_tryLogin();
        });
        $('#login_username').on("keypress", function (event) {
            if (event.which == 13) {
            }
        });
        $('#login_password').on("keypress", function (event) {
            if (event.which == 13) {
            }
        });
        //$('#myUl').css("visibility", "hidden");
        $('#test').on("click", function () {
            self.createCookie("zgrubisic", "1234");
        });
    }
    return LoginVM;
}());
var LoginDataBM = (function () {
    function LoginDataBM() {
    }
    return LoginDataBM;
}());
