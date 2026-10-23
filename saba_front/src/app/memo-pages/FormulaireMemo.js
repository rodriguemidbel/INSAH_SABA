import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bsCustomFileInput from "bs-custom-file-input";
import AxiosInstance from "../Axios";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

function Formulaire() {

    const history = useHistory();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();

    // const {
    //     register,
    //     handleSubmit,
    //     control
    // } = useForm();

    const fichierRegister = register("fichier");

    // const [loading, setLoading] = useState(false);
    // const [nomFichier, setNomFichier] = useState("");

    
    const [loading, setLoading] = useState(false);
    const [nomFichier, setNomFichier] = useState("");

    const [sourcesFinancement, setSourcesFinancement] = useState([]);
    const [chargementSources, setChargementSources] = useState(false);
    const [erreurSources, setErreurSources] = useState("");
    


    useEffect(() => {
        bsCustomFileInput.init();
    }, []);

    
    useEffect(() => {
        const chargerSourcesFinancement = async () => {
            setChargementSources(true);
            setErreurSources("");

            try {
                const response = await AxiosInstance.get("dropdown-options/");

                // Compatible avec une réponse paginée ou une liste simple.
                const donnees = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                const sourcesActives = donnees.filter(
                    (option) =>
                        option.categorie === "source_financement" &&
                        option.actif === true
                );

                setSourcesFinancement(sourcesActives);
            } catch (error) {
                console.error(
                    "Erreur de chargement des sources de financement :",
                    error.response?.data || error.message
                );

                setErreurSources(
                    "Impossible de charger les sources de financement."
                );
            } finally {
                setChargementSources(false);
            }
        };

        chargerSourcesFinancement();
    }, []);


    const onSubmit = (data) => {

        setLoading(true);

        const formData = new FormData();

        formData.append("reference_memo", data.reference_memo);
        formData.append(
            "date",
            dayjs(data.date).format("YYYY-MM-DD")
        );
        formData.append("objet", data.objet);
        formData.append(
            "source_financement",
            data.source_financement
        );

        if (data.fichier && data.fichier.length > 0) {
            formData.append("fichier", data.fichier[0]);
        }

        AxiosInstance.post("memo/", formData)

            .then((res) => {

                alert("Mémo enregistré avec succès.");

                history.push("/memo-pages/liste-memo");

            })

            .catch((err) => {

                console.log(err.response);

                alert("Erreur lors de l'enregistrement.");

            })

            .finally(() => {

                setLoading(false);

            });

    };

    return (

        <div className="row">

            <div className="col-lg-12">

                <div className="card">

                    <div className="card-body">

                        <h4 className="card-title mb-4">
                            Nouveau Mémo
                        </h4>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="row">

                                <div className="col-md-6">

                                    <Form.Group>

                                        <label>Référence Mémo</label>

                                        <Form.Control
                                            type="text"
                                            placeholder="Référence"
                                            {...register("reference_memo", {
                                                required: true
                                            })}
                                        />

                                        {errors.reference_memo &&
                                            <small className="text-danger">
                                                Champ obligatoire
                                            </small>
                                        }

                                    </Form.Group>

                                </div>

                                <div className="col-md-6">

                                    <Form.Group>

                                        <label>Date</label>

                                        <Controller
                                            control={control}
                                            name="date"
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    className="form-control"
                                                    selected={field.value}
                                                    onChange={field.onChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Choisir une date"
                                                />
                                            )}
                                        />

                                        {errors.date &&
                                            <small className="text-danger">
                                                Champ obligatoire
                                            </small>
                                        }

                                    </Form.Group>

                                </div>

                            </div>

                            <div className="row mt-3">

                                <div className="col-md-6">

                                    <Form.Group>

                                        <label>Objet</label>

                                        <Form.Control
                                            type="text"
                                            placeholder="Objet du mémo"
                                            {...register("objet", {
                                                required: true
                                            })}
                                        />

                                    </Form.Group>

                                </div>

                                <div className="col-md-6">

                                    <Form.Group>

                                        <label>Source de financement</label>

                                        {/* <Form.Control
                                            as="select"
                                            {...register(
                                                "source_financement",
                                                {
                                                    required: true
                                                }
                                            )}
                                        >

                                            <option value="">
                                                -- Choisir --
                                            </option>

                                            <option>CSP/COAHP</option>
                                            <option>CILSS</option>
                                            <option>P2PRS</option>
                                            <option>UEMOA</option>
                                            <option>CEDEAO</option>
                                            <option>FONDS PROPRE</option>

                                        </Form.Control> */}

                                        
                                        <Form.Control
                                            as="select"
                                            {...register("source_financement", {
                                                required: "Veuillez choisir une source de financement."
                                            })}
                                            disabled={chargementSources}
                                        >
                                            <option value="">
                                                {chargementSources
                                                    ? "Chargement des sources..."
                                                    : "-- Choisir une source --"}
                                            </option>

                                            {sourcesFinancement.map((option) => (
                                                <option key={option.id} value={option.valeur}>
                                                    {option.valeur}
                                                </option>
                                            ))}
                                        </Form.Control>

                                        {errors.source_financement && (
                                            <small className="text-danger">
                                                {errors.source_financement.message ||
                                                    "Veuillez choisir une source de financement."}
                                            </small>
                                        )}

                                        {erreurSources && (
                                            <small className="text-danger d-block">
                                                {erreurSources}
                                            </small>
                                        )}
                                        


                                    </Form.Group>

                                </div>

                            </div>

                            <div className="row mt-4">

                                <div className="col-md-12">

                                    <Form.Group>

                                        <label>
                                            Pièce jointe
                                        </label>

                                        {/* <Form.Control
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                            {...register("fichier")}
                                            onChange={(e) => {

                                                if (
                                                    e.target.files.length > 0
                                                ) {
                                                    setNomFichier(
                                                        e.target.files[0].name
                                                    );
                                                }

                                            }}
                                        /> */}

                                        <Form.Control
                                            type="file"
                                            {...fichierRegister}
                                            onChange={(e) => {

                                                fichierRegister.onChange(e);

                                                if (e.target.files.length > 0) {
                                                    setNomFichier(e.target.files[0].name);
                                                }

                                            }}
                                        />

                                        {
                                            nomFichier &&
                                            <small className="text-success">
                                                {nomFichier}
                                            </small>
                                        }

                                    </Form.Group>

                                </div>

                            </div>

                            <hr />

                            <button
                                className="btn btn-primary mr-3"
                                type="submit"
                                disabled={loading}
                            >

                                {
                                    loading
                                        ? "Enregistrement..."
                                        : "Enregistrer"
                                }

                            </button>

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => history.goBack()}
                            >
                                Annuler
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Formulaire;