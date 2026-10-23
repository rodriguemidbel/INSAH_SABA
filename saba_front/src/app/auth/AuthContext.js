import React, { createContext, Component } from 'react';

export const AuthContext = createContext();

class AuthProvider extends Component {

  constructor(props) {
    super(props);

    const storedUser = localStorage.getItem('saba_user');

    this.state = {
      user: storedUser ? JSON.parse(storedUser) : null,
      loading: false
    };
  }

  login = user => {
    localStorage.setItem('saba_user', JSON.stringify(user));

    this.setState({
      user
    });
  };

  logout = () => {
    localStorage.removeItem('saba_user');

    this.setState({
      user: null
    });
  };

  render() {

    const {
      user,
      loading
    } = this.state;

    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          login: this.login,
          logout: this.logout,
          isAuthenticated: !!user,
          isAdmin: user && user.role === 'ADMIN'
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;