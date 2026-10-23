import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Row,
    Col,
    Alert,
    Spinner,
    Badge
} from "react-bootstrap";

import AxiosInstance from "../Axios";

function Privileges() {
    // ==========================================
    // ETATS
    // ==========================================

    const [privileges, setPrivileges] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [fonctionnalites, setFonctionnalites] = useState([]);

    const [groupeFiltre, setGroupeFiltre] = useState("");
    const [recherche, setRecherche] = useState("");

    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modeEdition, setModeEdition] = useState(false);
    const [privilegeId, setPrivilegeId] = useState(null);

    const [formData, setFormData] = useState({
        usergroup: "",
        feature: "",
        create: false,
        read: true,
        update: false,
        delete: false
    });

    // ==========================================
    // CHARGEMENT DES DONNEES
    // ==========================================

    const chargerDonnees = async () => {
        setChargement(true);
        setErreur("");

        try {
            const [privilegesResponse, groupesResponse, featuresResponse] =
                await Promise.all([
                    AxiosInstance.get("/privileges/"),
                    AxiosInstance.get("/usergroups/"),
                    AxiosInstance.get("/features/")
                ]);

            const donneesPrivileges =
                privilegesResponse.data.results || privilegesResponse.data;

            const donneesGroupes =
                groupesResponse.data.results || groupesResponse.data;

            const donneesFonctionnalites =
                featuresResponse.data.results || featuresResponse.data;

            setPrivileges(
                Array.isArray(donneesPrivileges) ? donneesPrivileges : []
            );

            setGroupes(
                Array.isArray(donneesGroupes) ? donneesGroupes : []
            );

            setFonctionnalites(
                Array.isArray(donneesFonctionnalites)
                    ? donneesFonctionnalites
                    : []
            );
        } catch (error) {
            console.error("Erreur de chargement :", error);

            setErreur(
                error.response?.data?.detail ||
                "Impossible de charger les groupes, fonctionnalités et privilèges."
            );
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerDonnees();
    }, []);

    // ==========================================
    // FORMULAIRE
    // ==========================================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((ancien) => ({
            ...ancien,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const ouvrirAjout = () => {
        setModeEdition(false);
        setPrivilegeId(null);

        setFormData({
            usergroup: "",
            feature: "",
            create: false,
            read: true,
            update: false,
            delete: false
        });

        setErreur("");
        setSucces("");
        setShowModal(true);
    };

    const ouvrirModification = (privilege) => {
        setModeEdition(true);
        setPrivilegeId(privilege.id);

        setFormData({
            usergroup: String(privilege.usergroup),
            feature: String(privilege.feature),
            create: Boolean(privilege.create),
            read: Boolean(privilege.read),
            update: Boolean(privilege.update),
            delete: Boolean(privilege.delete)
        });

        setErreur("");
        setSucces("");
        setShowModal(true);
    };

    const fermerModal = () => {
        if (!enregistrement) {
            setShowModal(false);
        }
    };

    // ==========================================
    // ENREGISTREMENT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErreur("");
        setSucces("");

        if (!formData.usergroup || !formData.feature) {
            setErreur("Veuillez sélectionner un groupe et une fonctionnalité.");
            return;
        }

        const donnees = {
            usergroup: Number(formData.usergroup),
            feature: Number(formData.feature),
            create: formData.create,
            read: formData.read,
            update: formData.update,
            delete: formData.delete
        };

        // Eviter les doublons groupe + fonctionnalité
        const doublon = privileges.some(
            (privilege) =>
                Number(privilege.usergroup) === donnees.usergroup &&
                Number(privilege.feature) === donnees.feature &&
                privilege.id !== privilegeId
        );

        if (doublon) {
            setErreur(
                "Une règle existe déjà pour ce groupe et cette fonctionnalité. Modifiez la règle existante."
            );
            return;
        }

        setEnregistrement(true);

        try {
            if (modeEdition) {
                await AxiosInstance.put(
                    `/privileges/${privilegeId}/`,
                    donnees
                );

                setSucces("Privilège modifié avec succès.");
            } else {
                await AxiosInstance.post("/privileges/", donnees);
                setSucces("Privilège ajouté avec succès.");
            }

            setShowModal(false);
            await chargerDonnees();

            setSucces(
                modeEdition
                    ? "Privilège modifié avec succès."
                    : "Privilège ajouté avec succès."
            );
        } catch (error) {
            console.error("Erreur d'enregistrement :", error);

            const data = error.response?.data;

            if (data?.non_field_errors) {
                setErreur(data.non_field_errors.join(" "));
            } else if (data?.detail) {
                setErreur(data.detail);
            } else {
                setErreur(
                    "Impossible d'enregistrer le privilège. Vérifiez les informations saisies."
                );
            }
        } finally {
            setEnregistrement(false);
        }
    };

    // ==========================================
    // SUPPRESSION
    // ==========================================

    const supprimerPrivilege = async (privilege) => {
        const confirmation = window.confirm(
            `Supprimer les privilèges du groupe "${privilege.usergroup_name}" pour "${privilege.feature_name}" ?`
        );

        if (!confirmation) {
            return;
        }

        setErreur("");
        setSucces("");

        try {
            await AxiosInstance.delete(`/privileges/${privilege.id}/`);

            setPrivileges((ancien) =>
                ancien.filter((item) => item.id !== privilege.id)
            );

            setSucces("Privilège supprimé avec succès.");
        } catch (error) {
            console.error("Erreur de suppression :", error);

            setErreur(
                error.response?.data?.detail ||
                "Impossible de supprimer ce privilège."
            );
        }
    };

    // ==========================================
    // MODIFICATION RAPIDE DES DROITS
    // ==========================================

    const modifierDroit = async (privilege, droit, valeur) => {
        setErreur("");
        setSucces("");

        const donnees = {
            usergroup: privilege.usergroup,
            feature: privilege.feature,
            create: privilege.create,
            read: privilege.read,
            update: privilege.update,
            delete: privilege.delete,
            [droit]: valeur
        };

        try {
            const response = await AxiosInstance.patch(
                `/privileges/${privilege.id}/`,
                { [droit]: valeur }
            );

            setPrivileges((ancien) =>
                ancien.map((item) =>
                    item.id === privilege.id
                        ? { ...item, ...response.data }
                        : item
                )
            );

            setSucces("Droit mis à jour.");
        } catch (error) {
            console.error("Erreur de modification du droit :", error);

            setErreur(
                error.response?.data?.detail ||
                "Impossible de modifier ce droit."
            );
        }
    };

    // ==========================================
    // FILTRAGE
    // ==========================================

    const privilegesFiltres = privileges.filter((privilege) => {
        const correspondGroupe =
            !groupeFiltre ||
            String(privilege.usergroup) === String(groupeFiltre);

        const terme = recherche.toLowerCase().trim();

        const correspondRecherche =
            (privilege.usergroup_name || "").toLowerCase().includes(terme) ||
            (privilege.feature_name || "").toLowerCase().includes(terme);

        return correspondGroupe && correspondRecherche;
    });

    // ==========================================
    // AFFICHAGE D'UN DROIT
    // ==========================================

    const afficherDroit = (valeur) => (
        valeur ? (
            <Badge variant="success">Oui</Badge>
        ) : (
            <Badge variant="secondary">Non</Badge>
        )
    );

    // ==========================================
    // AFFICHAGE PRINCIPAL
    // ==========================================

    return (
        <div className="content-wrapper">
            <Row className="mb-3">
                <Col>
                    <h3 className="font-weight-bold">
                        Gestion des privilèges
                    </h3>

                    <p className="text-muted">
                        Définissez les autorisations des groupes sur les
                        fonctionnalités de SABA.
                    </p>
                </Col>
            </Row>

            {erreur && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setErreur("")}
                >
                    {erreur}
                </Alert>
            )}

            {succes && (
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => setSucces("")}
                >
                    {succes}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Row className="mb-3 align-items-end">
                        <Col md={4} className="mb-2">
                            <Form.Group className="mb-0">
                                <Form.Label>Filtrer par groupe</Form.Label>

                                <Form.Control
                                    as="select"
                                    value={groupeFiltre}
                                    onChange={(e) =>
                                        setGroupeFiltre(e.target.value)
                                    }
                                >
                                    <option value="">Tous les groupes</option>

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
                        </Col>

                        <Col md={4} className="mb-2">
                            <Form.Group className="mb-0">
                                <Form.Label>Rechercher</Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Groupe ou fonctionnalité..."
                                    value={recherche}
                                    onChange={(e) =>
                                        setRecherche(e.target.value)
                                    }
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="text-md-right mb-2">
                            <Button
                                variant="primary"
                                onClick={ouvrirAjout}
                            >
                                <i className="mdi mdi-plus mr-1" />
                                Ajouter un privilège
                            </Button>
                        </Col>
                    </Row>

                    {chargement ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">
                                Chargement des privilèges...
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover>
                                <thead className="thead-light">
                                    <tr>
                                        <th>Groupe</th>
                                        <th>Fonctionnalité</th>
                                        <th className="text-center">Lire</th>
                                        <th className="text-center">Créer</th>
                                        <th className="text-center">Modifier</th>
                                        <th className="text-center">Supprimer</th>
                                        <th style={{ minWidth: "130px" }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {privilegesFiltres.length > 0 ? (
                                        privilegesFiltres.map((privilege) => (
                                            <tr key={privilege.id}>
                                                <td>
                                                    <strong>
                                                        {privilege.usergroup_name}
                                                    </strong>
                                                </td>

                                                <td>{privilege.feature_name}</td>

                                                <td className="text-center">
                                                    {afficherDroit(privilege.read)}
                                                </td>

                                                <td className="text-center">
                                                    {afficherDroit(privilege.create)}
                                                </td>

                                                <td className="text-center">
                                                    {afficherDroit(privilege.update)}
                                                </td>

                                                <td className="text-center">
                                                    {afficherDroit(privilege.delete)}
                                                </td>

                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="mr-2"
                                                        title="Modifier les droits"
                                                        onClick={() =>
                                                            ouvrirModification(privilege)
                                                        }
                                                    >
                                                        <i className="mdi mdi-pencil" />
                                                    </Button>

                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        title="Supprimer"
                                                        onClick={() =>
                                                            supprimerPrivilege(privilege)
                                                        }
                                                    >
                                                        <i className="mdi mdi-delete" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4"
                                            >
                                                Aucun privilège trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            <p className="text-muted mb-0">
                                {privilegesFiltres.length} règle(s) affichée(s)
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* MODAL AJOUT / MODIFICATION */}

            <Modal
                show={showModal}
                onHide={fermerModal}
                centered
                backdrop={enregistrement ? "static" : true}
            >
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton={!enregistrement}>
                        <Modal.Title>
                            {modeEdition
                                ? "Modifier les privilèges"
                                : "Ajouter un privilège"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {erreur && (
                            <Alert variant="danger">
                                {erreur}
                            </Alert>
                        )}

                        <Form.Group>
                            <Form.Label>Groupe *</Form.Label>

                            <Form.Control
                                as="select"
                                name="usergroup"
                                value={formData.usergroup}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un groupe</option>

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

                        <Form.Group>
                            <Form.Label>Fonctionnalité *</Form.Label>

                            <Form.Control
                                as="select"
                                name="feature"
                                value={formData.feature}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Sélectionner une fonctionnalité
                                </option>

                                {fonctionnalites.map((fonctionnalite) => (
                                    <option
                                        key={fonctionnalite.id}
                                        value={fonctionnalite.id}
                                    >
                                        {fonctionnalite.nom_feat}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <hr />

                        <h5 className="mb-3">Autorisations</h5>

                        {[
                            {
                                name: "read",
                                label: "Lire",
                                description: "Consulter les informations"
                            },
                            {
                                name: "create",
                                label: "Créer",
                                description: "Ajouter de nouvelles données"
                            },
                            {
                                name: "update",
                                label: "Modifier",
                                description: "Modifier les données existantes"
                            },
                            {
                                name: "delete",
                                label: "Supprimer",
                                description: "Supprimer des données"
                            }
                        ].map((droit) => (
                            <Form.Group key={droit.name}>
                                <Form.Check
                                    type="checkbox"
                                    name={droit.name}
                                    id={`privilege-${droit.name}`}
                                    label={
                                        <span>
                                            <strong>{droit.label}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {droit.description}
                                            </small>
                                        </span>
                                    }
                                    checked={formData[droit.name]}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        ))}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={fermerModal}
                            disabled={enregistrement}
                        >
                            Annuler
                        </Button>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={enregistrement}
                        >
                            {enregistrement ? (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="mr-2"
                                    />
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Privileges;
