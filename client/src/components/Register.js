import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { registerUser } from "../actions/auth";
import { setErrors } from "../actions/error";
import { validateRegisterData } from "../utils/validation";

//TODO: add feedback when email exists

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

export const Register = (props) => {
	const classes = useStyles();
	const { isAuthenticated, properties } = props.user;

	const [firstName, setFirstName] = useState("");
	const [firstNameHelper, setFirstNameHelper] = useState("");

	const [lastName, setLastName] = useState("");
	const [lastNameHelper, setLastNameHelper] = useState("");

	const [email, setEmail] = useState("");
	const [emailHelper, setEmailHelper] = useState("");

	const [organization, setOrganization] = useState("");
	const [organizationHelper, setOrganizationHelper] = useState("");

	const [password, setPassword] = useState("");
	const [passwordHelper, setPasswordHelper] = useState("");

	const [password2, setPassword2] = useState("");
	const [password2Helper, setPassword2Helper] = useState("");
	//redirect to dashboard once logged in

	if (isAuthenticated) {
		return <Redirect to={`/dashboard/${properties.organization}`} />;
	}

	const onChange = (event) => {
		const { value, id } = event.target;
		switch (id) {
			case "firstName":
				setFirstNameHelper("");
				setFirstName(value);
				break;
			case "lastName":
				setLastNameHelper("");
				setLastName(value);
				break;
			case "email":
				setEmailHelper("");
				setEmail(value);
				break;
			case "organization":
				setOrganizationHelper("");
				setOrganization(value);
				break;
			case "password":
				setPasswordHelper("");
				setPassword(value);
				break;
			case "password2":
				setPassword2Helper("");
				setPassword2(value);
				break;
			default:
				break;
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = {
			firstName,
			lastName,
			email,
			organization,
			password,
			password2,
		};
		const errors = validateRegisterData(formData);

		errors.firstName && setFirstNameHelper(errors.firstName);
		errors.lastName && setLastNameHelper(errors.lastName);
		errors.email && setEmailHelper(errors.email);
		errors.organization && setOrganizationHelper(errors.organization);
		errors.password && setPasswordHelper(errors.password);
		errors.password2 && setPassword2Helper(errors.password2);

		if (Object.keys(errors).length === 0) {
			props.registerUser(formData);
			//redirect to dashboard
		} else {
			return null;
		}
	};

	const ErrorSnackbar = (props) => {
		const [open, setOpen] = React.useState(false);
		const dispatch = useDispatch();
		useEffect(() => {
			if (Object.keys(props.errors).length > 0) {
				setOpen(true);
			}
		}, []);

		const handleClose = (event, reason) => {
			if (reason === "clickaway") {
				return;
			}

			setOpen(false);
			//clear errors
			dispatch(setErrors({}));
		};
		return (
			<div>
				<Snackbar
					anchorOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
					open={open}
					autoHideDuration={5000}
					onClose={handleClose}
					message={props.errors.message}
					action={
						<React.Fragment>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={handleClose}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</React.Fragment>
					}
				/>
			</div>
		);
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form
					className={classes.form}
					noValidate
					onSubmit={handleSubmit}
					id="form"
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="firstName"
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
								onChange={onChange}
								value={firstName}
								error={firstNameHelper.length > 0}
								helperText={firstNameHelper}
								inputProps={{ maxlength: 10 }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lname"
								onChange={onChange}
								value={lastName}
								error={lastNameHelper.length > 0}
								helperText={lastNameHelper}
								inputProps={{ maxlength: 15 }}
							/>
						</Grid>
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
								inputProps={{ maxlength: 30 }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="organization"
								label="Organization Name"
								name="organization"
								onChange={onChange}
								value={organization}
								error={organizationHelper.length > 0}
								helperText={organizationHelper}
								inputProps={{ maxlength: 40 }}
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
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password2"
								label="Confirm Password"
								type="password"
								id="password2"
								onChange={onChange}
								value={password2}
								error={password2Helper.length > 0}
								helperText={password2Helper}
							/>
						</Grid>
					</Grid>
					<Button
						aria-label="Submit Registration"
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign Up
					</Button>
					<ErrorSnackbar errors={props.errors} />
					<Grid container justify="flex-end">
						<Grid item>
							<Link href="#" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(Register);
