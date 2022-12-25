import { Button,LinearProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import {Link,useHistory} from "react-router-dom"
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css"

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    confirmPassword:""
  })
  const history = useHistory();

  const handleInput = (event) => {
     const value = event.target.value;
     const name = event.target.name;

    setFormData((preValue) => {
      return{
        ...preValue, [name]:value
      };
    })
  }

    const register = async (formData) => {
      if(!validateInput(formData)){
        return
      };
      try{
        setLoading(true)
        await axios.post(`${config.endpoint}/auth/register`,{
          username: formData.username,
          password: formData.password,
        });
        setLoading(false)
        setFormData({
          username:"",
          password:"",
          confirmPassword:""
        });
        enqueueSnackbar("Registered Successfully",{variant:"success"});
        history.push("/login");
      } catch(error) {
        setLoading(false)
        if(error.response && error.response.status === 400){
          enqueueSnackbar(error.response.data.message,{variant:"error"});
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant:"error"}
          );
        }
      }
   };


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(!data.username){
      enqueueSnackbar("Username is a required field",{variant:"warning"});
      return false;
    }
    if(data.username.length < 6){
      enqueueSnackbar("Username must be greater then 6 characters",{variant:"warning"});
      return false;
    }
    if(!data.password){
      enqueueSnackbar("Password is a required field",{variant:"warning"});
      return false;
    }
    if(data.password.length < 6){
      enqueueSnackbar("Password must be strong and greater then 6 characters",{variant:"warning"});
      return false;
    }
    if(data.password !== data.confirmPassword){
      enqueueSnackbar("Passwords do not match",{variant:"warning"});
      return false;
    }
    return true;
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons/>
      <Box className="content">
        <Stack spacing={2} className="form" >
          <h2 className="title">Register</h2>
          <TextField
            autoComplete="false"
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={formData.username}
            onChange={handleInput}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            autoComplete="false"
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInput}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            autoComplete="false"
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInput}
            type="password"
            fullWidth
          />
           {
            loading ? 
            (<Box alignitem="center" style={{marginBottom: -10, marginTop: 30}}>
              {/* <CircularProgress size={25} color="primary"/> */}
              <LinearProgress color="success"/>
            </Box>) : (<Button className="button" variant="contained"
           onClick={() => {register(formData)}}>
            Register Now
           </Button>)
           }
          <p className="secondary-action">
            Already have an account?{"  "}
             <Link className="link" to="/login">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
