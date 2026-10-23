import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import AxiosInstance from "../Axios";

function ModifierUser() {
    const { id } = useParams();
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

    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState("");

    // ==========================================
    // CHARGER LES GROUPES ET L'UTILISATEUR
    // ==========================================

    useEffect(() => {
        const chargerDonnees = async () => {
            setChargement(true);
            setErreur("");

            try {
                const [userResponse, groupesResponse] = await Promise.all([
                    AxiosInstance.get(`users/${id}/`),
                    AxiosInstance.get("usergroups/"),
                ]);

                const utilisateur = userResponse.data;

                const groupesData = Array.isArray(groupesResponse.data)
                    ? groupesResponse.data
                    : groupesResponse.data.results || [];

                setGroupes(groupesData);

                setFormData({
                    username: utilisateur.username || "",
                    first_name: utilisateur.first_name || "",
                    last_name: utilisateur.last_name || "",
                    email: utilisateur.email || "",
                    password: "",
                    confirm_password: "",
                    phone: utilisateur.phone || "",
                    departement: utilisateur.departement || "",
                    job: utilisateur.job || "",
                    usergroup:
                        utilisateur.usergroup !== null &&
                        utilisateur.usergroup !== undefined
                            ? String(utilisateur.usergroup)
                            : "",
                    is_active: utilisateur.is_active ?? true,
                });
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des données :",
                    error
                );

                if (error.response?.status === 403) {
                    setErreur(
                        "Accès refusé. Seuls les administrateurs peuvent modifier les utilisateurs."
                    );
                } else if (error.response?.status === 404) {
                    setErreur("Cet utilisateur n'existe pas.");
                } else {
                    setErreur(
                        "Impossible de charger les informations de l'utilisateur."
                    );
                }
            } finally {
                setChargement(false);
            }
        };

        chargerDonnees();
    }, [id]);

    // ==========================================
    // MODIFICATION DES CHAMPS
    // ==========================================

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((precedent) => ({
            ...precedent,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ==========================================
    // ENREGISTRER LES MODIFICATIONS
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErreur("");
        setSucces("");

        if (!formData.username.trim()) {
            setErreur("Le nom d'utilisateur est obligatoire.");
            return;
        }

        if (!formData.email.trim()) {
            setErreur("L'adresse e-mail est obligatoire.");
            return;
        }

        if (formData.password || formData.confirm_password) {
            if (formData.password.length < 8) {
                setErreur(
                    "Le nouveau mot de passe doit contenir au moins 8 caractères."
                );
                return;
            }

            if (formData.password !== formData.confirm_password) {
                setErreur(
                    "Le nouveau mot de passe et sa confirmation ne correspondent pas."
                );
                return;
            }
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
            phone: formData.phone.trim(),
            departement: formData.departement.trim(),
            job: formData.job.trim(),
            usergroup: Number(formData.usergroup),
            is_active: formData.is_active,
        };

        // Le mot de passe reste inchangé si les champs sont vides.
        if (formData.password) {
            donnees.password = formData.password;
        }

        try {
            setEnregistrement(true);

            await AxiosInstance.patch(`users/${id}/`, donnees);

            setSucces("Les modifications ont été enregistrées.");

            setTimeout(() => {
                history.push("/user-pages/liste-user");
            }, 1000);
        } catch (error) {
            console.error(
                "Erreur lors de la modification de l'utilisateur :",
                error
            );

            const donneesErreur = error.response?.data;

            if (
                donneesErreur &&
                typeof donneesErreur === "object"
            ) {
                const messages = Object.entries(donneesErreur)
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
                    messages || "Impossible d'enregistrer les modifications."
                );
            } else {
                setErreur(
                    "Impossible de contacter le serveur Django."
                );
            }
        } finally {
            setEnregistrement(false);
        }
    };

    // ==========================================
    // AFFICHAGE
    // ==========================================

    if (chargement) {
        return (
            <div className="card shadow">
                <div className="card-body text-center">
                    Chargement des informations de l'utilisateur...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    Modifier un utilisateur
                </h3>

                <nav>
                    <Link
                        to="/utilisateur-pages/liste-utilisateur"
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
                                Modifiez les informations de cet utilisateur.
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

                            {!erreur || formData.username ? (
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
                                                <Form.Label>
                                                    Prénom
                                                </Form.Label>

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
                                                <Form.Label>
                                                    Téléphone
                                                </Form.Label>

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
                                                <Form.Label>
                                                    Département
                                                </Form.Label>

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
                                                <Form.Label>
                                                    Fonction
                                                </Form.Label>

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
                                                <Form.Label>
                                                    Nouveau mot de passe
                                                </Form.Label>

                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    minLength={8}
                                                    autoComplete="new-password"
                                                />

                                                <small className="form-text text-muted">
                                                    Laissez ce champ vide pour
                                                    conserver le mot de passe actuel.
                                                </small>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group>
                                                <Form.Label>
                                                    Confirmer le nouveau mot de passe
                                                </Form.Label>

                                                <Form.Control
                                                    type="password"
                                                    name="confirm_password"
                                                    value={formData.confirm_password}
                                                    onChange={handleChange}
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
                                        disabled={enregistrement}
                                    >
                                        {enregistrement
                                            ? "Enregistrement..."
                                            : "Enregistrer les modifications"}
                                    </button>

                                    <Link
                                        to="/user-pages/liste-user"
                                        className="btn btn-light"
                                    >
                                        Annuler
                                    </Link>
                                </Form>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModifierUser;

