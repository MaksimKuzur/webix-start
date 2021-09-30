const mainMenuList = {
    css: "mainmenu_list",
    view: "list",
    id: "mainMenuList",
    borderless: true,
    autoheight: true,
    scroll: false,
    select: true,
    ready: () => $$("mainMenuList").select("Dashboard"),
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const categoriesCollection = new webix.DataCollection({ data: categories });

const dataFilms = {
    rows: [
        {
            view: "segmented", id: "selector", inputWidth: 400,
            options: [
                {id: 1, value: "All"},
                {id: 2, value: "Old"},
                {id: 3, value: "Modern"},
                {id: 4, value: "New"}
            ],
            on: {
            onChange() {
                $$("dataFilms").filterByAll();
                }
            }
        },
        {
            view: "datatable",
            id: "dataFilms",
            scrollX: false,
            data: film_set,
            hover: "film_hover",
            select: true,
            columns: [
                { id: "id", header: "", css: "dataFilms_id", width: 50},
                { id: "title", header: ["Film title", {content:"textFilter"}], width: 200, sort: "string"},
                { id: "categoryId", header: ["Category", {content:"selectFilter"}], options: categories, width: 200, sort: "string"},
                { id: "rating", header: ["Rating", {content:"textFilter"}] , width: 80, sort: "int"},
                { id: "votes", header: ["Votes", {content:"textFilter"}], width: 100, sort: "int"},
                { id: "year", header: ["Year"] , width: 80, sort: "int"},
                { id: "del", header: "", template: "<span class='on_click_delete webix_icon wxi-trash'></span>" },
            ],
            onClick: {
                "on_click_delete": function(e, id) {
                    this.remove(id);
                    return false;
                }
            },
            scheme: {
                $init(obj) {
                    obj.categoryId = randomInt(1, 4);
                }
            },
            ready: () => $$("dataFilms").select(2),
            hover: "film_hover",
        }
    ]
};

webix.protoUI({
    name: "editlist"
}, webix.EditAbility, webix.ui.list);

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
            click: clearForm,
        }
    ]
};

function saveItem() {
    if($$("formForDataFilms").validate()) {
        const form = $$("formForDataFilms");
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
    const item_id = films.getSelectedId();
    if (item_id) {
        webix.confirm("Delete selected item?", "confirm-warning").then(
            () => {
                films.remove(item_id);
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
        { view: "text", label: "Category", name: "category" },
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
                },
                {
                    view: "button",
                    value: "Add user",
                    width: 200,
                    click() {
                        $$("listUsers").add({ name: (userRandom[randomInt(1, 5)]).value, age:randomInt(1, 90), country:(countryRandom[randomInt(1, 5)]).value })
                    }
                }
            ]
        },
        {
            view: "editlist",
            id: "listUsers",
            select: true,
            template: "#name#, #age#, from #country# <span class='on_click_delete webix_icon wxi-close'></span>",
            editable: true,
            editor: "text",
            editValue: "name",
            editaction: "dblclick",
            rules: {
                name: webix.rules.isNotEmpty,
            },
            onClick: {
                "on_click_delete": function(e, id) {
                    this.remove(id);
                    return false;
                }
            },
            scheme: {
                $init: function(obj) {
                    if(obj.age < 26)
                    obj.$css = "user_young_highlight";
                },
                $sort: {
                    by: "votes",
                    dir: "desc"
                },
            },
            data: webix.copy(users)
        }
    ]
};

const chartUsers = {
    rows: [
        {
            view: "chart",
            id: "chartUsers",
            type: "bar",
            value: "#country#",
            preset: "column",
            xAxis: {
                template: "#id#",
                title: "Country"
            },
            yAxis: {
                start: 0,
                step: 2,
                end: 10
            },
            data: users
        },
    ]
}

const productsTable =  {
    view: "treetable",
    id: "productsTable",
    select:"cell",
    tooltip: true,
    editable: true,
    columns: [
        { id: "id", header: "", width: 50},
        { id: "title", header: "Title", width: 250,
        template: "{common.treetable()} #title#", editor: "text" },
        { id: "price", header: "Price", width: 200, editor: "text" }
    ],
    rules: {
        title: webix.rules.isNotEmpty,
        price: webix.rules.isNumber,
        data: webix.rules.isNumber
    },
    ready() {
        $$("productsTable").openAll();
    },
    data: products
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

$$("chartUsers").sync($$("listUsers"), function() {
    this.group({
        by: "country",
        map: {
            country: ["country", "count"]
        }	
    });
});

$$("formForDataFilms").bind($$("dataFilms"));
let filterListUsers = $$("listUsers");
$$("filterUsers").attachEvent("onTimedKeyPress", function() {
    let value = this.getValue().toLowerCase();
    filterListUsers.filter(obj => obj.name.toLowerCase().indexOf(value) !== -1);
});
$$("dataFilms").registerFilter(
    $$("selector"), 
    { columnId: "year", compare: function(value, filter, item) {
        let year = value;
        if(filter == 1)  return year > 0;
        else if (filter == 2) return year <=1990;
        else if (filter == 4) return year >=2010;
        else return year >2000;
    }},
    { 
        getValue: function(node){
            return node.getValue();
        },
        setValue: function(node, value){
            node.setValue(value);
        }
    }
);
