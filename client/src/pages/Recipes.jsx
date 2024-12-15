import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

const Recipes = () => {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		const fetchAllRecipes = async () => {
			try {
				const res = await axios.get("http://localhost:8800/recipes");
				setRecipes(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchAllRecipes();
	}, []);

	return (
		<div>
			<h1>All Recipes</h1>
			<div className="recipes">
				{recipes.map((recipe) => (
					<div className="recipe" key={recipe.id}>
						{recipe.image && <img src="recipe.image" alt="" />}
						<Link component={RouterLink} to={`/view/${recipe.id}`} underline="none" color="inherit">
							<h2>{recipe.name}</h2>
						</Link>
						<p>Rating: {recipe.rating}</p>
					</div>
				))}
			</div>
			<Button component={RouterLink} to="/add" variant="contained" color="primary">
				Add new recipe
			</Button>
		</div>
	);
};

export default Recipes;
