import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authServices } from "../utils/api/auth/services";
import snackBarUtil from "./Layout/snackBarUtil";
import "./Login.css"

interface RegisterInterface {
  username?: string;
  password?: string;
}

const Register = () => {
  const [open, setOpen] = useState(false);
  const [newCredAfterRegister, setNewCredAfterRegister] = useState<RegisterInterface | null>(null);
  const navigate = useNavigate();
  const [selfAllowedd, SetselfAllowedd] = useState();

  const [register, setRegistration] = useState<any>({
    username: "",
    password: "",
    mobile: "",
    confirmPassword: "",
    appUrl: "",
  });
  //   const [password, setPassword] = useState("");
  const [symbolsArrMail] = useState(["e", "E", "+", "-", "."]);

  const handleClick = async () => {

    if (register.username === "" && register.mobile === "" && register.password === "" && register.confirmPassword === "") {
      return snackBarUtil.error("Please enter all the mandatory details");
    } else if (register?.password !== "" && register?.mobile === "" && register?.username !== "" && register?.confirmPassword !== "") {
      return snackBarUtil.error(" invalid mobile number");
    } else if (register?.password === "" && register?.mobile !== "" && register?.username !== "" && register?.confirmPassword !== "") {
      return snackBarUtil.error("invalid password ");
    } else if (register?.password !== "" && register?.mobile !== "" && register?.username !== "" && register?.confirmPassword === "") {
      return snackBarUtil.error("invalid Confirm password");
    } else if (register.password !== register.confirmPassword) {
      return snackBarUtil.error("Password does not match!!");
    } else {
      const { response } = await authServices.registeration({
        ...register,
        userId: register.username,
      });

      if (response?.status) {
        snackBarUtil.success(response.message);
        setOpen(true);
        setNewCredAfterRegister(response);
        // navigate("/sign-in", { replace: true });
      } else {
      }
    }
  };
  const handleClickLogin = () => {
    navigate("/sign-in")

  }
  const handleChange = (e: any) => {
    setRegistration({
      ...register,
      [e.target.name]: e.target.value,
      appUrl: window.location.hostname,
    });
  };
  useEffect(() => {
    let appUrll = window.location.hostname;
    // let appUrll = "localhost";
    axios
      .post(
        "https://api.247365.exchange/admin-new-apis/login/is-self-by-app-url",
        { appUrl: appUrll }
      )
      .then((res) => {
        console.log(res, "dadasdas")
        SetselfAllowedd(res?.data?.data?.logo);
      });
  }, []);

  return (
    <Box
    // // maxWidth={"450px"}
    // mx="auto"
    // mb="2em"
    // p="2em"
    // display={"flex"}
    // flexDirection="column"
    // gap={"1.5em"}
    >
      <Dialog
        onClose={() => {
          setOpen(false);
          navigate("/sign-in", { replace: true });
        }}
        open={open}
      >
        <DialogContent>
          <Grid container my={2} py={2} px={2} borderRadius={1} rowGap={6}>
            <Grid item xs={6}>
              Username:
            </Grid>
            <Grid item xs={6}>
              {newCredAfterRegister?.username}
            </Grid>
            <Grid item xs={6}>
              Password:
            </Grid>
            <Grid item xs={6}>
              {newCredAfterRegister?.password}
            </Grid>
          </Grid>
          <Typography color="error.main">
            Please save these details and login with this username and password.
          </Typography>
        </DialogContent>
      </Dialog>
      <div className="loginBackground new-login-content ">
        <div className="logo-img">
          <img src={selfAllowedd} alt="" className="logoimgggggg" />
        </div>
        <div className="login-form">
          <span className="login-text">Sign up </span>
          <input className="sign-Input"
            required
            placeholder="User Name"
            name="username"

            value={register?.username}
            onChange={handleChange}
          />

          <input className="sign-Input"
            required
            name="mobile"
            placeholder="Mobile No"
            type="number"
            value={register?.mobile}
            onChange={handleChange}

            onKeyDown={(e) =>
              symbolsArrMail.includes(e.key) && e.preventDefault()
            } />
          <input className="sign-Input"
            required
            name="password"
            placeholder="Password"
            type="password"
            value={register?.password}
            onChange={handleChange}
          />
          <input className="sign-Input"
            required
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={register?.confirmPassword}
            onChange={handleChange}
          />
          <div className="login_main" onClick={handleClick}>
            <button className="login-Button">
              Sign Up
            </button>
            <div>

              {/* <LoginIcon /> */}
            </div>
          </div>

        </div>
      </div>
    </Box>
  );
};

export default Register;
