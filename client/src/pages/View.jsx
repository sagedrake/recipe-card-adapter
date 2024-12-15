import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

const View = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const recipeId = location.pathname.split("/")[2];

	const [recipe, setRecipe] = useState({
		id: recipeId,
		name: "",
		ingredients: [],
		instructions: "",
		rating: null,
		tags: [],
		image: "",
	});

	useEffect(() => {
		// fetch recipe
		axios
			.get("http://localhost:8800/recipes/" + recipeId)
			.then((res) => {
				console.log(res);
				setRecipe((prev) => ({
					...prev,
					...res.data,
				}));
			})
			.catch(console.log);
	}, []);

	const handleBackButton = () => {
		navigate("/");
	};

	const handleDelete = async () => {
		try {
			await axios.delete("http://localhost:8800/recipes/" + recipeId);
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="view-recipe">
			<div className="buttons buttons-header">
				<IconButton aria-label="back" variant="outlined" onClick={handleBackButton}>
					<ArrowBackIosIcon />
				</IconButton>
				<IconButton
					component={RouterLink}
					to={`/update/${recipeId}`}
					aria-label="edit"
					variant="outlined"
					onClick={handleBackButton}
				>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" variant="outlined" onClick={handleDelete}>
					<DeleteOutlineIcon />
				</IconButton>
			</div>
			<div className="recipe-overview">
				{/* {recipe.image && <img className ="recipe-image" src={recipe.image} alt="image of recipe" />} */}
				<div className="recipe-info">
					<h1>{recipe.name}</h1>
					<h3>Rating: {recipe.rating}</h3>
					<div className="tags">
						<h3>Tags:</h3>
						{recipe.tags.map((tag) => (
							<div className="tag">{tag}</div>
						))}
					</div>
				</div>
				<div className="recipe-image">Image of recipe</div>
			</div>
			<div className="ingredients">
				<h2>Ingredients:</h2>
				<ul className="ingredients-list">
					{recipe.ingredients.map((ingredient) => (
						<li className="ingredient">
							{ingredient.amount + " " + ingredient.unit + " " + ingredient.ingredient_name}{" "}
						</li>
					))}
				</ul>
			</div>
			<div className="instructions">
				<h2>Instructions:</h2>
				<p>{recipe.instructions}</p>
			</div>
		</div>
	);
};

export default View;
