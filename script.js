var listLeft = {
    css: "listLeft",
    view:"list",
    id:"mylist",
    minWidth:150,
    borderless: true,
    autoheight:true,
    scroll:false,
    data:[ "Dashboard", "Users", "Products", "Locations" ]
};

var butLeft = {
    view:"button",
    id:"buttonLeft",
    type:"icon",
    icon:"mdi mdi-check",
    label:"Connected",
    css:"buttonLeft",
    width:150
};

var leftMenu = {
    css:"col1",
    rows:[
        listLeft,
        { },
        butLeft
    ]
};

var dataCol2 = {
    view:"datatable",
    scrollX:false,
    css:"scrollDisab",
    data:small_film_set,
    autoConfig:true,
};

var toolBarRi = {
    cols:[
        {},
        { view:"button", value:"Add new", css:"webix_primary", width:105},
        {},
        { view:"button", value:"Clear", width:105 },
        {},
    ]
};

var formRight = {
    borderless: true,
    view:"form",
    width:250,
    elements:[
        { view:"text", label:"Title"},
        { view:"text", label:"Year"},
        { view:"text", label:"Rating"},
        { view:"text", label:"Votes"},
    ]
};

var rightMenu = {
    rows:[
        { view:"fieldset", label:"Edit films", height:50, css: "border_content"},
        formRight,
        toolBarRi,
        { }
    ]
};

var row2 = { 
    cols:[ 
        leftMenu,
        { view:"resizer"},
        dataCol2,
        rightMenu
    ]
};

var butTop = {
    view:"button",
    id:"buttonTop",
    type:"icon",
    icon:"mdi mdi-account-search",
    label:"Profile",
    css:"buttonTop",
    width:100,
};

var row1 = {
    css:"row1",
    cols:[ 
        { template:"My App", css:"labelMyApp", borderless: true},
        butTop,
    ]
};

var row3 = {
    css:"row3",
    template:"The sofware is provided by <a href='URL'>https://webix.com</a>. All rights reserved (c)",
    height: 30
};


webix.ui({
    rows:[
        row1,
        row2,
        row3,
    ]
});