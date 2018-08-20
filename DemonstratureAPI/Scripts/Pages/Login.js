$(document).ready(() => {
    var l = new LoginVM();
    l.createEmptyCookie();
});
class LoginVM {
    constructor() {
        this.warning_blank_field = "Molim popunite sva polja!";
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        this.cookieMinuteTimeout = 30;
        this.button_tryLogin = () => {
            var username = $("#login_username").val();
            var password = $("#login_password").val();
            if (username == "" || password == "") {
                alert(this.warning_blank_field);
            }
            else {
                var ld = new LoginDataBM();
                ld.Username = username;
                ld.Password = password;
                this.tryLogin(ld);
            }
        };
        this.tryLogin = (ld) => {
            var self = this;
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
        this.createCookie = (username, password) => {
            var cookieName = 'LoginData';
            var cookieValue = username + " " + password;
            var myDate = new Date();
            var expiryDate = new Date();
            expiryDate.setMinutes(myDate.getMinutes() + this.cookieMinuteTimeout);
            document.cookie =
                cookieName + "=" +
                    cookieValue + ";expires=" +
                    expiryDate +
                    location.hostname.split('.').reverse()[1] + "." +
                    location.hostname.split('.').reverse()[0] + "; path=/";
            location.href = this.link_main + this.link_table;
        };
        this.createEmptyCookie = () => {
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
        $('#login_login').on("click", () => {
            //self.button_tryLogin();
        });
        $('#login_username').on("keypress", (event) => {
            if (event.which == 13) {
                //self.button_tryLogin();
            }
        });
        $('#login_password').on("keypress", (event) => {
            if (event.which == 13) {
                //self.button_tryLogin();
            }
        });
        //$('#myUl').css("visibility", "hidden");
        $('#test').on("click", () => {
            self.createCookie("zgrubisic", "1234");
        });
    }
}
class LoginDataBM {
}
//# sourceMappingURL=Login.js.map