import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { logOutUser } from "../actions/auth";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
	navBar: {
		marginBottom: "2rem",
	},
	navLink: {
		textDecoration: "none",
		":visited": {
			textDecoration: "none",
		},
		navLinkText: {
			color: "white",
		},
	},
	navLinkText: {
		color: "white",
		letterSpacing: "-0.05em",
	},
	navMenuButton: {
		color: "white",
	},
}));

export const NavBar = (props) => {
	const { admin, organization } = props.user.properties;
	const { isAuthenticated } = props.user;
	const classes = useStyles();
	const theme = useTheme();
	const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
	const matches = useMediaQuery(theme.breakpoints.down("xs"));

	const [openDrawer, setOpenDrawer] = useState(false);

	const AdminLink = () => (
		<>
			<Button
				aria-label="Navigate to Admin Page"
				color="inherit"
				component={NavLink}
				to={`/admin/${organization}`}
				id="admin"
			>
				Admin
			</Button>
		</>
	);

	const LoggedInButtons = (
		<Grid item>
			{props.user && admin && <AdminLink />}
			<Button
				aria-label="Navigate to Dashboard"
				color="inherit"
				component={NavLink}
				to={`/dashboard/${organization}`}
				id="dashboard"
			>
				Dashboard
			</Button>
			<Button
				aria-label="Log Out"
				id="logout"
				color="inherit"
				onClick={props.logOutUser}
			>
				Log Out
			</Button>
		</Grid>
	);

	const LoggedOutButton = (
		<Grid item>
			<Button
				aria-label="Navigate to Login Page"
				id="login"
				color="inherit"
				component={NavLink}
				to="/login"
			>
				Log In
			</Button>
		</Grid>
	);

	const tabs = <>{isAuthenticated ? LoggedInButtons : LoggedOutButton}</>;

	const adminDrawerItem = (
		<>
			<ListItem
				aria-label="Navigate to Admin Page"
				button
				component={NavLink}
				to={`/admin/${organization}`}
				onClick={() => setOpenDrawer(false)}
			>
				<ListItemText>Admin</ListItemText>
			</ListItem>
		</>
	);

	const loggedInDrawerItems = (
		<>
			{admin && adminDrawerItem}
			{/* <ListItem
				aria-label="Navigate to Dashboard"
				button
				component={NavLink}
				to={`/dashboard/${organization}`}
				onClick={() => setOpenDrawer(false)}
			>
				<ListItemText>Dashboard</ListItemText>
			</ListItem> */}
			<ListItem
				aria-label="Log Out"
				onClick={() => {
					setOpenDrawer(false);
					props.logOutUser();
				}}
			>
				<ListItemText>Log Out</ListItemText>
			</ListItem>
		</>
	);

	const loggedOutDrawerItem = (
		<>
			<ListItem>
				<ListItemText
					aria-label="Navigate to Login Page"
					button
					component={Link}
				>
					Log In
				</ListItemText>
			</ListItem>
		</>
	);

	const drawer = (
		<>
			<SwipeableDrawer
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}
				onOpen={() => setOpenDrawer(true)}
			>
				<List>
					{isAuthenticated ? loggedInDrawerItems : loggedOutDrawerItem}
				</List>
			</SwipeableDrawer>
			<IconButton
				aria-label="Open Menu"
				onClick={() => setOpenDrawer(!openDrawer)}
				disableRipple
			>
				<MenuIcon className={classes.navMenuButton} />
			</IconButton>
		</>
	);

	return (
		<>
			<CssBaseline />
			<AppBar position="static" className={classes.navBar}>
				<Toolbar>
					<Grid
						container
						direction="row"
						justify="space-between"
						alignItems="center"
					>
						<Grid item>
							<NavLink
								aria-label="Navigate to Home Page"
								className={classes.navLink}
								to="/"
							>
								<Typography variant="h3" className={classes.navLinkText}>
									Docufy
								</Typography>
							</NavLink>
						</Grid>
						<Grid item>{matches ? drawer : tabs}</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps, { logOutUser })(NavBar);
