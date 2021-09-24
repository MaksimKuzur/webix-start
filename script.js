const mainMenuList = {
    css: "mainmenu_list",
    view:"list",
    id:"mainMenuList",
    // minWidth:150,
    borderless: true,
    autoheight:true,
    scroll:false,
    data:[ "Dashboard", "Users", "Products", "Locations" ]
};

const mainMenuLabel = {
    template:"<span class='webix_icon wxi-check'></span>Connected",
    borderless: true,
    width:150,
    height:30,
    css:"mainmenu_label"
};

const mainMenu = {
    css:"mainmenu_spaser",
    rows:[
        mainMenuList,
        { },
        mainMenuLabel
    ]
};

const dataTable = {
    view:"datatable",
    id:"dataTable",
    scrollX:false,
    css:"datatable_scrollbar_x",
    data:small_film_set,
    autoConfig:true,
};

const formToolbar = {
    margin:10,
    paddingX:15,
    borderless:true,
    cols:[
        {
            view:"button",
            value:"Add new",
            css:"webix_primary",
            click:function() {
                if($$("formInputElements").validate()){
                    let item = $$("formInputElements").getValues();
                    $$("dataTable").add(item);
                    webix.message("validation is successful");
                }
            }
        },
        {
            view:"button",
            value:"Clear",
            click:function(){
                webix.confirm({
                    text:"Clear the form?"
                }).then(
                    function(){
                        webix.message("Confirmed");
                        $$("formInputElements").clearValidation();
                        $$("formInputElements").clear();
                    }, 
                    function(){
                        webix.message("Rejected");
                    }
                );
            }
        }
    ]
};

const formInputElements = {
    borderless: true,
    view:"form",
    id: "formInputElements",
    width:250,
    elements:[
        { view:"text", label:"Title", name:"title", invalidMessage:"“title“ must be filled in" },
        { view:"text", label:"Year", name:"year", invalidMessage:"“year“ should be between 1970 and current" },
        { view:"text", label:"Votes", name:"votes", invalidMessage:"“votes“ must be less than 100000" },        
        { view:"text", label:"Rating", name:"rating", invalidMessage:"“rating“ cannot be empty or 0" },
        { view:"text", label:"Rank", name:"rank" },
        { view:"text", label:"Category", name:"category" },
    ],
    rules:{
        title:webix.rules.isNotEmpty,
        year:function(value){
            return value>1970 && value <(new Date()).getFullYear();
        },
        votes:function(value){
            return value>0 && value < 100000;
        },
        rating:function(value){ return value > 0; },
    }
};

const formForDatatable = {
    rows:[
        {
            view:"fieldset",
            label:"Edit films",
            height:50,
            css: "form_title"
        },
        formInputElements,
        formToolbar,
        { }
    ]
};

const content = { 
    cols:[ 
        mainMenu,
        { view:"resizer"},
        dataTable,
        formForDatatable
    ]
};

const headerButton = {
    view:"button",
    id:"headerButton",
    type:"icon",
    icon:"mdi mdi-account-search",
    label:"Profile",
    click:function(){
        $$("popupProfile").show({
            x:(window.screen.width-135),
            y:40
        });
    },
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

webix.ui({
    view:"popup",
    id:"popupProfile",
    move:true,
    // position:"center",
    body:{
      view:"list",
      autoheight:true,
      data:[ "Settings", "Log Out" ]
    }
  });