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
	marketingBox: {
		display: "inline-block",
		flexGrow: 1,
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

	const MarketingContent = () => {
		return (
			<>
				<Box className={classes.textContainerWrapper}>
					<Box className={classes.textContainer}>
						<Typography variant="h6">Why use Word?</Typography>
						<Typography variant="body1" paragraph>
							Why use a word processor to create training documents that will
							never be printed? No more adjusting margins and page breaks to get
							your content looking just right. With Docufy, you can create
							responsive web pages that look crisp and professional on any
							screen.
						</Typography>

						<Typography variant="h6">
							Knowledge management as a service
						</Typography>
						<Typography variant="body1" paragraph>
							Forget about maintaining your own intranet or a shared drive, now
							you can securely upload documents that are available anywhere.
						</Typography>

						<Typography variant="h6">Ease of use</Typography>
						<Typography variant="body1" paragraph>
							Simply type out the instructions for each task and upload any
							helpful images or screenshots. The result will be consistent and
							engaging content.
						</Typography>
					</Box>
				</Box>
			</>
		);
	};

	return (
		<>
			<CssBaseline />
			<Box className={classes.landingBox}>
				<Box className={classes.marketingBox}>
					<MarketingContent />
				</Box>
				<Box className={classes.registerBox}>
					<Register />
				</Box>
			</Box>
		</>
	);
};

export default Landing;
