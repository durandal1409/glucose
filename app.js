const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/glucoseDB", {useNewUrlParser: true, useUnifiedTopology: true});

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
    
    console.log("body: ", req.body);
    

    Meals.find({_id: "60d0ca00ad89623e5f2ec351"}, function(err, meals) {
        if (err) {
            console.log(err);
        } else {
            if (meals==true) {
                Meals.updateOne({date: req.body.date}, {$set: {"breakfast.glucose_1hr_after": 110}}, function(err) {
                    if (err) {
                        console.log("Here is an error: ", err);
                    } else {
                        console.log("Updated successfully.");
                        mongoose.connection.close();
                    }
                });
            } else {
                const meal = req.body.meal;
                const meals = new Meals({
                    date: req.body.date,
                    [req.body.meal]: {
                        food: req.body.food,
                        glucose_before: req.body.glucose_before,
                        glucose_1hr_after: req.body.glucose_1hr_after   
                    }
                    

                });
                meals.save();
                // mongoose.connection.close();
            }
        };
    });
    res.send("SSSSSSS");
});



app.listen(3000, function() {
    console.log("server has started on port 3000")
});