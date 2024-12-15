import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recipes from "./pages/Recipes";
import Add from "./pages/Add";
import Update from "./pages/Update";
import View from "./pages/View";
import "./style.css";
import "./View-styles.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { orange, teal } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: teal,
		secondary: orange,
	},
});

function App() {
	return (
		<ThemeProvider theme={darkTheme}>
			<div className="App">
				<CssBaseline />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Recipes />}></Route>
						<Route path="/add" element={<Add />}></Route>
						<Route path="/update/:id" element={<Update />}></Route>
						<Route path="/view/:id" element={<View />}></Route>
					</Routes>
				</BrowserRouter>
			</div>
		</ThemeProvider>
	);
}

export default App;
