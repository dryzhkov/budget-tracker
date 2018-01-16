import React from 'react';
import LoginForm from './LoginForm';
import AuthRepo from '../repositories/AuthRepo';
import Auth from '../common/Auth';
class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;
  
    AuthRepo.login(email, password)
      .then(response => {
        if (response.success) {
          this.setState({
            errors: {}
          });

          // save the token
          Auth.authenticateUser(response.token);

          // redirect to /
          this.props.history.push('/');
        } else {
          // change the component state
          const errors = response.errors ? response.errors : {};
          errors.summary = response.message;

          this.setState({
            errors: errors
          });
        }
      })
      .catch(error => {
        this.setState({
          errors: error
        });
      });
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

export default LoginPage;