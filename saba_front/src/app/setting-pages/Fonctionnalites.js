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
    InputGroup
} from "react-bootstrap";

import AxiosInstance from "../Axios";

function Fonctionnalites() {
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modeEdition, setModeEdition] = useState(false);
    const [fonctionnaliteId, setFonctionnaliteId] = useState(null);

    const [formData, setFormData] = useState({
        nom_feat: "",
        desc_feat: ""
    });

    // ==========================================
    // CHARGER LES FONCTIONNALITES
    // ==========================================

    const chargerFonctionnalites = async () => {
        setChargement(true);
        setErreur("");

        try {
            const response = await AxiosInstance.get("/features/");

            const donnees = response.data.results || response.data;
            setFonctionnalites(Array.isArray(donnees) ? donnees : []);
        } catch (error) {
            console.error("Erreur de chargement :", error);
            setErreur(
                error.response?.data?.detail ||
                "Impossible de charger les fonctionnalités."
            );
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerFonctionnalites();
    }, []);

    // ==========================================
    // GESTION DU FORMULAIRE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((ancien) => ({
            ...ancien,
            [name]: value
        }));
    };

    const ouvrirAjout = () => {
        setModeEdition(false);
        setFonctionnaliteId(null);

        setFormData({
            nom_feat: "",
            desc_feat: ""
        });

        setErreur("");
        setSucces("");
        setShowModal(true);
    };

    const ouvrirModification = (fonctionnalite) => {
        setModeEdition(true);
        setFonctionnaliteId(fonctionnalite.id);

        setFormData({
            nom_feat: fonctionnalite.nom_feat || "",
            desc_feat: fonctionnalite.desc_feat || ""
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
    // AJOUT / MODIFICATION
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErreur("");
        setSucces("");

        const nom = formData.nom_feat.trim();

        if (!nom) {
            setErreur("Le nom de la fonctionnalité est obligatoire.");
            return;
        }

        const donnees = {
            nom_feat: nom,
            desc_feat: formData.desc_feat.trim()
        };

        setEnregistrement(true);

        try {
            if (modeEdition) {
                await AxiosInstance.put(
                    `/features/${fonctionnaliteId}/`,
                    donnees
                );

                setSucces("Fonctionnalité modifiée avec succès.");
            } else {
                await AxiosInstance.post("/features/", donnees);
                setSucces("Fonctionnalité ajoutée avec succès.");
            }

            setShowModal(false);
            setFormData({
                nom_feat: "",
                desc_feat: ""
            });

            await chargerFonctionnalites();

            setSucces(
                modeEdition
                    ? "Fonctionnalité modifiée avec succès."
                    : "Fonctionnalité ajoutée avec succès."
            );
        } catch (error) {
            console.error("Erreur d'enregistrement :", error);

            const data = error.response?.data;

            if (data?.nom_feat) {
                setErreur(
                    Array.isArray(data.nom_feat)
                        ? data.nom_feat.join(" ")
                        : data.nom_feat
                );
            } else {
                setErreur(
                    data?.detail ||
                    "Une erreur est survenue pendant l'enregistrement."
                );
            }
        } finally {
            setEnregistrement(false);
        }
    };

    // ==========================================
    // SUPPRESSION
    // ==========================================

    const supprimerFonctionnalite = async (fonctionnalite) => {
        const confirmation = window.confirm(
            `Voulez-vous vraiment supprimer la fonctionnalité "${fonctionnalite.nom_feat}" ?`
        );

        if (!confirmation) {
            return;
        }

        setErreur("");
        setSucces("");

        try {
            await AxiosInstance.delete(
                `/features/${fonctionnalite.id}/`
            );

            setFonctionnalites((ancien) =>
                ancien.filter((item) => item.id !== fonctionnalite.id)
            );

            setSucces("Fonctionnalité supprimée avec succès.");
        } catch (error) {
            console.error("Erreur de suppression :", error);

            setErreur(
                error.response?.data?.detail ||
                "Impossible de supprimer cette fonctionnalité. Elle est peut-être utilisée par des privilèges."
            );
        }
    };

    // ==========================================
    // RECHERCHE
    // ==========================================

    const fonctionnalitesFiltrees = fonctionnalites.filter((item) => {
        const nom = (item.nom_feat || "").toLowerCase();
        const description = (item.desc_feat || "").toLowerCase();
        const terme = recherche.toLowerCase().trim();

        return nom.includes(terme) || description.includes(terme);
    });

    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (
        <div className="content-wrapper">
            <Row className="mb-3">
                <Col>
                    <h3 className="font-weight-bold">
                        Gestion des fonctionnalités
                    </h3>

                    <p className="text-muted">
                        Créez et gérez les fonctionnalités utilisées dans le
                        système de privilèges.
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
                    <Row className="align-items-center mb-3">
                        <Col md={7} className="mb-2 mb-md-0">
                            <InputGroup>
                                <InputGroup.Text>
                                    <i className="mdi mdi-magnify" />
                                </InputGroup.Text>

                                <Form.Control
                                    type="text"
                                    placeholder="Rechercher une fonctionnalité..."
                                    value={recherche}
                                    onChange={(e) =>
                                        setRecherche(e.target.value)
                                    }
                                />
                            </InputGroup>
                        </Col>

                        <Col md={5} className="text-md-right">
                            <Button
                                variant="primary"
                                onClick={ouvrirAjout}
                            >
                                <i className="mdi mdi-plus mr-1" />
                                Ajouter une fonctionnalité
                            </Button>
                        </Col>
                    </Row>

                    {chargement ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">
                                Chargement des fonctionnalités...
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover bordered>
                                <thead className="thead-light">
                                    <tr>
                                        <th style={{ width: "70px" }}>N°</th>
                                        <th>Nom de la fonctionnalité</th>
                                        <th>Description</th>
                                        <th style={{ width: "170px" }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {fonctionnalitesFiltrees.length > 0 ? (
                                        fonctionnalitesFiltrees.map(
                                            (fonctionnalite, index) => (
                                                <tr key={fonctionnalite.id}>
                                                    <td>{index + 1}</td>

                                                    <td>
                                                        <strong>
                                                            {fonctionnalite.nom_feat}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {fonctionnalite.desc_feat ||
                                                            "Aucune description"}
                                                    </td>

                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="mr-2"
                                                            title="Modifier"
                                                            onClick={() =>
                                                                ouvrirModification(
                                                                    fonctionnalite
                                                                )
                                                            }
                                                        >
                                                            <i className="mdi mdi-pencil" />
                                                        </Button>

                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            title="Supprimer"
                                                            onClick={() =>
                                                                supprimerFonctionnalite(
                                                                    fonctionnalite
                                                                )
                                                            }
                                                        >
                                                            <i className="mdi mdi-delete" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-4"
                                            >
                                                Aucune fonctionnalité trouvée.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            <div className="text-muted">
                                {fonctionnalitesFiltrees.length} fonctionnalité(s)
                            </div>
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
                                ? "Modifier une fonctionnalité"
                                : "Ajouter une fonctionnalité"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {erreur && (
                            <Alert variant="danger">
                                {erreur}
                            </Alert>
                        )}

                        <Form.Group>
                            <Form.Label>
                                Nom de la fonctionnalité *
                            </Form.Label>

                            <Form.Control
                                type="text"
                                name="nom_feat"
                                value={formData.nom_feat}
                                onChange={handleChange}
                                placeholder="Ex. Gestion des mémos"
                                maxLength={255}
                                required
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Description</Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="desc_feat"
                                value={formData.desc_feat}
                                onChange={handleChange}
                                placeholder="Décrivez cette fonctionnalité..."
                            />
                        </Form.Group>
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
                            ) : modeEdition ? (
                                "Enregistrer les modifications"
                            ) : (
                                "Ajouter"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Fonctionnalites;
