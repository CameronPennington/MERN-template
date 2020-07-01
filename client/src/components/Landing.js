import React from "react";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import Register from "./Register";

const useStyles = makeStyles((theme) => ({
	landingBox: {
		display: "flex",
		flexWrap: "wrap",
	},

	registerBox: {
		display: "inline-block",
		flexGrow: 1,
	},
	textContainer: {
		display: "inline-block",
		maxWidth: "45rem",
	},
	textContainerWrapper: {
		alignItems: "center",
		display: "flex",
		height: "100%",
		justifyContent: "center",
		width: "100%",
	},
}));
//TODO: add margin to textContainer
export const Landing = () => {
	const classes = useStyles();

	return (
		<>
			<CssBaseline />
			<Box className={classes.landingBox}>
				<Box className={classes.registerBox}>
					<Register />
				</Box>
			</Box>
		</>
	);
};

export default Landing;
