import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Update = () => {
	const [recipe, setRecipe] = useState({
		name: "",
		instructions: "",
		rating: null,
		image: "",
		tags: [],
	});

	const navigate = useNavigate();
	const location = useLocation();

	const recipeId = location.pathname.split("/")[2];

	const handleChange = (e) => {
		setRecipe((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleTagChange = (e) => {
		setRecipe((prev) => ({ ...prev, tags: e.target.value.split(",") }));
		console.log(recipe.tags);
	};

	const handleClick = async (e) => {
		e.preventDefault();
		try {
			await axios.put("http://localhost:8800/recipes/" + recipeId, recipe);
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};

	const handleCancel = () => {
		navigate("/");
	};

	return (
		<div className="form">
			<h1>Update Recipe</h1>
			<input type="text" placeholder="name" onChange={handleChange} name="name" />
			<input type="text" placeholder="instructions" onChange={handleChange} name="instructions" />
			<input type="text" placeholder="ingredients" name="ingredients" />
			<input type="number" placeholder="rating" onChange={handleChange} name="rating" />
			<input type="text" placeholder="tags" onChange={handleTagChange} name="tags" />
			<input type="text" placeholder="image" onChange={handleChange} name="image" />
			<button onClick={handleClick} className="formButton">
				Update
			</button>
			<button onClick={handleCancel} className="formButton cancelButton">
				Cancel
			</button>
		</div>
	);
};

export default Update;
