import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { clearMessages } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Header = (props) => {
	const { isFetching, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();
	const [fullName, setFullName] = useState("");

	useEffect(() => {
		props.user.fname &&
			setFullName(`${props.user.fname} ${props.user.lname}`);
	}, [fullName, props.user.fname, props.user.lname]);

	const handleBack = () => {
		if (props.hasOwnProperty("toggleFrame")) {
			props.toggleFrame();
		} else {
			navigate("/");
		}
	};

	const handleButton = () => {
		console.log("button Click")
		if (props.hasOwnProperty("toggleWarning")) {
			console.log("Toggle warning")
			props.toggleWarning();
		} else {
			props.isEmpty &&
				clearMessages(axiosPrivate, props.user.user_id, dispatch).then(
					() => {
						props.setMessages([]);
					}
				);
		}
	};

	return (
		<header>
			<div className="content">
				<div className="back-icon" onClick={handleBack}>
					<i className="fas fa-arrow-left"></i>
				</div>
				<img
					src={
						props.user?.profil_pic
							? imageUrl + props.user?.profil_pic
							: PF + "default.png"
					}
					alt="proPic"
				/>
				<div className="details">
					<span className={isFetching ? "skelton" : ""}>
						{!isFetching &&
							(fullName
								? fullName
								: props.user?.fname + " " + props.user?.lname)}
					</span>
					<p className={isFetching ? "skelton" : ""}>
						{!isFetching && (props.user?.status ? "Online" : "Offline")}
					</p>
				</div>
			</div>
			<button onClick={() => handleButton()} className="delete">
				{props.hasOwnProperty("logUserId") ? (
					isFetching ? (
						<CircularProgress
							style={{ color: "#2740c9", width: "15px", height: "15px" }}
						/>
					) : (
						"Clear Chat"
					)
				) : (
					"Delete"
				)}
			</button>
		</header>
	);
};

export default memo(Header);
