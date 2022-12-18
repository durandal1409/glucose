const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

// app.use(express.urlencoded({extended: true}));
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
    (async function() {
        let client;
        try {
            client = await mongoose.connect("mongodb+srv://admin-maria:sneggir@cluster1.i2jjq.mongodb.net/glucoseDB");
            let graphData = await Meals.find();
            res.json(graphData);
        } catch (err) {
            console.log(err.stack);
        }
        if (client) {
            mongoose.connection.close();
        }
    })();
    
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
    
    (async function() {
        let client;
        try {
            client = await mongoose.connect("mongodb+srv://admin-maria:sneggir@cluster1.i2jjq.mongodb.net/glucoseDB");
            
            await Meals.findOneAndUpdate({date: req.body.date}, {
                [food]: (req.body.food ? req.body.food : undefined),
                [glucose_before]: (req.body.glucose_before ? req.body.glucose_before : undefined),
                [glucose_1hr_after]: (req.body.glucose_1hr_after ? req.body.glucose_1hr_after : undefined)
                },
                {upsert: true, omitUndefined: true}
                );
                
            } catch(err) {
                console.log(err.stack);
            }
            if (client) {
                mongoose.connection.close();
            }
    })();
    res.redirect("/");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully.")
});


// Export the Express API
module.exports = app;