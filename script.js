const leftSidebarList = {
    css: "left_sidebar_list",
    view:"list",
    id:"leftSidebarList",
    // minWidth:150,
    borderless: true,
    autoheight:true,
    scroll:false,
    data:[ "Dashboard", "Users", "Products", "Locations" ]
};

const leftSidebarLabel = {
    template:"<span class='webix_icon wxi-check'></span>Connected",
    borderless: true,
    width:150,
    height:30,
    css:"left_sidebar_label"
};

const leftSidebar = {
    css:"left_sidebar_spaser",
    rows:[
        leftSidebarList,
        { },
        leftSidebarLabel
    ]
};

const dataTable = {
    view:"datatable",
    scrollX:false,
    css:"datatable_scrollbar_x",
    data:small_film_set,
    autoConfig:true,
};

const rightSidebarToolbar = {
    margin:10,
    paddingX:15,
    borderless:true,
    cols:[
        {
            view:"button",
            value:"Add new",
            css:"webix_primary",
        },
        {
            view:"button",
            value:"Clear",
        },
    ]
};

const rightSidebarForm = {
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

const rightSidebar = {
    rows:[
        {
            view:"fieldset",
            label:"Edit films",
            height:50,
            css: "right_sidebar_title"
        },
        rightSidebarForm,
        rightSidebarToolbar,
        { }
    ]
};

const content = { 
    cols:[ 
        leftSidebar,
        { view:"resizer"},
        dataTable,
        rightSidebar
    ]
};

const headerButton = {
    view:"button",
    id:"headerButton",
    type:"icon",
    icon:"mdi mdi-account-search",
    label:"Profile",
    css:"header_button",
    width:100,
};

const header = {
    css:"header",
    cols:[ 
        {
            template:"My App",
            css:"header_label",
            borderless: true
        },
        headerButton,
    ]
};

const footer = {
    css:"footer",
    template:"The sofware is provided by <a href='URL'>https://webix.com</a>. All rights reserved (c)",
    height: 30
};

webix.ui({
    rows:[
        header,
        content,
        footer,
    ]
});