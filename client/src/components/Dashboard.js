import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import ErrorSnackbar from "./ErrorSnackbar";

import { getOrg, addTask, deleteTask, editTask } from "../actions/organization";
import { setErrors } from "../actions/error";

const useStyles = makeStyles((theme) => ({
	organizationHeader: {
		display: "flex",
		marginBottom: "2rem",
	},
	orgTitleBox: {
		flexGrow: 1,
	},
	taskButtons: {
		display: "flex",
		justifyContent: "flex-end",
		width: "100%",
	},
	taskCard: {
		display: "inline-block",
		margin: "1rem 2rem 0 2rem",
		width: "40%",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
	taskListBox: {
		display: "flex",
		flexWrap: "wrap",
	},
}));
//TODO: redirect to login on unauthenticated request
export const Dashboard = (props) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [orgName, setOrgName] = useState("");
	const [taskList, setTaskList] = useState([]);

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		getOrg(props.user.properties.organization)
			.then(({ orgName, tasks }) => {
				setOrgName(orgName);
				setTaskList(tasks);
			})
			.catch((err) => {
				dispatch(setErrors(err));
			});
	}, []);
	//TODO: should be able to pass tasklist in as a dependency
	const AddTaskDialog = () => {
		const [open, setOpen] = useState(false);
		const [taskName, setTaskName] = useState("");

		const handleClickOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
		};
		const handleTaskSubmit = (e) => {
			e.preventDefault();
			const orgId = props.user.properties.organization;
			const taskData = { name: taskName };
			addTask(orgId, taskData)
				.then(({ tasks }) => {
					setTaskList(tasks);
				})
				.catch((err) => {
					dispatch(setErrors(err));
				});
			setOpen(false);
		};

		return (
			<div id="AddTaskDialog">
				<Button
					aria-label="Add Task"
					variant="outlined"
					color="primary"
					onClick={handleClickOpen}
					id="add-task"
				>
					<Typography variant="button" noWrap>
						Add Task
					</Typography>
				</Button>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">New Task</DialogTitle>
					<DialogContent>
						<form noValidate onSubmit={handleTaskSubmit} id="add-new-task">
							{/* TODO: reduce vertical spacing in ContentText */}
							<DialogContentText>
								To add a task, write the name of the task below
							</DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Name"
								fullWidth
								onChange={(e) => setTaskName(e.target.value)}
								value={taskName}
								inputProps={{ maxlength: 30 }}
							/>
						</form>
					</DialogContent>
					<DialogActions>
						<Button
							aria-label="Cancel Add Task"
							onClick={handleClose}
							color="primary"
							id="cancel-add-task"
						>
							Cancel
						</Button>
						<Button
							aria-label="Submit Add Task"
							type="submit"
							color="primary"
							form="add-new-task"
							disabled={taskName.length === 0}
						>
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};
	const TaskCard = (props) => {
		const EditDialog = (props) => {
			const [editOpen, setEditOpen] = useState(false);
			const [editTaskName, setEditTaskName] = useState(props.name);
			const handleEditOpen = () => {
				setEditOpen(true);
			};
			const handleEditClose = () => {
				setEditOpen(false);
			};
			const handleEditSubmit = (e) => {
				e.preventDefault();
				const { orgId, taskId } = props;
				const taskData = { name: editTaskName };
				editTask(orgId, taskId, taskData)
					.then(({ tasks }) => {
						setTaskList(tasks);
					})
					.catch((err) => {
						dispatch(setErrors(err));
					});
			};

			return (
				<>
					<Button
						aria-label="Edit Task"
						variant="outlined"
						color="primary"
						onClick={handleEditOpen}
					>
						Edit
					</Button>
					<Dialog open={editOpen} onClose={handleEditClose}>
						<DialogTitle>Rename Task?</DialogTitle>
						<DialogContent>
							<form noValidate onSubmit={handleEditSubmit} id="edit-task-name">
								<TextField
									autoFocus
									margin="dense"
									id="edit-name"
									label="Name"
									fullWidth
									onChange={(e) => setEditTaskName(e.target.value)}
									value={editTaskName}
									inputProps={{ maxlength: 30 }}
								/>
								<DialogActions>
									{" "}
									<Button
										aria-label="Cancel Edit Task"
										color="primary"
										onClick={handleEditClose}
									>
										Cancel
									</Button>
									<Button
										aria-label="Submit Task Edit"
										color="primary"
										type="submit"
										form="edit-task-name"
										disabled={editTaskName.length === 0}
									>
										Edit
									</Button>
								</DialogActions>
							</form>
						</DialogContent>
					</Dialog>
				</>
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
				const { orgId, taskId } = props;
				deleteTask(orgId, taskId)
					.then(({ tasks }) => {
						setTaskList(tasks);
					})
					.catch((err) => {
						dispatch(setErrors(err));
					});
			};

			return (
				<>
					<Button
						aria-label="Delete Task"
						variant="outlined"
						color="primary"
						onClick={handleDeleteOpen}
					>
						Delete
					</Button>
					<Dialog open={deleteOpen} onClose={handleDeleteClose}>
						<DialogContent>
							<form noValidate onSubmit={handleDeleteSubmit} id="delete-task">
								<DialogTitle>Are you sure?</DialogTitle>
								<DialogActions>
									{" "}
									<Button
										aria-label="Cancel Delete Task"
										color="primary"
										onClick={handleDeleteClose}
									>
										Cancel
									</Button>
									<Button
										aria-label="Confirm Delete Task"
										autoFocus
										color="primary"
										type="submit"
										form="delete-task"
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
			<>
				<Card className={classes.taskCard}>
					<CardContent>
						<Typography>{props.name}</Typography>
					</CardContent>

					<CardActions>
						{" "}
						<Box className={classes.taskButtons}>
							<Button
								variant="outlined"
								color="primary"
								component={NavLink}
								to={`/task/${props.taskId}`}
							>
								View
							</Button>{" "}
							<EditDialog
								taskId={props.taskId}
								orgId={props.orgId}
								name={props.name}
							/>
							<DeleteDialog taskId={props.taskId} orgId={props.orgId} />
						</Box>
					</CardActions>
				</Card>
			</>
		);
	};
	return (
		<>
			<CssBaseline />
			<Container>
				<Box className={classes.organizationHeader}>
					<Box className={classes.orgTitleBox}>
						<Typography variant={matches ? "h5" : "h4"}>{orgName}</Typography>
					</Box>
					<AddTaskDialog />
				</Box>
				<Box className={classes.taskListBox}>
					{taskList &&
						taskList.length > 0 &&
						taskList.map((task) => (
							<TaskCard
								key={task._id}
								name={task.name}
								taskId={task._id}
								orgId={props.user.properties.organization}
							/>
						))}
				</Box>
				<ErrorSnackbar errors={props.errors} />
			</Container>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps)(Dashboard);
