import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Alert, Spinner, InputGroup, Button } from 'react-bootstrap';
import AxiosInstance from '../Axios';

export class Login extends Component {
constructor(props) {
super(props);

    this.state = {
        username: '',
        password: '',
        showPassword: false,
        loading: false,
        error: '',
        redirect: false,
    };
}

componentDidMount() {
    // Si une session existe déjà, éviter de redemander les identifiants.
    const token = localStorage.getItem('token');

    if (token) {
        this.setState({ redirect: true });
    }
}

handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
        [name]: value,
        error: '',
    });
};

togglePassword = () => {
    this.setState((prevState) => ({
        showPassword: !prevState.showPassword,
    }));
};

handleSubmit = async (event) => {
    event.preventDefault();

    const { username, password } = this.state;

    if (!username.trim() || !password) {
        this.setState({
            error: 'Veuillez renseigner votre nom d’utilisateur et votre mot de passe.',
        });
        return;
    }

    this.setState({
        loading: true,
        error: '',
    });

    try {
        const response = await AxiosInstance.post('login/', {
            username: username.trim(),
            password: password,
        });

        console.log("Réponse de connexion :", response.data);

        const data = response.data;

        // if (data.token) {
        //     localStorage.setItem("token", data.token);
        // }

        // if (data.user) {
        //     localStorage.setItem("user", JSON.stringify(data.user));
        // }

        if (!data.token) {
            throw new Error(
                'Le serveur n’a pas retourné de token. Vérifiez la configuration de l’API.'
            );
        }

        // Enregistrer les informations de session.
        localStorage.setItem('token', data.token);

        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        /*
         * Le backend doit retourner un utilisateur contenant son rôle,
         * par exemple :
         * {
         *   "id": 1,
         *   "username": "admin",
         *   "role": "administrateur"
         * }
         *
         * Le rôle ne doit pas être déduit uniquement du formulaire.
         */

        this.setState({
            loading: false,
            redirect: true,
        });
    } catch (error) {
        let errorMessage =
            'Impossible de se connecter. Veuillez réessayer.';

        if (error.response) {
            const data = error.response.data;

            if (data.detail) {
                errorMessage = data.detail;
            } else if (data.non_field_errors) {
                errorMessage = data.non_field_errors.join(' ');
            } else if (data.username || data.password) {
                errorMessage = 'Nom d’utilisateur ou mot de passe incorrect.';
            } else if (error.response.status === 401) {
                errorMessage = 'Identifiants incorrects ou session refusée.';
            } else if (error.response.status >= 500) {
                errorMessage = 'Une erreur est survenue sur le serveur.';
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        this.setState({
            loading: false,
            error: errorMessage,
        });
    }
};

render() {
    const {
        username,
        password,
        showPassword,
        loading,
        error,
        redirect,
    } = this.state;

    if (redirect) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
                <div className="col-lg-4 col-md-6 col-sm-10 mx-auto">
                    <div className="card text-left py-5 px-4 px-sm-5 shadow-sm">
                        <div className="brand-logo mb-3">
                            {/* Ajoute ici le logo de SABA si nécessaire. */}
                        </div>

                        <h4>Bonjour, bienvenue sur SABA</h4>
                        <h6 className="font-weight-light mb-4">
                            Connectez-vous pour accéder à votre espace.
                        </h6>

                        {error && (
                            <Alert
                                variant="danger"
                                dismissible
                                onClose={() => this.setState({ error: '' })}
                            >
                                {error}
                            </Alert>
                        )}

                        <Form className="pt-2" onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nom d’utilisateur</Form.Label>

                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <i className="mdi mdi-account-outline" />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Entrez votre nom d’utilisateur"
                                        size="lg"
                                        className="h-auto"
                                        value={username}
                                        onChange={this.handleChange}
                                        autoComplete="username"
                                        required
                                        disabled={loading}
                                        autoFocus
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mot de passe</Form.Label>

                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <i className="mdi mdi-lock-outline" />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Entrez votre mot de passe"
                                        size="lg"
                                        className="h-auto"
                                        value={password}
                                        onChange={this.handleChange}
                                        autoComplete="current-password"
                                        required
                                        disabled={loading}
                                    />

                                    <InputGroup.Append>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={this.togglePassword}
                                            aria-label={
                                                showPassword
                                                    ? 'Masquer le mot de passe'
                                                    : 'Afficher le mot de passe'
                                            }
                                            disabled={loading}
                                        >
                                            <i
                                                className={
                                                    showPassword
                                                        ? 'mdi mdi-eye-off-outline'
                                                        : 'mdi mdi-eye-outline'
                                                }
                                            />
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="mr-2"
                                            />
                                            Connexion en cours...
                                        </>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </Button>
                            </div>

                            <div className="my-3 d-flex justify-content-end align-items-center">
                                <Link
                                    to="/user-pages/forgot-password"
                                    className="auth-link text-muted"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <div className="text-center mt-4 font-weight-light">
                                Vous n’avez pas de compte ?{' '}
                                <Link
                                    to="/user-pages/register"
                                    className="text-primary"
                                >
                                    Créer un compte
                                </Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

}

export default Login;
