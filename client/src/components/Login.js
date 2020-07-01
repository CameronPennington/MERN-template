import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import ErrorSnackbar from "./ErrorSnackbar";

import { logInUser } from "../actions/auth";
import { setErrors } from "../actions/error";
import { validateLoginData } from "../utils/validation";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export const Login = (props) => {
	const dispatch = useDispatch();
	const { isAuthenticated, properties } = props.user;
	const classes = useStyles();

	const [email, setEmail] = useState("");
	const [emailHelper, setEmailHelper] = useState("");

	const [password, setPassword] = useState("");
	const [passwordHelper, setPasswordHelper] = useState("");

	// if (isAuthenticated) {
	// 	return <Redirect to={`/dashboard/${properties.organization}`} />;
	// }

	const onChange = (event) => {
		const { value } = event.target;
		switch (event.target.id) {
			case "email":
				setEmailHelper("");
				setEmail(value);
				break;
			case "password":
				setPasswordHelper("");
				setPassword(value);
				break;
			default:
				break;
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = { email, password };
		const errors = validateLoginData(formData);
		//TODO: useReducer so the states are in sync
		errors.email && setEmailHelper(errors.email);
		errors.password && setPasswordHelper(errors.password);

		if (Object.keys(errors).length === 0) {
			props.logInUser(formData);
		} else {
			return null;
		}
	};

	return (
		<>
			<CssBaseline />
			<Container component="main" maxWidth="xs">
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Log In
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={handleSubmit}
						id="form"
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									onChange={onChange}
									value={email}
									error={emailHelper.length > 0}
									helperText={emailHelper}
									type="email"
									inputProps={{ maxlength: 30 }}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									onChange={onChange}
									value={password}
									error={passwordHelper.length > 0}
									helperText={passwordHelper}
								/>
							</Grid>
						</Grid>
						<Button
							aria-label="Submit Login"
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Log In
						</Button>
						<ErrorSnackbar errors={props.errors} />
					</form>
				</div>
			</Container>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps, { logInUser })(Login);
