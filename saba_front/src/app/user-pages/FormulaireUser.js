import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import AxiosInstance from "../Axios";

function FormulaireUser() {
    const history = useHistory();

    const [groupes, setGroupes] = useState([]);

    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        phone: "",
        departement: "",
        job: "",
        usergroup: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState("");

    // Charger les groupes disponibles
    useEffect(() => {
        AxiosInstance.get("usergroups/")
            .then((response) => {
                const data = response.data;
                setGroupes(Array.isArray(data) ? data : data.results || []);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des groupes :", error);
                setErreur(
                    "Impossible de charger les groupes. Vérifie tes permissions."
                );
            });
    }, []);

    // Mettre à jour les champs du formulaire
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Envoyer le formulaire au backend
    const handleSubmit = async (event) => {
        event.preventDefault();

        setErreur("");
        setSucces("");

        if (formData.password.length < 8) {
            setErreur("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setErreur("Les deux mots de passe ne correspondent pas.");
            return;
        }

        if (!formData.usergroup) {
            setErreur("Veuillez sélectionner un groupe d'utilisateurs.");
            return;
        }

        const donnees = {
            username: formData.username.trim(),
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            departement: formData.departement.trim(),
            job: formData.job.trim(),
            usergroup: Number(formData.usergroup),
            is_active: formData.is_active,
        };

        try {
            setLoading(true);

            await AxiosInstance.post("users/", donnees);

            setSucces("L'utilisateur a été créé avec succès.");

            setTimeout(() => {
                history.push("/user-pages/liste-user");
            }, 1000);
        } catch (error) {
            console.error("Erreur lors de la création :", error);

            const data = error.response?.data;

            if (data && typeof data === "object") {
                const messages = Object.entries(data)
                    .map(([champ, message]) => {
                        const detail = Array.isArray(message)
                            ? message.join(" ")
                            : typeof message === "string"
                            ? message
                            : JSON.stringify(message);

                        return `${champ} : ${detail}`;
                    })
                    .join(" | ");

                setErreur(
                    messages || "Impossible de créer cet utilisateur."
                );
            } else {
                setErreur(
                    "Impossible de contacter le serveur. Vérifie que Django est démarré."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">Nouvel utilisateur</h3>

                <nav>
                    <Link
                        to="/user-pages/liste-user"
                        className="btn btn-light"
                    >
                        <i className="mdi mdi-arrow-left mr-1"></i>
                        Retour à la liste
                    </Link>
                </nav>
            </div>

            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card shadow">
                        <div className="card-body">
                            <h4 className="card-title">
                                Informations du compte
                            </h4>

                            <p className="card-description">
                                Renseignez les informations du nouvel utilisateur.
                            </p>

                            {erreur && (
                                <div className="alert alert-danger">
                                    {erreur}
                                </div>
                            )}

                            {succes && (
                                <div className="alert alert-success">
                                    {succes}
                                </div>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Nom d'utilisateur *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                autoComplete="username"
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Adresse e-mail *
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                autoComplete="email"
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>Téléphone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>Département</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="departement"
                                                value={formData.departement}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>Fonction</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="job"
                                                value={formData.job}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Groupe d'utilisateurs *
                                            </Form.Label>

                                            <Form.Control
                                                as="select"
                                                name="usergroup"
                                                value={formData.usergroup}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    -- Sélectionner un groupe --
                                                </option>

                                                {groupes.map((groupe) => (
                                                    <option
                                                        key={groupe.id}
                                                        value={groupe.id}
                                                    >
                                                        {groupe.group_name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>Mot de passe *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={8}
                                                autoComplete="new-password"
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Confirmer le mot de passe *
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirm_password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                required
                                                minLength={8}
                                                autoComplete="new-password"
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Check
                                                type="checkbox"
                                                name="is_active"
                                                label="Compte actif"
                                                checked={formData.is_active}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary mr-2"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Enregistrement..."
                                        : "Enregistrer l'utilisateur"}
                                </button>

                                <Link
                                    to="/user-pages/liste-user"
                                    className="btn btn-light"
                                >
                                    Annuler
                                </Link>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormulaireUser;

