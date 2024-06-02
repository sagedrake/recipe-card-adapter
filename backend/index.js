import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:'test'
})

app.use(express.json())
app.use(cors())

app.get("/", (req, res)=>{
    res.json("hello this is the backend")
});

app.get("/recipes", (req, res)=>{
    const q = "SELECT * FROM recipes";
    db.query(q,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get("/recipe_tags/:id", (req, res)=>{
    const q = "SELECT tag  FROM recipe_tags WHERE recipe_id = ?";
    const recipeId = req.params.id;
    db.query(q, [recipeId],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get("/recipe_ingredients/:id", (req, res)=>{
    const q = "SELECT amount, unit, ingredient_name  FROM recipe_ingredients WHERE recipe_id = ?";
    const recipeId = req.params.id;
    db.query(q, [recipeId],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get("/recipes/:id", (req, res)=>{
    const q = "SELECT *  FROM recipes WHERE id = ?";
    const recipeId = req.params.id;
    db.query(q, [recipeId],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

function insertTags(recipeId, tags) {
    const q = "INSERT INTO `recipe_tags` (`recipe_id`, `tag`) VALUES ?";
    const values = tags.map((tag) => [recipeId, tag]);

    return new Promise((resolve, reject) => {
        db.query(q,[values], (err, data)=> {
            if(err) reject(err);
            resolve("tags inserted");
        });
    });
}

function insertIngredients(recipeId, ingredients) {
    // const q = "INSERT INTO `recipe_ingredients` (`recipe_id`, `amount`, `unit`, `ingredient_name`) VALUES ?";
    // const values = tags.map((tag) => [recipeId, tag]);

    // return new Promise((resolve, reject) => {
    //     db.query(q,[values], (err, data)=> {
    //         if(err) reject(err);
    //         resolve("Ingredients inserted");
    //     });
    // });
    return new Promise((resolve, reject) => resolve("ingredients inserted"));
}

function deleteTags(recipeId) {
    const q = "DELETE FROM recipe_tags WHERE recipe_id = ?"

    return new Promise((resolve, reject) => {
        db.query(q, [recipeId], (err,data) => {
            if(err) reject(err);
            resolve("Recipe has been deleted.");
        });
    });
}

function deleteIngredients(recipeId) {
    return new Promise ((resolve, reject) => resolve("ingredients deleted"));
}

app.post("/recipes", (req, res)=>{
    const q = "INSERT INTO recipes (`name`, `instructions`, `rating`, `image`) VALUES (?, ?, ?, ?)"
    const values = [
        req.body.name,
        req.body.instructions,
        req.body.rating,
        req.body.image
    ];

    // insert recipe
    db.query(q, values,(err,data)=>{
        // once recipe is inserted...
        if(err) return res.json(err);
        let id = data.insertId;

        // insert recipe tags and instructions in parallel, and return when done
        Promise.all([
            insertTags(id, req.body.tags),
            insertIngredients(id, req.body.ingredients)
        ]).then((values) => {
            return res.json("Recipe has been added.");
        }).catch((error) => {
            return res.json(error);
        })
    });
})

app.delete("/recipes/:id", (req, res)=>{
    const recipeId = req.params.id;

    let recipePromise = new Promise((resolve, reject) => {
        const q = "DELETE FROM `recipes` WHERE id = ?"
        db.query(q, [recipeId], (err,data) => {
            if(err) reject(err);
            resolve("Recipe deleted");
        })
    })

    Promise.all([
        recipePromise,
        deleteTags(recipeId),
        deleteIngredients(recipeId)
    ]).then((values) => {
        return res.json("Recipe has been deleted.")
    }).catch((error) => {
        return res.json(error);
    });
});

app.put("/recipes/:id", (req, res)=>{
    const recipeId = req.params.id;

    let updateRecipePromise = new Promise((resolve, reject) => {
        const q = "UPDATE recipes SET `name` = ?, `instructions` = ?, `rating` = ?, `image` = ? WHERE id = ?";
        const values = [
            req.body.name,
            req.body.instructions,
            req.body.rating,
            req.body.image
        ];
        db.query(q, [...values, recipeId], (err,data) => {
            if(err) reject(err);
            resolve();
        })
    });

    let updateTagsPromise = new Promise(async (resolve, reject) => {
        try {
            // first delete old tags, then insert new tags
            await deleteTags(recipeId);
            await insertTags(recipeId, req.body.tags);
            resolve();
        } catch(err){
            reject(err);
        }
    });

    let updateIngredientsPromise = new Promise(async (resolve, reject) => {
        try {
            // first delete old ingredients, then insert new ingredients
            await deleteIngredients(recipeId);
            await insertIngredients(recipeId, req.body.ingredients);
            resolve();
        } catch(err){
            reject(err);
        }
    });

    Promise.all([
        updateRecipePromise,
        updateTagsPromise,
        updateIngredientsPromise
    ]).then((values) => {
        return res.json("Recipe has been updated.");
    }).catch((error) => {
        return res.json(error);
    });
});

app.listen(8800, ()=> {
    console.log("connected to backend!")
})