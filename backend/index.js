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

function insertIngredients() {
    return new Promise((resolve, reject) => resolve(5))
}

app.post("/recipes", (req, res)=>{
    const q = "INSERT INTO recipes (`name`, `instructions`, `rating`, `image`) VALUES (?, ?, ?, ?)"
    const values = [
        req.body.name,
        req.body.instructions,
        req.body.rating,
        req.body.image
    ];

    db.query(q, values,(err,data)=>{
        if(err) return res.json(err);
        let id = data.insertId;

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
    const q = "DELETE FROM `recipes` WHERE id = ?"
    db.query(q, [recipeId], (err,data) => {
        if(err) return res.json(err);
    })
    const q2 = "DELETE FROM recipe_tags WHERE recipe_id = ?"
    db.query(q2, [recipeId], (err,data) => {
        if(err) return res.json(err);
        return res.json("Recipe has been deleted.");
    })
})

app.put("/recipes/:id", (req, res)=>{
    const recipeId = req.params.id;
    const q1 = "UPDATE recipes SET `name` = ?, `instructions` = ?, `rating` = ?, `image` = ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.instructions,
        req.body.rating,
        req.body.image
    ];
    
    const q2 = "DELETE FROM recipe_tags WHERE recipe_id = ?"
    db.query(q2, [recipeId], (err,data) => {
        if(err) return res.json(err);
    })

    const q3 = "INSERT INTO `recipe_tags` (`recipe_id`, `tag`) VALUES (?)";
    for (let i in req.body.tags) {
        const values2 = [recipeId, req.body.tags[i]]
        db.query(q3,[values2], (err, data)=> {
            if(err) return res.json(err);
        });
    }

    db.query(q1, [...values, recipeId], (err,data) => {
        if(err) return res.json(err);
        return res.json("Recipe has been updated.");
    })
})

app.listen(8800, ()=> {
    console.log("connected to backend!")
})