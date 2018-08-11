function testFunction() {
    console.log("Succesfully called testFunction");
}
function ShowNotification(message, state, timeout = 3000) {
    var notificationWindow = $("#notificationWindow");
    //console.log(message, state);
    notificationWindow
        .css({ opacity: 0.0, visibility: "visible" })
        .animate({ opacity: 1 }, 300);
    switch (state) {
        // error
        case -1:
            notificationWindow.css({
                backgroundColor: "red",
                color: "white",
                border: "2px solid white"
            });
            notificationWindow.text(message);
            break;
        // message
        case 0:
            notificationWindow.css({
                backgroundColor: "yellow",
                color: "black",
                border: "2px solid black"
            });
            notificationWindow.text(message);
            break;
        // succes
        case 1:
            notificationWindow.css({
                backgroundColor: "green",
                color: "white",
                border: "2px solid white"
            });
            notificationWindow.text(message);
            break;
        default:
            break;
    }
    setTimeout(function () {
        notificationWindow
            //.fadeTo(200, 0);
            .animate({ opacity: 0 }, 300);
    }, timeout);
}
//# sourceMappingURL=HelperFunctions.js.map