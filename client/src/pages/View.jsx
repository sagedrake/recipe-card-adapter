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
    <div className='view-recipe'>
        <div className='buttons buttons-header'>
            <button onClick={handleBackButton} className='backButton'>Back</button>
            <button className="delete" onClick={handleDelete}>Delete</button>
            <button className="update">
                <Link to={`/update/${recipeId}`}>Update</Link>
            </button>
        </div>
        <div className='recipe-overview'>
            {/* {recipe.image && <img className ="recipe-image" src={recipe.image} alt="image of recipe" />} */}
            <div className = "recipe-info">
                <h1>{recipe.name}</h1>
                <h3>Rating: {recipe.rating}</h3>
                <div className="tags">
                    <h3>Tags:</h3>
                    {recipe.tags.map((tag) => (
                        <div className="tag">
                            {tag}
                        </div>
                    ))}
                </div>
            </div> 
            <div className ="recipe-image">Image of recipe</div>  
        </div>
        <div className="ingredients"> 
            <h2>Ingredients:</h2> 
            <ul className='ingredients-list'>
                {recipe.ingredients.map((ingredient) => (
                    <li className='ingredient'>{ingredient.amount + " " + ingredient.unit + " " + ingredient.ingredient_name} </li>
                ))}
            </ul>
        </div>
        <div className="instructions">
            <h2>Instructions:</h2>
            <p>{recipe.instructions}</p>
        </div>
        
        <div className='buttons buttons-footer'>
            <button className="delete" onClick={handleDelete}>Delete</button>
            <button className="update">
                <Link to={`/update/${recipeId}`}>Update</Link>
            </button>
        </div>
    </div>
  )
}

export default View