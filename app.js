const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
    name : "Welcome in the ToDo List"
});
const item2 = new Item({
    name : "clic on + button for add item"
});
const item3 = new Item({
    name : "<---- click on this for checklist"
});

const items = [item1, item2, item3];
const works = [];

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){
        if(items.length === 0) {
            Item.insertMany(items, function(err, doc){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Succesfully inserted");
                }
            });
            res.redirect("/");
        }
        else{
            console.log(Item);
            res.render("list", {ListTitle : "Today", newListItems : foundItems});
        }
    });   

});

app.post("/", function(req, res) {
    const item = new Item({
        name : req.body.newItem
    });
    item.save();
    // if(req.body.button === "Work"){
    //     works.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // } 
} );

app.get("/work", function(req, res) {
    res.render("list",{ListTitle : "Work List", newListItems : works});
})

app.listen(3000, function(){
    console.log("server started");
});