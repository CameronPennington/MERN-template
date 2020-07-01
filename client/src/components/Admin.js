import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import { validateUserData, validateEditUserData } from "../utils/validation";

import { setErrors } from "../actions/error";
import { addUser, getUsers, editUser, deleteUser } from "../actions/user";

const useStyles = makeStyles((theme) => ({
	adminHeader: {
		display: "flex",
		justifyContent: "flex-end",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export const Admin = (props) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [userList, setUserList] = useState([]);
	const [adminList, setAdminList] = useState([]);

	useEffect(() => {
		getUsers(props.user.properties.organization)
			.then(({ users }) => {
				// setOrgName(name);
				setUserList(users);
				const admins = users.filter((user) => user.admin);
				setAdminList(admins);
			})
			.catch((err) => {
				dispatch(setErrors(err));
			});
	}, []);

	const AddUserDialog = () => {
		const [open, setOpen] = useState(false);

		const [firstName, setFirstName] = useState("");
		const [firstNameHelper, setFirstNameHelper] = useState("");

		const [lastName, setLastName] = useState("");
		const [lastNameHelper, setLastNameHelper] = useState("");

		const [email, setEmail] = useState("");
		const [emailHelper, setEmailHelper] = useState("");

		const [password, setPassword] = useState("");
		const [passwordHelper, setPasswordHelper] = useState("");

		const [password2, setPassword2] = useState("");
		const [password2Helper, setPassword2Helper] = useState("");

		const [admin, setAdmin] = useState(false);

		const handleClickOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
		};
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

		const handleUserSubmit = (e) => {
			e.preventDefault();
			const orgId = props.user.properties.organization;
			const userData = {
				firstName,
				lastName,
				email,
				password,
				password2,
				organization: orgId,
			};
			const errors = validateUserData(userData);

			errors.firstName && setFirstNameHelper(errors.firstName);
			errors.lastName && setLastNameHelper(errors.lastName);
			errors.email && setEmailHelper(errors.email);
			errors.password && setPasswordHelper(errors.password);
			errors.password2 && setPassword2Helper(errors.password2);

			if (Object.keys(errors).length === 0) {
				addUser(orgId, userData)
					.then(({ users }) => {
						setUserList(users);
					})
					.catch((err) => {
						dispatch(setErrors(err));
					});
				setOpen(false);
			} else {
				return null;
			}
		};

		const handleCheck = (e) => {
			setAdmin(e.target.checked);
		};

		return (
			<div id="add-user-dialog">
				<Button
					variant="outlined"
					color="primary"
					onClick={handleClickOpen}
					id="add-user-button"
				>
					Add User
				</Button>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Create New User</DialogTitle>
					<DialogContent>
						<form
							className={classes.form}
							noValidate
							onSubmit={handleUserSubmit}
							id="add-user-form"
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
								<Grid>
									<Checkbox
										disableRipple
										checked={admin}
										onChange={handleCheck}
										inputProps={{ "aria-label": "primary checkbox" }}
									/>
								</Grid>
							</Grid>
						</form>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary" id="cancel-add-task">
							Cancel
						</Button>
						<Button type="submit" color="primary" form="add-user-form">
							Create
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};

	const UserCard = (props) => {
		//TODO: make it impossible for a user to remove their own admin status
		const EditDialog = (props) => {
			const [editOpen, setEditOpen] = useState(false);

			const [editFirstName, setEditFirstName] = useState(props.user.firstName);
			const [editFirstNameHelper, setEditFirstNameHelper] = useState("");

			const [editLastName, setEditLastName] = useState(props.user.lastName);
			const [editLastNameHelper, setEditLastNameHelper] = useState("");

			const [editEmail, setEditEmail] = useState(props.user.email);
			const [editEmailHelper, setEditEmailHelper] = useState("");

			const [editPassword, setEditPassword] = useState("");
			const [editPasswordHelper, setEditPasswordHelper] = useState("");

			const [admin, setAdmin] = useState(props.user.admin);

			const handleEditOpen = () => {
				setEditOpen(true);
			};
			const handleEditClose = () => {
				setEditOpen(false);
			};

			const onChange = (e) => {
				const { value, id } = e.target;
				switch (id) {
					case "firstName":
						setEditFirstNameHelper("");
						setEditFirstName(value);
						break;
					case "lastName":
						setEditLastNameHelper("");
						setEditLastName(value);
						break;
					case "email":
						setEditEmailHelper("");
						setEditEmail(value);
						break;
					case "password":
						setEditPasswordHelper("");
						setEditPassword(value);
						break;
					default:
						break;
				}
			};

			const handleCheck = (e) => {
				setAdmin(e.target.checked);
			};

			const handleEditSubmit = (e) => {
				e.preventDefault();
				const orgId = props.user.organization;
				const userId = props.user._id;

				const userData = {
					firstName: editFirstName,
					lastName: editLastName,
					email: editEmail,
					password: editPassword,
					admin: admin,
					organization: orgId,
				};
				const errors = validateEditUserData(userData);

				errors.firstName && setEditFirstNameHelper(errors.firstName);
				errors.lastName && setEditLastNameHelper(errors.lastName);
				errors.email && setEditEmailHelper(errors.email);
				errors.password && setEditPasswordHelper(errors.password);

				if (Object.keys(errors).length === 0) {
					editUser(orgId, userId, userData)
						.then(({ users }) => {
							setUserList(users);
						})
						.catch((err) => {
							dispatch(setErrors(err));
						});
					setEditOpen(false);
				} else {
					return null;
				}
			};

			return (
				<div id="add-user-dialog">
					<Button
						variant="outlined"
						color="primary"
						onClick={handleEditOpen}
						id="edit-user-button"
					>
						Edit User
					</Button>
					<Dialog
						open={editOpen}
						onClose={handleEditClose}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">Edit User</DialogTitle>
						<DialogContent>
							<form
								className={classes.form}
								noValidate
								onSubmit={handleEditSubmit}
								id="edit-user-form"
							>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<TextField
											autoComplete="fname"
											name="firstName"
											variant="outlined"
											fullWidth
											id="firstName"
											label="First Name"
											autoFocus
											onChange={onChange}
											value={editFirstName}
											error={editFirstNameHelper.length > 0}
											helperText={editFirstNameHelper}
											inputProps={{ maxlength: 10 }}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											variant="outlined"
											fullWidth
											id="lastName"
											label="Last Name"
											name="lastName"
											autoComplete="lname"
											onChange={onChange}
											value={editLastName}
											error={editLastNameHelper.length > 0}
											helperText={editLastNameHelper}
											inputProps={{ maxlength: 15 }}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											fullWidth
											id="email"
											label="Email Address"
											name="email"
											autoComplete="email"
											onChange={onChange}
											value={editEmail}
											error={editEmailHelper.length > 0}
											helperText={editEmailHelper}
											inputProps={{ maxlength: 30 }}
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											variant="outlined"
											fullWidth
											name="password"
											label="Password"
											type="password"
											id="password"
											onChange={onChange}
											value={editPassword}
											error={editPasswordHelper.length > 0}
											helperText={editPasswordHelper}
										/>
									</Grid>
									<Box>
										<Checkbox
											disableRipple
											disabled={
												props.loggedInUser.localeCompare(props.user._id) == 0
											}
											checked={admin}
											onChange={handleCheck}
											inputProps={{ "aria-label": "primary checkbox" }}
										/>
										Admin
									</Box>
								</Grid>
							</form>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={handleEditClose}
								color="primary"
								id="cancel-edit-task"
							>
								Cancel
							</Button>
							<Button type="submit" color="primary" form="edit-user-form">
								Edit
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			);
		};
		const DeleteDialog = (props) => {
			const [deleteOpen, setDeleteOpen] = useState(false);
			const handleDeleteOpen = () => {
				setDeleteOpen(true);
			};
			const handleDeleteClose = () => {
				setDeleteOpen(false);
			};
			const handleDeleteSubmit = (e) => {
				e.preventDefault();

				const orgId = props.user.organization;
				const userId = props.user._id;

				deleteUser(orgId, userId)
					.then(({ users }) => {
						setUserList(users);
					})
					.catch((err) => {
						dispatch(setErrors(err));
					});
				setDeleteOpen(false);
			};

			return (
				<>
					<Button variant="outlined" color="primary" onClick={handleDeleteOpen}>
						Delete User
					</Button>
					<Dialog open={deleteOpen} onClose={handleDeleteClose}>
						<DialogContent>
							<form
								noValidate
								onSubmit={handleDeleteSubmit}
								id="delete-user-form"
							>
								<DialogTitle>Are you sure?</DialogTitle>
								<DialogActions>
									{" "}
									<Button color="primary" onClick={handleDeleteClose}>
										Cancel
									</Button>
									<Button
										autoFocus
										color="primary"
										type="submit"
										form="delete-user-form"
									>
										Delete
									</Button>
								</DialogActions>
							</form>
						</DialogContent>
					</Dialog>
				</>
			);
		};

		return (
			<Card>
				<CardContent>
					<Typography>{`${props.user.firstName} ${props.user.lastName}`}</Typography>
				</CardContent>
				<CardActions>
					{" "}
					<EditDialog
						user={props.user}
						adminList={props.adminList}
						loggedInUser={props.loggedInUser}
					/>
					<DeleteDialog user={props.user} />
				</CardActions>
			</Card>
		);
	};
	return (
		<>
			<CssBaseline />
			<Container>
				<Box className={classes.adminHeader}>
					<AddUserDialog />
				</Box>
				{userList &&
					userList.length > 0 &&
					userList.map((user) => (
						<UserCard
							key={user._id}
							user={user}
							adminList={adminList}
							loggedInUser={props.user.properties.id}
						/>
					))}
			</Container>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps)(Admin);
