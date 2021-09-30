const mainMenuList = {
    css: "mainmenu_list",
    view: "list",
    id: "mainMenuList",
    borderless: true,
    autoheight: true,
    scroll: false,
    select: true,
    ready() {
        $$("mainMenuList").select("Dashboard");
    },
    on: {
        onAfterSelect: id => $$(id).show()
    },
    data: [ "Dashboard", "Users", "Products", "Locations" ]
};

const statusConnectionLabel = {
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
        statusConnectionLabel
    ]
};

const dataFilms = {
    view: "datatable",
    id: "dataFilms",
    scrollX: false,
    select:true,
    columns: [
        { id: "id", header: "", css: "dataFilms_id", width: 50},
        { id: "title", header: ["Film title", {content:"textFilter"}], fillspace: true, sort: "string"},
        { id: "year", header: ["Released", {content:"selectFilter"}] , width: 80, sort: "int"},
        { id: "votes", header: ["Votes", {content:"textFilter"}], width: 100, sort: "int"},
        { id: "del", header: "", template: "<span class='on_click_delete webix_icon wxi-trash'></span>" },
    ],
    onClick: {
        "on_click_delete": function(e, id) {
            this.remove(id);
            return false;
        }
    },
    on: {
        onAfterSelect:valuesToForm
    },
    hover: "film_hover",
    data: film_set,
};

function valuesToForm(id) {
    var values = $$("dataFilms").getItem(id);
    $$("formForDataFilms").setValues(values)
};

const toolbarFormDataFilms = {
    margin: 10,
    borderless: true,
    cols: [
        {
            view: "button",
            value: "Save",
            css: "webix_primary",
            click: saveItem,
        },
        {
            view: "button",
            value: "Delete",
            id: "btn_del",
            click: deleteItem,
        },
        {
            view: "button",
            value: "Clear",
            click:clearForm,
        }
    ]
};

function saveItem() {
    const form = $$("formForDataFilms");
    if(form.validate()) {
        const films = $$("dataFilms");
        const itemData = form.getValues();
        if (itemData.id) {
            films.updateItem(itemData.id, itemData);
        } else {
            films.add(itemData);
            webix.message("A new record has been added to the table");
        }
    }
};

function deleteItem() {
    const films = $$("dataFilms");
    const itemId = films.getSelectedId();
    if (itemId) {
        webix.confirm("Delete selected item?", "confirm-warning").then(
            () => {
                films.remove(itemId);
                webix.message("Confirmed");
                $$("formForDataFilms").clearValidation();
                $$("formForDataFilms").clear();
            }, 
            () => webix.message("Rejected")
        );
    }
};

function clearForm() {
    webix.confirm({
        text: "Clear the form?"
    }).then(
        () => {
            webix.message("Confirmed");
            $$("formForDataFilms").clearValidation();
            $$("formForDataFilms").clear();
            $$("dataFilms").unselectAll();
        }, 
        () => webix.message("Rejected")
    );
};

const formForDataFilms = {
    borderless: true,
    view: "form",
    id: "formForDataFilms",
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
        toolbarFormDataFilms,
        { }
    ],
    rules: {
        title: webix.rules.isNotEmpty,
        year: value => value > 1970 && value < (new Date()).getFullYear(),
        votes: value => value > 0 && value < 100000,
        rating: value => value > 0,
    }
};

const dataUsers = {
    margin: 10,
    rows: [
        {
            height: 40,
            view: "toolbar",
            cols: [
                { view: "text", id: "filterUsers" },
                {
                    view: "button",
                    value: "Sort asc",
                    width: 200,
                    css: "webix_primary",
                    click() {
                        $$('listUsers').sort("#name#","asc");
                    }
                },
                {
                    view: "button",
                    value: "Sort desc",
                    width: 200,
                    click() {
                        $$('listUsers').sort("#name#","desc");
                    }
                }
            ]
        },
        {
            view: "list",
            id: "listUsers",
            select: true,
            template: "#name# <span class='on_click_delete webix_icon wxi-close'></span>",
            onClick: {
                "on_click_delete": function(e, id) {
                  this.remove(id);
                    return false;
                }
            },
            ready: () => {
                const listUsers = $$("listUsers");
                const listUsersCount = listUsers.count() > 4 ? 5 : listUsers.count();
                listUsers.clearCss("list_top");
                for (let  i = 0; i < (listUsersCount); i++ ) {
                    listUsers.addCss(listUsers.data.order[i], "list_users");
                }
            },
            data: users
        }
    ]
};

const chartUsers = {
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

const productsTable =  {
    view: "treetable",
    id: "productsTable",
    select:"cell",
    tooltip: true,
    columns: [
        { id: "id", header: "", width: 50},
        { id: "title", header: "Title", width: 250,
        template: "{common.treetable()} #title#" },
        { id: "price", header: "Price", width: 200}
    ],    
    data: products,
    ready() {
        $$("productsTable").openAll();
    },
}

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

const main = {
    cells: [
        { id: "Dashboard", cols: [dataFilms, formForDataFilms] },
        { id: "Users", rows: [dataUsers, chartUsers] },
        { id: "Products", rows: [productsTable] },
        { id: "Locations", template: "Locations view" }
    ]
};

const content = { 
    cols: [ 
        mainMenu,
        { view: "resizer" },
        main,
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

let filterListUsers = $$("listUsers");
$$("filterUsers").attachEvent("onTimedKeyPress", function() {
    let value = this.getValue().toLowerCase();
    filterListUsers.filter(obj => obj.name.toLowerCase().indexOf(value) !== -1);
});
