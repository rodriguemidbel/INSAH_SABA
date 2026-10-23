import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';

class ProtectedRoute extends Component {

  renderRoute = context => {

    const {
      user,
      isAuthenticated
    } = context;

    const {
      component: ComponentToRender,
      requiredRole,
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props => {

          if (!isAuthenticated) {
            return (
              <Redirect to="/user-pages/login-1" />
            );
          }

          if (
            requiredRole &&
            (!user || user.role !== requiredRole)
          ) {
            return (
              <Redirect to="/error-pages/error-404" />
            );
          }

          return (
            <ComponentToRender {...props} />
          );
        }}
      />
    );
  };

  render() {
    return (
      <AuthContext.Consumer>
        {this.renderRoute}
      </AuthContext.Consumer>
    );
  }
}

export default ProtectedRoute;