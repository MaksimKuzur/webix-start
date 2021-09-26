const mainMenuList = {
    css: "mainmenu_list",
    view: "list",
    id: "mainMenuList",
    borderless: true,
    autoheight: true,
    scroll: false,
    data: [ "Dashboard", "Users", "Products", "Locations" ]
};

const mainMenuLabel = {
    template: "<span class='webix_icon wxi-check'></span>Connected",
    borderless: true,
    width: 150,
    height: 30,
    css: "mainmenu_label"
};

const mainMenu = {
    css: "mainmenu_spaser",
    rows: [
        mainMenuList,
        { },
        mainMenuLabel
    ]
};

const dataTable = {
    view: "datatable",
    id: "dataTable",
    scrollX: false,
    css: "datatable_scrollbar_x",
    data: small_film_set,
    autoConfig: true,
};

const formToolbar = {
    margin: 10,
    borderless: true,
    cols: [
        {
            view: "button",
            value: "Add new",
            css: "webix_primary",
            click() {
                if($$("formForDatatable").validate()){
                    let item = $$("formForDatatable").getValues();
                    $$("dataTable").add(item);
                    webix.message("A new record has been added to the table");
                }
            }
        },
        {
            view: "button",
            value: "Clear",
            click() {
                webix.confirm({
                    text: "Clear the form?"
                }).then(
                    () => {
                        webix.message("Confirmed");
                        $$("formForDatatable").clearValidation();
                        $$("formForDatatable").clear();
                    }, 
                    () => webix.message("Rejected")
                );
            }
        }
    ]
};

const formForDatatable = {
    borderless: true,
    view: "form",
    id: "formForDatatable",
    width: 250,
    elements: [
        {
            view: "template",
            template: "Edit films",
            type: "section",
        },
        { view: "text", label: "Title", name: "title", invalidMessage: "must be filled in" },
        { view: "text", label: "Year", name: "year", invalidMessage: "1970 < \"year\" < current" },
        { view: "text", label: "Votes", name: "votes", invalidMessage: "< 100000" },        
        { view: "text", label: "Rating", name: "rating", invalidMessage: "cannot be empty or 0" },
        { view: "text", label: "Rank", name: "rank" },
        { view: "text", label: "Category", name: "category" },
        formToolbar,
        { }
    ],
    rules: {
        title: webix.rules.isNotEmpty,
        year: value => value > 1970 && value < (new Date()).getFullYear(),
        votes: value => value > 0 && value < 100000,
        rating: value => value > 0,
    }
};

const content = { 
    cols: [ 
        mainMenu,
        { view: "resizer"},
        dataTable,
        formForDatatable
    ]
};

const headerButton = {
    view: "button",
    id: "headerButton",
    type: "icon",
    icon: "mdi mdi-account-search",
    label: "Profile",
    click() {
        $$("popupProfile").show($$("headerButton").getNode());
    },
    css: "header_button",
    width: 100,
};

const header = {
    css: "header",
    cols: [ 
        {
            template: "My App",
            css: "header_label",
            borderless: true
        },
        headerButton,
    ]
};

const footer = {
    css: "footer",
    template: "The sofware is provided by <a href='URL'>https://webix.com</a>. All rights reserved (c)",
    height: 30
};

webix.ui({
    rows: [
        header,
        content,
        footer,
    ]
});

webix.ui({
    view: "popup",
    id: "popupProfile",
    body: {
      view: "list",
      autoheight: true,
      data: [ "Settings", "Log Out" ]
    }
  });