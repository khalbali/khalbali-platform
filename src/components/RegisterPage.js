import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FaFacebookF} from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import loginStyle from '.././styles/form.module.css';
import { Link } from 'react-router-dom';

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

import { startRegister } from '../actions/auth';
import { createLoadingAndErrorSelector } from '../selectors';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      doNotMatchError: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { password, confirmPassword } = this.state;
    if (
      prevState.password !== password ||
      prevState.confirmPassword !== confirmPassword
    ) {
      this.setState({ doNotMatchError: '' });
    }
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { username, password, confirmPassword } = this.state;
      const { startRegister, history, location } = this.props;
      if (password !== confirmPassword) {
        return this.setState({ doNotMatchError: 'Passwords do not match' });
      }
      await startRegister(username, password);
      const { error } = this.props;
      if (!error) {
        history.push(
          (location && location.state && location.state.prevPathname) || '/'
        );
      }
    } catch (e) {}
  };

  render() {
    const { username, password, confirmPassword, doNotMatchError, checkBox } = this.state;
    const { isLoading, error } = this.props;
    return (
      <Box w={300} m="auto">
        {error && (
          <Alert status="error" mb={2}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <div className={loginStyle.header1}>
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
          <Stack spacing={3} m={10}>
            <FormControl className={loginStyle.formText}>
            Username
              <Input
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                id="username-input"
                variant="filled"
                type="text"
                placeholder="username"
                size="md"
                isRequired className={loginStyle.inputText}
              />
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
            <FormControl isInvalid={doNotMatchError} className={loginStyle.formText}>
           Confirm Password
              <Input
                value={confirmPassword}
                onChange={(e) =>
                  this.setState({ confirmPassword: e.target.value })
                }
                id="confirm-password-input"
                variant="filled"
                type="password"
                placeholder="*******"
                size="md"
                isRequired className={loginStyle.inputText}
              />
              {/* <FormErrorMessage>{doNotMatchError}</FormErrorMessage> */}
            </FormControl>

            <Flex color="#303344" fontWeight="bold">
              <Checkbox
                value={checkBox}
                size="md"
                isRequired borderColor="black" mr={2}
              /> Remember me

              <Link style={{marginLeft:"120px"}} >Forgot Password</Link>

            </Flex>

            <Button type="submit" isLoading={isLoading} backgroundColor="#2172cd">
              Register
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
  ['REGISTER'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startRegister: (username, password) =>
    dispatch(startRegister(username, password)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
);


