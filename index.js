// const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const mealSchema = new mongoose.Schema({
    food: String,
    glucose_before: Number,
    glucose_1hr_after: Number
});

const dayMealsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    breakfast: mealSchema,
    second_breakfast: mealSchema,
    lunch: mealSchema,
    afternoon_tea: mealSchema,
    dinner: mealSchema,
    second_dinner: mealSchema
});

const Meals = mongoose.model("Meal", dayMealsSchema);




app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/table", function(req, res) {
    res.sendFile(__dirname + "/public/table.html");
});

app.get("/graph_data", function(req, res) {
    mongoose.connect("mongodb+srv://admin-maria:sneggir@cluster1.i2jjq.mongodb.net/glucoseDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    Meals.find(function(err, graphData) {
        if (!err) {
            res.json(graphData);
        } else {
            res.send(err);
        }
        mongoose.connection.close();
    });
    
});

app.post("/", function(req, res) {
    // making strings with keys for db
    const meal = req.body.meal.toString();
    const food = meal + '.food';
    const glucose_before = meal + '.glucose_before';
    const glucose_1hr_after = meal + '.glucose_1hr_after';
    console.log("posting data: ", {[food]: (req.body.food ? req.body.food : undefined),
    [glucose_before]: (req.body.glucose_before ? req.body.glucose_before : undefined),
    [glucose_1hr_after]: (req.body.glucose_1hr_after ? req.body.glucose_1hr_after : undefined)}
);
    
    mongoose.connect("mongodb+srv://admin-maria:sneggir@cluster1.i2jjq.mongodb.net/glucoseDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    
    Meals.findOneAndUpdate({date: req.body.date}, {
        [food]: (req.body.food ? req.body.food : undefined),
        [glucose_before]: (req.body.glucose_before ? req.body.glucose_before : undefined),
        [glucose_1hr_after]: (req.body.glucose_1hr_after ? req.body.glucose_1hr_after : undefined)
    },
        {upsert: true, omitUndefined: true},   
        function(err, meals) {
            if (err) {
                console.log(err);
            } else {
                console.log("found document: ", meals);
            }

            mongoose.connection.close();
        }
    );
    res.redirect("/");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully.")
});