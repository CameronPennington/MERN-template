import React, { useState, useEffect, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import ErrorSnackbar from "./ErrorSnackbar";

import { setErrors } from "../actions/error";

import { getSteps, addStep, editStep, deleteStep } from "../actions/task";

const useStyles = makeStyles((theme) => ({
	helperText: {
		container: "MuiFormHelperText-contained",
	},
	stepButton: {
		margin: "0 0.75rem 0 0.75rem",
	},
	stepButtons: {
		display: "inline-flex",
	},
	stepImage: {
		maxWidth: "100%",
	},
	stepImageBox: {
		display: "inline-flex",
		flex: 1,
		justifyContent: "center",
	},
	stepMedia: {
		display: "flex",
		marginBottom: "2rem",
		marginTop: "1rem",
	},
	stepTextBox: {
		display: "inline-flex",
		flex: 1,
		paddingLeft: "0.75rem",
	},
	stepTop: {
		display: "flex",
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
	taskHeader: {
		display: "flex",
		marginBottom: "2rem",
	},
	taskTitleBox: {
		flex: 1,
	},
}));

export const TaskView = (props) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [taskName, setTaskName] = useState("");
	const [stepList, setStepList] = useState([]);

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		getSteps(props.match.params.taskId)
			.then(({ steps, taskName }) => {
				setStepList(steps);
				setTaskName(taskName);
			})
			.catch((err) => {
				dispatch(setErrors(err));
			});
	}, []);

	const AddStepDialog = () => {
		const [open, setOpen] = useState(false);
		const [stepText, setStepText] = useState("");
		const [media, setMedia] = useState(null);
		const [mediaHelperText, setMediaHelperText] = useState("");
		const handleClickOpen = () => {
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
		};
		const handleStepSubmit = (e) => {
			e.preventDefault();
			const { taskId } = props.match.params;
			const stepData = new FormData();

			stepData.append("text", stepText);
			stepData.append("media", media);

			addStep(taskId, stepData)
				.then(({ steps }) => {
					setStepList(steps);
				})
				.catch((err) => {
					dispatch(setErrors(err));
				});
			setOpen(false);
		};

		const handleFileSubmit = (e) => {
			//limit size to 1MB
			if (e.target.files.length > 0 && e.target.files[0].size > 1000000) {
				//delete file
				e.target.value = null;
				setMedia(null);
				setMediaHelperText("File size is limited to 1MB");
			} else {
				setMediaHelperText("");
				setMedia(e.target.files[0]);
			}
		};

		return (
			<div>
				<Button
					aria-label="Add Step"
					variant="outlined"
					color="primary"
					onClick={handleClickOpen}
				>
					Add Step
				</Button>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">New Step</DialogTitle>
					<DialogContent>
						<form noValidate onSubmit={handleStepSubmit} id="add-new-step">
							{/* TODO: reduce vertical spacing in ContentText */}
							{/* and make larger text input */}
							<DialogContentText>
								To add a step, write the text below
							</DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								id="text"
								label="Text"
								fullWidth
								onChange={(e) => setStepText(e.target.value)}
								inputProps={{ maxlength: 180 }}
								multiline
								rows="3"
								variant="outlined"
							/>
							<Input
								endAdornment={
									<InputAdornment position="end">.jpg .png</InputAdornment>
								}
								error={mediaHelperText.length > 0}
								onChange={handleFileSubmit}
								type="file"
								inputProps={{
									"aria-label": "helper-image",
									accept: "image/*",
								}}
							/>

							{mediaHelperText.length > 0 && (
								<FormHelperText error>{mediaHelperText}</FormHelperText>
							)}
						</form>
					</DialogContent>
					<DialogActions>
						<Button
							aria-label="Cancel Add Step"
							onClick={handleClose}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							aria-label="Submit Add Step"
							type="submit"
							color="primary"
							disabled={stepText.length === 0}
							form="add-new-step"
						>
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};

	const EditDialog = (props) => {
		const [editOpen, setEditOpen] = useState(false);
		const [editStepText, setEditStepText] = useState(props.text);
		const [media, setMedia] = useState(null);
		const [mediaHelperText, setMediaHelperText] = useState("");
		const [deleteMedia, setDeleteMedia] = useState(false);

		//TODO: change text onChange handler to clear media errors
		const handleEditOpen = () => {
			setEditOpen(true);
		};
		const handleEditClose = () => {
			setEditOpen(false);
		};
		const handleEditSubmit = (e) => {
			e.preventDefault();
			const { stepId, taskId } = props;
			const stepData = new FormData();

			stepData.append("text", editStepText);
			media && stepData.append("media", media);
			props.media && stepData.append("cloudId", props.media.cloudId);
			deleteMedia && stepData.append("deleteMedia", deleteMedia);

			editStep(taskId, stepId, stepData)
				.then(({ steps }) => {
					setStepList(steps);
				})
				.catch((err) => {
					dispatch(setErrors(err));
				});
			setEditOpen(false);
		};
		const handleCheck = (e) => {
			setDeleteMedia(e.target.checked);
		};
		const handleFileSubmit = (e) => {
			if (e.target.files.length > 0 && e.target.files[0].size > 1000000) {
				e.target.value = null;
				setMedia(null);
				setMediaHelperText("File size is limited to 1MB");
			} else {
				setMediaHelperText("");
				setMedia(e.target.files[0]);
			}
		};
		//TODO: change submit edit button so that it is disabled when editText matches prop.text
		return (
			<>
				<Button
					aria-label="Edit Step"
					className={classes.stepButton}
					variant="outlined"
					color="primary"
					onClick={handleEditOpen}
				>
					Edit Step
				</Button>
				<Dialog open={editOpen} onClose={handleEditClose}>
					<DialogTitle>Edit text?</DialogTitle>
					<DialogContent>
						<form noValidate onSubmit={handleEditSubmit} id="edit-step-text">
							<TextField
								autoFocus
								margin="dense"
								id="text"
								label="Text"
								fullWidth
								onChange={(e) => setEditStepText(e.target.value)}
								value={editStepText}
								inputProps={{ maxlength: 180 }}
								multiline
								rows="3"
								variant="outlined"
							/>
							<Input
								endAdornment={
									<InputAdornment position="end">.jpg .png</InputAdornment>
								}
								error={mediaHelperText.length > 0}
								onChange={handleFileSubmit}
								type="file"
								inputProps={{
									"aria-label": "helper-image",
									accept: "image/*",
								}}
							/>

							{mediaHelperText.length > 0 && (
								<FormHelperText error>{mediaHelperText}</FormHelperText>
							)}

							{props.media && (
								<FormControlLabel
									label="Remove current image"
									control={
										<Checkbox
											disableRipple
											checked={deleteMedia}
											onChange={handleCheck}
											inputProps={{ "aria-label": "primary checkbox" }}
										/>
									}
								></FormControlLabel>
							)}

							<DialogActions>
								{" "}
								<Button
									aria-label="Cancel Step Edit"
									color="primary"
									onClick={handleEditClose}
								>
									Cancel
								</Button>
								<Button
									aria-label="Submit Step Edit"
									color="primary"
									type="submit"
									form="edit-step-text"
									disabled={editStepText.length === 0}
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
			const { taskId, stepId } = props;
			deleteStep(taskId, stepId)
				.then(({ steps }) => {
					setStepList(steps);
				})
				.catch((err) => {
					dispatch(setErrors(err));
				});
		};

		return (
			<>
				<Button
					aria-label="Delete Step"
					className={classes.stepButton}
					variant="outlined"
					color="primary"
					onClick={handleDeleteOpen}
				>
					Delete Step
				</Button>
				<Dialog open={deleteOpen} onClose={handleDeleteClose}>
					<DialogContent>
						<form noValidate onSubmit={handleDeleteSubmit} id="delete-step">
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogActions>
								{" "}
								<Button
									aria-label="Cancel Delete Step"
									color="primary"
									onClick={handleDeleteClose}
								>
									Cancel
								</Button>
								<Button
									aria-label="Confirm Delete Step"
									autoFocus
									color="primary"
									type="submit"
									form="delete-step"
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

	const Step = (props) => {
		// console.log("rendered");
		return (
			<>
				<Box className={classes.stepTop}>
					<Box className={classes.stepTextBox}>
						<Typography>{props.text}</Typography>
					</Box>
					<Box className={classes.stepButtons}>
						<EditDialog
							media={props.media}
							stepId={props.stepId}
							taskId={props.taskId}
							text={props.text}
						/>
						<DeleteDialog stepId={props.stepId} taskId={props.taskId} />
					</Box>
				</Box>

				<Box className={classes.stepMedia}>
					<Box className={classes.stepImageBox}>
						{props.media && (
							<img className={classes.stepImage} src={props.media.url} />
						)}
					</Box>
				</Box>
			</>
		);
	};

	//TODO: AddStepDialog does not submit on enter, but rather adds a return to the textfield
	return (
		<>
			<CssBaseline />
			<Container>
				<Box className={classes.taskHeader}>
					<Box className={classes.taskTitleBox}>
						<Typography variant={matches ? "h5" : "h4"}>{taskName}</Typography>
					</Box>
					<AddStepDialog taskId={props.match.params.taskId} />
				</Box>
				<Paper>
					{stepList &&
						stepList.length > 0 &&
						stepList.map((step, i) => (
							<>
								{i > 0 && <Divider variant="middle" />}
								<Step
									key={step._id}
									media={step.media}
									stepId={step._id}
									taskId={props.match.params.taskId}
									text={step.text}
								/>
							</>
						))}
					<ErrorSnackbar errors={props.errors} />
				</Paper>
			</Container>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps)(TaskView);
