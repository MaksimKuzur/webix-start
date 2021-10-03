const mainMenuList = {
    css: "mainmenu_list",
    view: "list",
    id: "mainMenuList",
    borderless: true,
    autoheight: true,
    scroll: false,
    select: true,
    ready() {
        $$("mainMenuList").select("Users");
    },
    on: {
        onAfterSelect: id => $$(id).show()
    },
    data: [ "Dashboard", "Users", "Products", "Admin" ]
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

const categoriesCollection = new webix.DataCollection({ url: "categories.json" });

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
            editable: true,
            scrollX: false,
            data: filmSet,
            hover: "film_hover",
            select: true,
            columns: [
                { id: "id", header: "", css: "dataFilms_id", width: 50},
                { id: "title", header: ["Film title", {content:"textFilter"}], fillspace: true, sort: "string"},
                { id: "categoryId", header: ["Category", {content:"selectFilter"}], collection: categoriesCollection, width: 200, sort: "string"},
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
            ready() {
                $$("dataFilms").select(2);
            },
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
            click() {
                const form = $$("formForDataFilms");
                if(form.validate()) {
                    form.save()
                    webix.message("The record was saved in the table");
                }
            }
        },
        {
            view: "button",
            value: "Clear",
            click: clearForm,
        }
    ]
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
        { view:"richselect", label: "Category", name: "categoryId", options: categoriesCollection },
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

const usersCollection = new webix.DataCollection({ url: "users.json" });

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
                        usersCollection.add(
                            {
                                name: (userRandom[randomInt(0, 4)]).value,
                                age: randomInt(1, 90),
                                country: (countryRandom[randomInt(0, 4)]).value
                            }
                        )
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
            editValue: "country",
            editaction: "dblclick",
            rules: {
                name: webix.rules.isNotEmpty,
            },
            onClick: {
                "on_click_delete": function(e, id) {
                    usersCollection.remove(id);
                    return false;
                }
            },
            scheme: {
                $init(obj) {
                    if(obj.age < 26) {
                        obj.$css = "user_young_highlight";
                    }
                },
                $sort: {
                    by: "votes",
                    dir: "desc"
                },
            }
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
            }
        },
    ]
}

const productsTable =  {
    view: "treetable",
    id: "productsTable",
    select: "cell",
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

const toolbarForCategoryTable = {
    view: "toolbar",
    cols: [
          { view:"button", value:"Add new", click() {
            categoriesCollection.add({id: webix.uid(), value: "Since fiction"})
          }},
          { view:"button", value:"Remove selected", click() {
            var selectionCategory = $$("categoryTable").getSelectedId();
            categoriesCollection.remove(selectionCategory);
          }},
        {gravity:2}
    ]
}

const categoryTable = {
    view:"datatable",
    id:"categoryTable",
    columns:[
      { id: "id", header: "id", width: 200,	editor: "text"},
      { id: "value", header: "Category", editor: "text", fillspace: true}
    ],
    editaction: "dblclick",
    editable: true,
    scrollX: false,
    select: true,
}

const main = {
    cells: [
        { id: "Dashboard", cols: [dataFilms, formForDataFilms] },
        { id: "Users", rows: [dataUsers, chartUsers] },
        { id: "Products", rows: [productsTable] },
        { id: "Admin", rows: [toolbarForCategoryTable, categoryTable] }
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

$$("categoryTable").sync(categoriesCollection);
$$("listUsers").sync(usersCollection);
$$("chartUsers").sync(usersCollection, function() {
    this.group({
        by: "country",
        map: {
            country: ["country", "count"]
        }
    });
    $$('chartUsers').sort('#id#','asc');
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

$$("formForDataFilms").bind($$("dataFilms"));
let filterListUsers = $$("listUsers");
$$("filterUsers").attachEvent("onTimedKeyPress", function() {
    let value = this.getValue().toLowerCase();
    filterListUsers.filter(obj => obj.name.toLowerCase().indexOf(value) !== -1);
});

$$("dataFilms").registerFilter(
    $$("selector"), 
    { columnId: "year", compare(year, filter, item) {
        if(filter == 1)  return year > 0;
        else if (filter == 2) return year <=1990;
        else if (filter == 4) return year >=2010;
        else return year >2000;
    }},
    { 
        getValue: node => node.getValue(),
        setValue(node, value) {
            node.setValue(value);
        }
    }
);