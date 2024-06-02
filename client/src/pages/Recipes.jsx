import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {
    Link
  } from "react-router-dom";

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() =>{
        const fetchAllRecipes = async ()=> {
            try {
                const res = await axios.get("http://localhost:8800/recipes");
                setRecipes(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllRecipes();
    },[])

    return (
        <div>
            <h1>All Recipes</h1>
            <div className='recipes'>
                {recipes.map((recipe) => (
                     <div className='recipe' key={recipe.id}>
                        {recipe.image && <img src="recipe.image" alt="" />}
                        <h2>
                            <Link to={`/view/${recipe.id}`}>{recipe.name}</Link>
                        </h2>
                        <p>Rating: {recipe.rating}</p>
                     </div>
                  ))}
            </div>
            <button className="add">
                <Link to="/add">Add new recipe</Link>
            </button>
        </div>
    )
}

export default Recipes;