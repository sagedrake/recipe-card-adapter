import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import {
    Link
  } from "react-router-dom";

const View = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const recipeId = location.pathname.split("/")[2];

    const [recipe, setRecipe] = useState({
        id: recipeId,
        name:"",
        ingredients:[],
        instructions:"",
        rating:null,
        tags:[],
        image:""
    })

    useEffect(() =>{
        // fetch recipe
        axios.get("http://localhost:8800/recipes/"+recipeId).then((res) => {
            console.log(res);
            setRecipe(prev => ({
                ...prev , ...res.data
            })); 
        }).catch(console.log)
    },[])

    const handleBackButton = () => {
        navigate("/");
    }

    const handleDelete = async () => {
        try {
            await axios.delete("http://localhost:8800/recipes/"+recipeId);
            navigate("/");
        } catch(err) {
            console.log(err);
        }
    }

  return (
    <div className='form'>
        <div className='recipe'>
            {recipe.image && <img src="recipe.image" alt="" />}
            <h1>{recipe.name}</h1>
            <p>Rating: {recipe.rating}</p>
            <div className="tags">
                {recipe.tags.map((tag) => (
                    <div className="tag">
                        {tag}
                    </div>
                ))}
            </div>
            <div className="ingredients"> 
                <h2>Ingredients:</h2> 
                {recipe.ingredients.map((ingredient) => (
                    <p>{ingredient.amount + " " + ingredient.unit + " " + ingredient.ingredient_name} </p>
                ))}
            </div>
            <div className="instructions">
                <h2>Instructions:</h2>
                <p>{recipe.instructions}</p>
            </div>
        </div>
        <div className='buttons'>
            <button className="delete" onClick={handleDelete}>Delete</button>
            <button className="update">
                <Link to={`/update/${recipeId}`}>Update</Link>
            </button>
        </div>
        <button onClick={handleBackButton} className='backButton'>Back</button>
    </div>
  )
}

export default View