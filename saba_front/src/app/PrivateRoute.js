// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const getCurrentUser = () => {
// const token = localStorage.getItem('token');
// const storedUser = localStorage.getItem('user');

// if (!token || !storedUser) {
//     return null;
// }

// try {
//     return JSON.parse(storedUser);
// } catch (error) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     return null;
// }

// };

// const PrivateRoute = ({
// component: Component,
// adminOnly = false,
// ...rest
// }) => {
// return (
// <Route
// {...rest}
// render={(props) => {
// const user = getCurrentUser();

//             // L'utilisateur doit être connecté.
//             if (!user) {
//                 return (
//                     <Redirect
//                         to={{
//                             pathname: '/user-pages/login',
//                             state: { from: props.location },
//                         }}
//                     />
//                 );
//             }

//             // Compatibilité avec plusieurs formats possibles du rôle.
//             const role = String(
//                 user.role || user.profil || ''
//             ).toLowerCase();

//             const isAdmin =
//                 role === 'administrateur' ||
//                 role === 'admin' ||
//                 user.is_staff === true ||
//                 user.is_superuser === true;

//             // Une page réservée à l'administration
//             // ne doit pas être accessible à un utilisateur normal.
//             if (adminOnly && !isAdmin) {
//                 return <Redirect to="/dashboard" />;
//             }

//             return <Component {...props} />;
//         }}
//     />
// );

// };

// export default PrivateRoute;


// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const getCurrentUser = () => {
// const token = localStorage.getItem('token');
// const storedUser = localStorage.getItem('user');

// if (!token || !storedUser) {
//     return null;
// }

// try {
//     return JSON.parse(storedUser);
// } catch (error) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     return null;
// }

// };

// const PrivateRoute = ({
// component: Component,
// adminOnly = false,
// ...rest
// }) => (
// <Route
// {...rest}
// render={(props) => {
// const user = getCurrentUser();

//         if (!user) {
//             return (
//                 <Redirect
//                     to={{
//                         pathname: '/user-pages/login-1',
//                         state: { from: props.location },
//                     }}
//                 />
//             );
//         }

//         const role = String(
//             user.role || user.profil || ''
//         ).toLowerCase();

//         const isAdmin =
//             role === 'administrateur' ||
//             role === 'admin' ||
//             user.is_staff === true ||
//             user.is_superuser === true;

//         if (adminOnly && !isAdmin) {
//             return <Redirect to="/dashboard" />;
//         }

//         return <Component {...props} />;
//     }}
// />

// );

// export default PrivateRoute;


import React from "react";
import { Route, Redirect } from "react-router-dom";

const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
    }
};

export const isAdministrator = (user) => {
    if (!user) return false;

    return (
        String(user.role || "").trim().toLowerCase() === "administrateur"
    );
};

const PrivateRoute = ({
    component: Component,
    adminOnly = false,
    ...rest
}) => (
    <Route
        {...rest}
        render={(props) => {
            const user = getCurrentUser();

            // L'utilisateur doit être connecté.
            if (!user) {
                return (
                    <Redirect
                        to={{
                            pathname: "/user-pages/login-1",
                            state: { from: props.location },
                        }}
                    />
                );
            }

            // Certaines pages sont réservées aux administrateurs.
            if (adminOnly && !isAdministrator(user)) {
                return <Redirect to="/dashboard" />;
            }

            return <Component {...props} />;
        }}
    />
);

export default PrivateRoute;

