// import axios from "axios";

// const AxiosInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000/",
//     timeout: 5000,
//     headers: {
//         // "Content-Type": "application/json",
//         accept: "application/json",
//     },
// });

// export default AxiosInstance;


import axios from "axios";

const AxiosInstance = axios.create({
baseURL: "http://127.0.0.1:8000/",
timeout: 10000,
headers: {
accept: "application/json",
},
});

// Ajouter automatiquement le token aux requêtes protégées.
AxiosInstance.interceptors.request.use(
(config) => {
const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
},
(error) => Promise.reject(error)

);

// Gérer les erreurs d'authentification.
AxiosInstance.interceptors.response.use(
(response) => response,
(error) => {
const status = error.response?.status;
const requestUrl = error.config?.url || "";

    // Une erreur de connexion ne doit pas provoquer de redirection.
    const isLoginRequest = requestUrl.includes("/login/");

    if (status === 401 && !isLoginRequest) {
        // Le token est refusé ou la session n'est plus valide.
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Éviter une boucle de redirection.
        if (window.location.pathname !== "/user-pages/login-1") {
            window.location.replace("/user-pages/login-1");
        }
    }

    // Une erreur 403 signifie généralement que l'utilisateur
    // est authentifié, mais qu'il ne dispose pas des droits nécessaires.
    // On conserve sa session et on laisse le composant gérer le message.

    return Promise.reject(error);
}

);

export default AxiosInstance;
