import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
import { withTranslation } from 'react-i18next';

class App extends Component {
state = {
isFullPageLayout: false,
};

componentDidMount() {
    this.onRouteChanged();
}

componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
        this.onRouteChanged();
    }
}

onRouteChanged() {
    const { i18n, location } = this.props;
    const body = document.querySelector('body');

    if (location.pathname === '/layout/RtlLayout') {
        body.classList.add('rtl');
        i18n.changeLanguage('ar');
    } else {
        body.classList.remove('rtl');
        i18n.changeLanguage('en');
    }

    window.scrollTo(0, 0);

    const fullPageLayoutRoutes = [
        '/user-pages/login',
        '/user-pages/login-1',
        '/user-pages/login-2',
        '/user-pages/register',
        '/user-pages/register-1',
        '/user-pages/register-2',
        '/user-pages/lockscreen',
        '/error-pages/error-404',
        '/error-pages/error-500',
        '/general-pages/landing-page',
    ];

    const isFullPageLayout = fullPageLayoutRoutes.includes(
        location.pathname
    );

    this.setState({ isFullPageLayout });

    const pageBodyWrapper = document.querySelector('.page-body-wrapper');

    if (pageBodyWrapper) {
        pageBodyWrapper.classList.toggle(
            'full-page-wrapper',
            isFullPageLayout
        );
    }
}

render() {
    const { isFullPageLayout } = this.state;

    return (
        <div className="container-scroller">
            {!isFullPageLayout && <Sidebar />}

            <div className="container-fluid page-body-wrapper">
                {!isFullPageLayout && <Navbar />}

                <div className="main-panel">
                    <div className="content-wrapper">
                        <AppRoutes />
                    </div>

                    {!isFullPageLayout && <Footer />}
                </div>
            </div>
        </div>
    );
}

}

export default withTranslation()(withRouter(App));
