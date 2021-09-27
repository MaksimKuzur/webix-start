const mainMenuList = {
    css: "mainmenu_list",
    view: "list",
    id: "mainMenuList",
    borderless: true,
    autoheight: true,
    scroll: false,
    select: true,
    on: {
        onAfterSelect: id => $$(id).show()
    },
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
    columns: [
        { id: "id", header: "", css: "id", width: 50},
        { id: "title", header: ["Film title", {content:"textFilter"}], width: 200, sort: "string"},
        { id: "year", header: ["Released", {content:"selectFilter"}] , width: 80, sort: "int"},
        { id: "votes", header: ["Votes", {content:"textFilter"}], width: 100, sort: "int"},
        { id: "del", header: "", template: "{common.trashIcon()}" },
    ],
    onClick: {
        "wxi-trash": function(e, id) {
            this.remove(id);
            return false;
        }
    },
    hover: "hover",
    data: film_set,
    autoConfig: true,
};

const dataList = {
    margin: 10,
    rows: [
        {
            height: 40,
            view: "toolbar",
            cols: [
                {view: "text", id: "list_input"},
                {
                    view: "button",
                    value: "Sort asc",
                    width: 200,
                    css: "webix_primary",
                    click() {
                        $$('list').sort("#name#","asc");
                    }
                },
                {
                    view: "button",
                    value: "Sort desc",
                    width: 200,
                    click() {
                        $$('list').sort("#name#","desc");
                    }
                }
            ]
        },
        {
            view: "list",
            id: "list",
            select: true,
            template: "#name# <span class='webix_icon wxi-close'></span>",
            onClick:{
                "wxi-close": function(e, id) {
                  this.remove(id);
                    return false;
                }
            },
            on: {
                onAfterRender: () => {
                    const listTop = $$("list");
                    listTop.clearCss("top_list");
                    for (let  i = 0; i < (listTop.count() > 4 ? 5 : listTop.count()); i++ ) {
                        listTop.addCss(listTop.data.order[i], "top_list");
                    }
                }
            },
            data: users
        }
    ]
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

const chart = {
    type: "clean", rows: [
        {
            type: "clean",
            height: 54
        },
        {
            type: "clean",
            view: "chart",
            type: "bar",
            value: "#age#",
            barWidth: 30,
            radius: 0,
            height: 300,
            xAxis: {
                template: "#age#",
                title: "Age"
            },
            data: users
        }
    ]
}

const tree =  {
    view: "treetable",
    id: "treetable",
    tooltip: true,
    scroll: "auto",
    columns: [
        { id: "id", header: "", width: 50},
        { id: "title", header: "Title", width: 250,
        template: "{common.treetable()} #title#" },
        { id: "price", header: "Price", width: 200}
    ],    
    data: products
}

const main = {
    cells:[
        { id: "Dashboard", cols: [dataTable, formForDatatable]},
        { id: "Users", rows: [dataList, chart]},
        { id: "Products", rows: [tree]},
        { id: "Locations", template: "Locations view"}
    ]
};

const content = { 
    cols: [ 
        mainMenu,
        { view: "resizer"},
        main,
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

$$("mainMenuList").select("Dashboard");
$$("treetable").openAll();
$$("list_input").attachEvent("onTimedKeyPress", function() {
    let value = this.getValue().toLowerCase();
    $$("list").filter(function(obj) {
        return obj.name.toLowerCase().indexOf(value) !== -1;
    })
});
