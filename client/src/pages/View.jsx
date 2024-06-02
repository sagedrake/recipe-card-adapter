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
        const fetchRecipe = async ()=> {
            try {
                const res = await axios.get("http://localhost:8800/recipes/"+recipeId);
                setRecipe(prev => ({
                     ...prev , ...res.data[0]
                }));
            } catch(err) {
                console.log(err);
            }
            try {
                const res = await axios.get("http://localhost:8800/recipe_tags/"+recipeId);
                const tags = res.data.map((x) => (x.tag))
                setRecipe(prev => ({
                    ...prev , "tags": tags
                }))
            } catch(err) {
                console.log(err);
            }
        }
        fetchRecipe();
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
            <p>Ingredients: {recipe.ingredients}</p>
            <p>Instructions: {recipe.instructions}</p>
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