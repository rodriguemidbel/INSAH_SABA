import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AxiosInstance from "../Axios";

const CLE_PARAMETRES = "saba_parametres";
const CATEGORIES_OPTIONS = [
    {
        value: "source_financement",
        label: "Source de financement",
    },
    {
        value: "mode_paiement",
        label: "Mode de paiement",
    },
    {
        value: "acquitement",
        label: "Acquittement",
    },
    {
        value: "destination",
        label: "Destination",
    },
    {
        value: "autre",
        label: "Autre",
    },
];

function Settings() {
    const [parametres, setParametres] = useState({
        theme: "light",
        langue: "fr",
    });

    const [message, setMessage] = useState("");

    const [options, setOptions] = useState([]);
    const [categorie, setCategorie] = useState("source_financement");
    const [valeur, setValeur] = useState("");
    const [optionEnEdition, setOptionEnEdition] = useState(null);
    const [chargementOptions, setChargementOptions] = useState(false);
    const [erreurOptions, setErreurOptions] = useState("");
    const [messageOptions, setMessageOptions] = useState("");

    const chargerOptions = async () => {
        setChargementOptions(true);
        setErreurOptions("");

        try {
            const response = await AxiosInstance.get("dropdown-options/");

            const donnees = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setOptions(donnees);
        } catch (error) {
            console.error("Erreur de chargement des options :", error);

            if (error.response?.status === 401) {
                setErreurOptions("Veuillez vous connecter pour consulter les options.");
            } else if (error.response?.status === 403) {
                setErreurOptions("Vous n'avez pas l'autorisation de consulter ces options.");
            } else {
                setErreurOptions("Impossible de charger les options depuis le serveur.");
            }
        } finally {
            setChargementOptions(false);
        }
    };

    useEffect(() => {
        chargerOptions();
    }, []);

    const enregistrerOption = async (event) => {
        event.preventDefault();

        const valeurNettoyee = valeur.trim();

        if (!valeurNettoyee) {
            setErreurOptions("Veuillez saisir une valeur.");
            return;
        }

        setErreurOptions("");
        setMessageOptions("");

        const donnees = {
            categorie,
            valeur: valeurNettoyee,
            actif: true,
        };

        try {
            if (optionEnEdition) {
                await AxiosInstance.patch(
                    `dropdown-options/${optionEnEdition.id}/`,
                    donnees
                );

                setMessageOptions("Option modifiée avec succès.");
            } else {
                await AxiosInstance.post("dropdown-options/", donnees);

                setMessageOptions("Option ajoutée avec succès.");
            }

            setValeur("");
            setCategorie("source_financement");
            setOptionEnEdition(null);

            await chargerOptions();
        } catch (error) {
            console.error("Erreur d'enregistrement :", error);

            if (error.response?.status === 403) {
                setErreurOptions(
                    "Seul un administrateur peut ajouter ou modifier les options."
                );
            } else {
                setErreurOptions(
                    error.response?.data?.detail ||
                    "Une erreur est survenue lors de l'enregistrement."
                );
            }
        }
    };

    const modifierOption = (option) => {
        setOptionEnEdition(option);
        setCategorie(option.categorie);
        setValeur(option.valeur);
        setErreurOptions("");
        setMessageOptions("");
    };

    const annulerModification = () => {
        setOptionEnEdition(null);
        setCategorie("source_financement");
        setValeur("");
        setErreurOptions("");
        setMessageOptions("");
    };

    const changerStatutOption = async (option) => {
        setErreurOptions("");
        setMessageOptions("");

        try {
            await AxiosInstance.patch(
                `dropdown-options/${option.id}/`,
                {
                    actif: !option.actif,
                }
            );

            setMessageOptions("Statut de l'option mis à jour.");
            await chargerOptions();
        } catch (error) {
            console.error("Erreur de modification du statut :", error);

            setErreurOptions(
                error.response?.data?.detail ||
                "Impossible de modifier le statut de cette option."
            );
        }
    };

    const supprimerOption = async (option) => {
        const confirmation = window.confirm(
            `Voulez-vous vraiment supprimer l'option "${option.valeur}" ?`
        );

        if (!confirmation) {
            return;
        }

        setErreurOptions("");
        setMessageOptions("");

        try {
            await AxiosInstance.delete(`dropdown-options/${option.id}/`);

            setMessageOptions("Option supprimée avec succès.");

            if (optionEnEdition?.id === option.id) {
                annulerModification();
            }

            await chargerOptions();
        } catch (error) {
            console.error("Erreur de suppression :", error);

            setErreurOptions(
                error.response?.data?.detail ||
                "Impossible de supprimer cette option."
            );
        }
    };

    // Charger les préférences enregistrées
    useEffect(() => {
        try {
            const preferences = JSON.parse(
                localStorage.getItem(CLE_PARAMETRES)
            );

            if (preferences) {
                setParametres((precedents) => ({
                    ...precedents,
                    ...preferences,
                }));
            }
        } catch (error) {
            console.error("Erreur de lecture des paramètres :", error);
        }
    }, []);

    // Appliquer le thème choisi
    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            parametres.theme
        );

        document.body.classList.toggle(
            "theme-sombre",
            parametres.theme === "dark"
        );
    }, [parametres.theme]);

    // Modifier un paramètre
    const handleChange = (event) => {
        const { name, value } = event.target;

        setParametres((precedents) => ({
            ...precedents,
            [name]: value,
        }));

        setMessage("");
    };

    // Enregistrer les préférences
    const enregistrerParametres = (event) => {
        event.preventDefault();

        try {
            localStorage.setItem(
                CLE_PARAMETRES,
                JSON.stringify(parametres)
            );

            setMessage("Vos préférences ont été enregistrées.");
        } catch (error) {
            console.error("Erreur d'enregistrement :", error);
            setMessage(
                "Impossible d'enregistrer les préférences dans le navigateur."
            );
        }
    };

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">Paramètres</h3>

                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/setting-pages/settings">
                                Paramètres généraux
                            </Link>
                        </li>

                        <li className="breadcrumb-item">
                            <Link to="/setting-pages/account-setting">
                                Compte
                            </Link>
                        </li>

                        <li className="breadcrumb-item">
                            <Link to="/setting-pages/securite-account">
                                Sécurité du compte
                            </Link>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">
                                Paramètres généraux
                            </h4>

                            <p className="card-description">
                                Personnalisez vos préférences sur SABA.
                            </p>

                            <Form onSubmit={enregistrerParametres}>
                                <div className="row">
                                    {/* Thème */}
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Thème de l'application
                                            </Form.Label>

                                            <Form.Control
                                                as="select"
                                                name="theme"
                                                value={parametres.theme}
                                                onChange={handleChange}
                                            >
                                                <option value="light">
                                                    Clair
                                                </option>

                                                <option value="dark">
                                                    Sombre
                                                </option>
                                            </Form.Control>

                                            <small className="form-text text-muted">
                                                Choisissez votre thème préféré.
                                            </small>
                                        </Form.Group>
                                    </div>

                                    {/* Langue */}
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Langue
                                            </Form.Label>

                                            <Form.Control
                                                as="select"
                                                name="langue"
                                                value={parametres.langue}
                                                onChange={handleChange}
                                            >
                                                <option value="fr">
                                                    Français
                                                </option>

                                                <option value="en">
                                                    Anglais
                                                </option>
                                            </Form.Control>

                                            <small className="form-text text-muted">
                                                Langue préférée de l'interface.
                                            </small>
                                        </Form.Group>
                                    </div>
                                </div>

                                <hr />

                                <h4 className="card-title">
                                    Options des formulaires
                                </h4>

                                <p className="card-description">
                                    Les sources de financement et les pays
                                    seront gérés dans une section dédiée.
                                </p>

                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Source de financement
                                            </Form.Label>

                                            <Form.Control
                                                type="text"
                                                value="Gestion des options"
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>
                                                Pays
                                            </Form.Label>

                                            <Form.Control
                                                type="text"
                                                value="Gestion des options"
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                {message && (
                                    <div
                                        className="alert alert-info mt-3"
                                        role="status"
                                    >
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary mr-2"
                                >
                                    <i className="mdi mdi-content-save mr-1"></i>
                                    Enregistrer les paramètres
                                </button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">
                                Gestion des options
                            </h4>

                            <p className="card-description">
                                Gérez les valeurs utilisées dans les listes
                                déroulantes de SABA.
                            </p>

                            <Form onSubmit={enregistrerOption}>
                                <div className="row">
                                    <div className="col-md-5">
                                        <Form.Group>
                                            <Form.Label>
                                                Catégorie
                                            </Form.Label>

                                            <Form.Control
                                                as="select"
                                                value={categorie}
                                                onChange={(event) =>
                                                    setCategorie(event.target.value)
                                                }
                                            >
                                                {CATEGORIES_OPTIONS.map((item) => (
                                                    <option
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-5">
                                        <Form.Group>
                                            <Form.Label>
                                                Valeur de l'option
                                            </Form.Label>

                                            <Form.Control
                                                type="text"
                                                value={valeur}
                                                onChange={(event) =>
                                                    setValeur(event.target.value)
                                                }
                                                placeholder="Ex. : Budget de l'État"
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-2 d-flex align-items-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-2"
                                        >
                                            <i className="mdi mdi-content-save mr-1"></i>

                                            {optionEnEdition ? "Modifier" : "Ajouter"}
                                        </button>
                                    </div>
                                </div>

                                {optionEnEdition && (
                                    <button
                                        type="button"
                                        className="btn btn-light btn-sm"
                                        onClick={annulerModification}
                                    >
                                        Annuler la modification
                                    </button>
                                )}
                            </Form>

                            {erreurOptions && (
                                <div className="alert alert-danger mt-3">
                                    {erreurOptions}
                                </div>
                            )}

                            {messageOptions && (
                                <div className="alert alert-success mt-3">
                                    {messageOptions}
                                </div>
                            )}

                            <hr />

                            <h5 className="mb-3">
                                Options enregistrées
                            </h5>

                            {chargementOptions ? (
                                <p>Chargement des options...</p>
                            ) : options.length === 0 ? (
                                <p>Aucune option enregistrée.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Catégorie</th>
                                                <th>Valeur</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {options.map((option) => {
                                                const categorieTrouvee =
                                                    CATEGORIES_OPTIONS.find(
                                                        (item) =>
                                                            item.value === option.categorie
                                                    );

                                                return (
                                                    <tr key={option.id}>
                                                        <td>
                                                            {categorieTrouvee
                                                                ? categorieTrouvee.label
                                                                : option.categorie}
                                                        </td>

                                                        <td>{option.valeur}</td>

                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    option.actif
                                                                        ? "badge-success"
                                                                        : "badge-secondary"
                                                                }`}
                                                            >
                                                                {option.actif
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm mr-2"
                                                                onClick={() =>
                                                                    modifierOption(option)
                                                                }
                                                            >
                                                                <i className="mdi mdi-pencil"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-warning btn-sm mr-2"
                                                                onClick={() =>
                                                                    changerStatutOption(option)
                                                                }
                                                            >
                                                                <i className="mdi mdi-toggle-switch"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() =>
                                                                    supprimerOption(option)
                                                                }
                                                            >
                                                                <i className="mdi mdi-delete"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Settings;