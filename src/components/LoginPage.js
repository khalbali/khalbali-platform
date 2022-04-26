import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FaFacebookF} from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import loginStyle from '.././styles/form.module.css';

import {
  Box,
  Stack,
  FormControl,
  Input,
  Button,
  Alert,
  AlertIcon,
  color,
  Checkbox,
  Flex,
  Image
} from '@chakra-ui/react';

import { createLoadingAndErrorSelector } from '../selectors';
import { login, startLogin } from '../actions/auth';
import { Link } from 'react-router-dom';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const { startLogin, location, history } = this.props;
    await startLogin(username, password);
    const { error } = this.props;
    if (!error) {
      history.push(
        (location && location.state && location.state.prevPathname) || '/'
      );
    }
  };

  render() {
    const { username, password,checkBox } = this.state;
    const { isLoading, error, location } = this.props;
    const requireAuth =
      location && location.state && location.state.requireAuth;
    return (
      <Box w={300} m="auto">
        {requireAuth && (
          <Alert status="warning" mb={2}>
            <AlertIcon />
            {requireAuth}
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={2}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <div className={loginStyle.header}>
        <Image boxSize={55} src="logo-white.png" alt="logo" m={5} pt={3}/>
        <div>
        <h1 className={loginStyle.heading}>
        Welcome to Forum 19
        </h1>
        <p className={loginStyle.pera}>
        Log into your account to unlock true power of community.
        </p>
        <hr></hr>
        </div>
        <form onSubmit={this.handleSubmit}>
          <Stack spacing={3} m={10} >
            <FormControl className={loginStyle.formText} >
            Username
              <Input
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                id="username-input"
                variant="filled"
                type="text"
                placeholder="azyxcd"
                size="md"
                isRequired className={loginStyle.inputText} />
            </FormControl>
            <FormControl className={loginStyle.formText}>
            Password
              <Input
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                id="password-input"
                variant="filled"
                type="password"
                placeholder="*******"
                size="md"
                isRequired className={loginStyle.inputText}
              />
            </FormControl>

            <Flex color="#303344" fontWeight="bold">
              <Checkbox
                value={checkBox}
                size="md"
                isRequired borderColor="black" mr={2}
              /> Remember me

              <Link style={{marginLeft:"120px"}} >Forgot Password</Link>

            </Flex>
            <Button type="submit" isLoading={isLoading || null} backgroundColor="#2172cd">
              Login
            </Button>
            <p style={{color:"#666f74"}} >Or login with social network</p>

            <div style={{position:"relative"}}>

            <Button backgroundColor="#3b5998" width="170px">
               <FaFacebookF/>Facebook
            </Button>
            <Button backgroundColor="#00aced" width="170px" ml="40px">
             <AiOutlineTwitter/> Twitter
            </Button>
            </div>
           <p style={{color:"#666f74"}}>Don’t have an account? 
           <Link to='#' className={loginStyle.term}>Signup Here</Link>
           </p> 
           <h5 className={loginStyle.h5}>By Logging in, signing in or continuing, I agree to Forum19’s <Link to='#' className={loginStyle.term}> Terms of Use</Link> and <Link to='#' className={loginStyle.term}>Privacy Policy</Link>.</h5>
          
          
          

          </Stack>
         
        </form>
        </div>
      </Box>
    );
  }
}

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['LOGIN'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLogin: (username, password) => dispatch(startLogin(username, password)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginPage)
);


