declare var gSiteVersion: any;

require.config({
    paths: {
        "jquery": "jquery-2.2.3.min",
        "jquery-notify": "notify.min",
        "knockout": "knockout-3.4.0.debug",
        "postbox": "knockout-postbox",
        "text": "text",
        "koBindings": "app/_framework/koBindings",
        "sammy": "sammy-0.7.5",
        "bootstrap": "bootstrap.min",
        "koMapping": "knockout.mapping-latest",
        "toastr": "toastr.min",
        "jqueryUI": "jquery-ui-1.12.0.min"
    },

    shim: {
        "datatables": { "deps": ["jquery"] },
        "bootstrap": { "deps": ["jquery"] },
        "jquery-notify": { "deps": ["jquery"] },
        "knockout": {"deps":["require.js"]},
        "koMapping": { "deps": ["knockout"] },
        "toastr": { "deps": ["jquery"] },
        "jqueryUI": { "deps": ["jquery"] }

    },
    //  urlArgs: "v=" + gSiteVersion
});

require(["knockout", "app/main", "koMapping", "bootstrap", "knockout-amd-helpers", "text", "koBindings", "postbox", "jqueryUI", "jquery-notify"], function (ko: KnockoutStatic, mainModule, koMapping) {

    //  set default folders and extension
    ko.bindingHandlers.module.baseDir = "app/_modules"; // note: currently not used
    ko.amdTemplateEngine.defaultPath = "app/_templates";
    ko.amdTemplateEngine.defaultSuffix = ".html";
    ko.mapping = koMapping;
    ko.applyBindings(mainModule.vm);
});