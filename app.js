const bodyParser = require("body-parser");
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
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    
    console.log("posting data: ", req.body);
    mongoose.connect("mongodb+srv://admin-maria:sneggir@cluster1.i2jjq.mongodb.net/glucoseDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    

    Meals.findOneAndUpdate({date: req.body.date}, {
            [req.body.meal]: {
                food: req.body.food,
                glucose_before: req.body.glucose_before,
                glucose_1hr_after: req.body.glucose_1hr_after   
            }
        },
        {upsert: true},   
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



app.listen(3000, function() {
    console.log("server has started on port 3000")
});