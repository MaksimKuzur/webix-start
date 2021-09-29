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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const categoriesCollection = new webix.DataCollection({ data: categories });

const dataTable = {
    rows: [
        {
            view:"segmented", id:"selector", inputWidth:400,
            options:[
                {id:1, value:"All"},
                {id:2, value:"Old"},
                {id:3, value:"Modern"},
                {id:4, value:"New"}
            ],
            on:{
            onChange:function(){
                $$("dataTable").filterByAll();
                }
            }
        },
        {
            view: "datatable",
            id: "dataTable",
            scrollX: false,
            data: film_set,
            hover: "hover",
            select: true,
            columns: [
                { id: "id", header: "", css: "id", width: 50},
                { id: "title", header: ["Film title", {content:"textFilter"}], width: 200, sort: "string"},
                { id: "categoryId", header: ["Category", {content:"selectFilter"}], options: categories, width: 200, sort: "string"},
                { id: "rating", header: ["Rating", {content:"textFilter"}] , width: 80, sort: "int"},
                { id: "votes", header: ["Votes", {content:"textFilter"}], width: 100, sort: "int"},
                { id: "year", header: ["Year"] , width: 80, sort: "int"},
                { id: "del", header: "", template: "{common.trashIcon()}" },
            ],
            onClick: {
                "wxi-trash": function(e, id) {
                    this.remove(id);
                    return false;
                }
            },
            scheme: {
                $init(obj) {
                    obj.categoryId = randomInt(1, 4);
                }
            },
        }
    ]
};

webix.protoUI({
    name:"editlist"
}, webix.EditAbility, webix.ui.list);

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
                },
                {
                    view: "button",
                    value: "Add user",
                    width: 200,
                    click:function() {
                        $$("list").add({name: (userRandom[randomInt(1, 5)]).value, age:randomInt(1, 90), country:(countryRandom[randomInt(1, 5)]).value})
                    }
                }
            ]
        },
        {
            view: "editlist",
            id: "list",
            select: true,
            template: "#name#, #age#, from #country# <span class='webix_icon wxi-close'></span>",
            editable: true,
            editor:"text",
            editValue: "name",
            editaction:"dblclick",
            rules:{
                name:webix.rules.isNotEmpty,
            },
            onClick:{
                "wxi-close": function(e, id) {
                    this.remove(id);
                    return false;
                }
            },
            scheme: {
                $init:function(obj) {
                    if(obj.age < 26)
                    obj.$css = "highlight";
                },
                $sort:{
                    by:"votes",
                    dir:"desc"
                },
            },
            data: webix.copy(users)
        }
    ]
};

const formToolbar = {
    margin: 10,
    borderless: true,
    cols: [
        {
            view: "button",
            value: "Adit item",
            type: "form",
            css: "webix_primary",
            click: function() {
                var form = $$('formForDatatable');
                if(form.isDirty()){
                    if(!form.validate())
                    return false;
                    form.save();
                }
            },
        },
        {
            view: "button",
            value: "Clear",
            click: function() {
                $$("formForDatatable").clear();
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

    rows: [
        {
            view: "chart",
            id:"chart",
            type: "bar",
            value: "#country#",
            preset: "column",
            xAxis: {
                template:"#id#",
                title: "Country"
            },
            yAxis:{
                start: 0,
                step: 2,
                end: 10
            },
            data: users
        },
    ]
}

const tree =  {
    view: "treetable",
    id: "treetable",
    tooltip: true,
    scroll: "auto",
    editable: true,
    columns: [
        { id: "id", header: "", width: 50},
        { id: "title", header: "Title", width: 250,
        template: "{common.treetable()} #title#", editor:"text" },
        { id: "price", header: "Price", width: 200, editor:"text"}
    ],
    rules:{
        title:webix.rules.isNotEmpty,
        price:webix.rules.isNumber,
        data:webix.rules.isNumber
    },
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

$$("chart").sync($$("list") , function() {
    this.group({
        by: "country",
        map: {
            country: ["country", "count"]
        }	
    });
});

$$("formForDatatable").bind($$("dataTable"));
$$("dataTable").select(2);
// $$("mainMenuList").select("Dashboard");
// $$("mainMenuList").select("Users");
$$("mainMenuList").select("Products");
$$("treetable").openAll();
$$("list_input").attachEvent("onTimedKeyPress", function() {
    let value = this.getValue().toLowerCase();
    $$("list").filter(function(obj) {
        return obj.name.toLowerCase().indexOf(value) !== -1;
    })
});
$$("dataTable").registerFilter(
    $$("selector"), 
    { columnId:"year", compare: function(value, filter, item) {
        let year = value;
        if(filter == 1)  return year > 0;
        else if (filter == 2) return year <=1990;
        else if (filter == 4) return year >=2010;
        else return year >2000;
    }},
    { 
        getValue:function(node){
            return node.getValue();
        },
        setValue:function(node, value){
            node.setValue(value);
        }
    }
);
