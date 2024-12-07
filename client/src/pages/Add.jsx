import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const Add = () => {
    const [recipe, setRecipe] = useState({
        name:"",
        instructions:"",
        rating:null,
        image:"",
        tags:[]
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setRecipe(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleTagChange = (e) => {
        setRecipe(prev=>({...prev, "tags": e.target.value.split(",")}));
        console.log(recipe.tags);
    }

    const handleClick = async e => {
        e.preventDefault()
        try {
            const result = await axios.post("http://localhost:8800/recipes", recipe);
            console.log(result);
            navigate("/");
        } catch (err){
            console.log(err);
        }
    }

    const handleCancel = () => {
        navigate("/");
    }

  return (
    <Stack spacing={4} alignItems="center">
        <h1>Add New Recipe</h1>
        <Stack spacing={2} justifyContent="center">         
            <input type="text" placeholder='name' onChange={handleChange} name='name'/>
            <input type="text" placeholder='instructions' onChange={handleChange} name='instructions'/>
            <input type="text" placeholder='ingredients' name='ingredients'/>
            <Stack direction="row" alignItems="center">
                <p>Rating:</p>
                <Rating name="rating" defaultValue={4} size="large" onChange={handleChange} />
            </Stack>
            <input type="text" placeholder='tags' onChange={handleTagChange} name='tags'/>
            <input type="text" placeholder='image' onChange={handleChange} name='image'/>
            
            
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
                <Button onClick={handleClick} variant="contained" color="success">Add</Button>
                <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
        </Stack>
    </Stack>
  )
}

export default Add;