import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";

import { setErrors } from "../actions/error";

const ErrorSnackbar = (props) => {
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	useEffect(() => {
		if (Object.keys(props.errors).length > 0) {
			setOpen(true);
		}
	}, [props.errors]);

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

export default ErrorSnackbar;
