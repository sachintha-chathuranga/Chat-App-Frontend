import { UpdateFailure } from "../context/AuthContext/AuthActions";

const handleError = (err,dispatch) => {
	if (!err?.response) {
		dispatch(UpdateFailure('Server does not respond!'));
	} else if (err.response?.data) {
		dispatch(UpdateFailure(err.response.data));
	} else {
		dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
	}
};

export default handleError;
