import React, { useEffect, useState } from "react"; 
import { Form } from "react-bootstrap"; 
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import bsCustomFileInput from "bs-custom-file-input"; 
import { useParams, useHistory } from "react-router-dom"; 
import AxiosInstance from "../../Axios"; 

function FormulaireReglement() { 
    // ========================================================= // 
     // PARAMETRES // 
    // ========================================================= // 

    const { id: factureId } = useParams(); const history = useHistory(); 
    
    // ========================================================= // STATES // ========================================================= 
    
    const [loading, setLoading] = useState(true); 
    
    const [saving, setSaving] = useState(false); 

    
    const [modesPaiement, setModesPaiement] = useState([]);
    const [optionsAcquittement, setOptionsAcquittement] = useState([]);
    const [erreurOptions, setErreurOptions] = useState("");

    
    const [facture, setFacture] = useState(null); 
    
    const [selectedDate, setSelectedDate] = useState( new Date() ); 
    
    const [formData, setFormData] = useState({ 
        
        facture: factureId, 
        date_reglement: "", 
        mode_paiement: "", 
        numero_cheque_ov: "", 
        banque: "", 
        service_financier: "",
        montant_regle: "", 
        acquitement: "Termine", 
        observation: "", 
        fichier: null }); 
        
        // ========================================================= //
        //  INITIALISATION //
        //  ========================================================= 
        
        useEffect(() => { bsCustomFileInput.init(); }, []); 

        
        useEffect(() => {
            const chargerOptionsReglement = async () => {
                try {
                    setErreurOptions("");

                    const response = await AxiosInstance.get("dropdown-options/");

                    const donnees = Array.isArray(response.data)
                        ? response.data
                        : response.data.results || [];

                    const optionsActives = donnees.filter(
                        (option) => option.actif === true
                    );

                    setModesPaiement(
                        optionsActives.filter(
                            (option) => option.categorie === "mode_paiement"
                        )
                    );

                    setOptionsAcquittement(
                        optionsActives.filter(
                            (option) => option.categorie === "acquitement"
                        )
                    );
                } catch (error) {
                    console.error(
                        "Erreur de chargement des options :",
                        error.response?.data || error.message
                    );

                    setErreurOptions(
                        "Impossible de charger les options de règlement. Vérifiez votre connexion."
                    );
                }
            };

            chargerOptionsReglement();
        }, []);
        

        
        // ========================================================= // 
        // CHARGEMENT DE LA FACTURE // 
        // ========================================================= 
        
        useEffect(() => { 
            if (factureId) {
                chargerFacture(); 
            } 
        }, [factureId]); 
        
        const chargerFacture = async () => { 
            
            try { 
                
                setLoading(true); 
                
                const response = await AxiosInstance.get( `facture/${factureId}/` ); 
                
                const factureData = response.data; 
                
                setFacture(factureData); 
                
                setFormData((old) => ({ ...old, 
                    
                    facture: factureData.id, 
                    
                    montant_regle: factureData.montant 
                })); 
            
            } catch (error) { 
                
                console.error( "Erreur lors du chargement de la facture :", error ); 
                
                alert( "Impossible de charger les informations de la facture." ); 
            
            } finally { setLoading(false); } 
        
        }; 
        
        // ========================================================= // 
        // GESTION DES CHAMPS //
        //  ========================================================= 

        
        const estUnCheque = (mode) => {
            const modeNormalise = (mode || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();

            return modeNormalise === "cheque";
        };

        
        const handleChange = (e) => { 
            
            const { name, value } = e.target; 
            
            setFormData((old) => { 
                
                const newData = { ...old, [name]: value }; 
                
                // ------------------------------------------------- //
                 
                //  Si le mode de paiement n'est plus "Chèque", // on efface automatiquement la banque. //
                //  ------------------------------------------------- 
                
                // if ( name === "mode_paiement" && value !== "Cheque" ) {
                    
                //     newData.banque = ""; 
                
                // } 

                if (name === "mode_paiement" && !estUnCheque(value)) {
                    newData.banque = "";
                }
                
                return newData; 
            }); 
        }; 
            
            // ========================================================= // 
            // DATE // 
            // ========================================================= 
             
            const handleDate = (date) => {

                if (!date) { 
                    return; 
                } 
                
                setSelectedDate(date); 
                setFormData((old) => ({ ...old, 
                    
                    date_reglement: date .toISOString() .split("T")[0] })); 
                }; 
                
                // ========================================================= //
                //  FICHIER // 
                // ========================================================= 
                 
                const handleFile = (e) => { 
                    const file = e.target.files[0] || null; 
                    setFormData((old) => ({ ...old, fichier: file })); 
                }; 
                // ========================================================= // 
                // VALIDATION // 
                // ========================================================= 
                 
                const validateForm = () => { 
                    if (!formData.date_reglement) { 
                        alert( "Veuillez sélectionner la date du règlement." ); 
                        
                        return false; 

                    } 
                    
                    if (!formData.mode_paiement) { 
                        alert( "Veuillez sélectionner un mode de paiement." ); 
                        
                        return false;
                    
                    } 
                    
                    // ----------------------------------------------------- //
                    //  La banque est obligatoire uniquement pour un chèque. // 
                    // ----------------------------------------------------- 
                     
                    // if ( formData.mode_paiement === "Cheque" && !formData.banque ) { 
                        
                    //     alert( "Veuillez sélectionner la banque." ); return false; 
                    
                    // } 

                    if (estUnCheque(formData.mode_paiement) && !formData.banque) 
                    { 
                        
                        alert( "Veuillez sélectionner la banque." ); return false; 
                    
                    } 
                    
                    if (!formData.montant_regle) { 
                        
                        alert( "Veuillez saisir le montant payé." ); 
                        
                        return false;
                    
                    } 
                    
                    if ( Number(formData.montant_regle) <= 0 ) { 
                        
                        alert( "Le montant payé doit être supérieur à zéro." ); 
                        
                        return false; 
                    
                    } 
                    
                    return true; 
                
                }; 
                
                // ========================================================= // 
                // ENREGISTREMENT // 
                // ========================================================= 
                 
                const handleSubmit = async (e) => { 
                    
                    e.preventDefault(); 
                    
                    if (!validateForm()) { 
                        
                        return; 
                    
                    } 
                    
                    try { 
                        
                        setSaving(true); 
                        
                        const data = new FormData(); 
                        
                        data.append( "facture", formData.facture ); 
                        
                        data.append( "date_reglement", formData.date_reglement ); 
                        
                        data.append( "mode_paiement", formData.mode_paiement ); 
                        
                        data.append( "numero_cheque_ov", formData.numero_cheque_ov ); 
                        
                        // ------------------------------------------------- // 
                        // 
                        // La banque est envoyée uniquement pour un chèque. //
                        // 
                        //  ------------------------------------------------- 
                        //

                        // if ( formData.mode_paiement === "Cheque" ) { 
                            
                        //     data.append( "banque", formData.banque ); 
                        
                        // } 

                        if (estUnCheque(formData.mode_paiement)) {

                            data.append("banque", formData.banque);

                        }
                        
                        data.append( "service_financier", formData.service_financier ); 
                        
                        data.append( "montant_regle", formData.montant_regle ); 
                        
                        data.append( "acquitement", formData.acquitement ); 
                        
                        data.append( "observation", formData.observation ); 
                        
                        if (formData.fichier) { 
                            
                            data.append( "fichier", formData.fichier ); 
                        
                        } 
                        
                        await AxiosInstance.post( "reglement/", data, { 
                            
                            headers: { "Content-Type": "multipart/form-data" } 
                        } 
                    ); 
                    
                    alert( "Le règlement a été enregistré avec succès." ); 
                    
                    history.push( "/paiement-pages/reglement/liste-reglement" ); 
                
                } catch (error) { 
                    
                    console.error( "Erreur lors de l'enregistrement :", error ); 
                    
                    const message = error?.response?.data?.detail || error?.response?.data?.error || "Une erreur est survenue lors de l'enregistrement du règlement."; 
                    
                    alert(message); 
                
                } finally { setSaving(false); } 
            
            }; 
            
            // ========================================================= // 
            // AFFICHAGE // 
            // ========================================================= 
            // 
            return ( 
                <div> 
                    <div className="page-header"> 
                        <h3 className="page-title"> Règlement d'une facture </h3> 
                    </div> 

                    {loading ? ( 
                        
                            <div className="text-center mt-5"> 
                                <div className="spinner-border text-primary" role="status" /> 

                                    <p className="mt-3"> Chargement... </p> </div> 
                                    
                                ) 

                                    : 

                                ( 
                                    
                                    <div className="row"> 
                                        
                                        <div className="col-lg-10 mx-auto"> 
                                        
                                            <div className="card shadow"> 
                                            
                                               <div className="card-body"> 
                                               
                                               {/* ===================================================== EN-TÊTE ====================================================== */} 
                                               
                                                <div className="d-flex justify-content-between align-items-center mb-4"> 
                                               
                                                    <div> 
                                                        
                                                        <h4 className="card-title mb-1"> Paiement de la facture </h4> 
                                                        
                                                            <p className="text-muted"> Complétez les informations de règlement. </p> 
                                                                
                                                    </div> 
                                                    
                                                        <span className="badge badge-warning p-2"> En attente de règlement </span> 
                                                </div> 
                                                
                                                {/* ===================================================== INFORMATIONS FACTURE ====================================================== */} 
                                                
                                                {facture && ( 
                                                    
                                                    <div className="alert alert-info"> 
                                                        
                                                        <div className="row"> 
                                                        
                                                            <div className="col-md-6"> 
                                                                
                                                                <strong> Référence facture : </strong> 
                                                            
                                                                <br /> 
                                                                
                                                                {facture.reference_facture} 
                                                            
                                                            </div> 
                                                            
                                                            <div className="col-md-6"> 
                                                            
                                                                <strong> Référence mémo : </strong> 
                                                                
                                                                <br /> {facture.memo_reference} 

                                                            </div> 
                                                            
                                                            <div className="col-md-6 mt-3"> 
                                                                
                                                                <strong> Fournisseur : </strong> 
                                                                
                                                                <br /> {facture.fournisseur_nom} 
                                                                
                                                            </div> 
                                                            
                                                            <div className="col-md-6 mt-3"> 
                                                            
                                                                <strong> Montant : </strong> 
                                                                
                                                                <br /> 
                                                                
                                                                <span className="badge badge-primary"> 
                                                                
                                                                    {Number( facture.montant || 0 ).toLocaleString()} FCFA 
                                                                
                                                                </span> 
                                                                
                                                            </div> 
                                                            
                                                        </div> 
                                                        
                                                    </div> )} 

                                                    {erreurOptions && (
                                                        <div className="alert alert-danger">
                                                            {erreurOptions}
                                                        </div>
                                                    )}
                                                    
                                                    {/* ===================================================== FORMULAIRE ====================================================== */} 
                                                    
                                                    <form onSubmit={handleSubmit}> 
                                                    
                                                       <div className="row"> 
                                                        
                                                        {/* ================================================= DATE ================================================== */} 
                                                        
                                                            <div className="col-md-6"> 
                                                                
                                                                <Form.Group> 
                                                                
                                                                    <label> Date du règlement </label> 
                                                                    
                                                                    <DatePicker className="form-control" selected={selectedDate} onChange={handleDate} dateFormat="yyyy-MM-dd" /> 
                                                                    
                                                                </Form.Group> 
                                                                    
                                                            </div> 

                                                            {/* ================================================= MODE DE PAIEMENT ================================================== */} 
                                                            
                                                            <div className="col-md-6"> 
                                                            
                                                                <Form.Group> 
                                                                
                                                                    <label> Mode de paiement </label> 
                                                                    
                                                                    {/* <Form.Control as="select" name="mode_paiement" value={ formData.mode_paiement } onChange={ handleChange } > 
                                                                    
                                                                        <option value=""> Choisir... </option> 
                                                                        
                                                                        <option value="Cheque"> Chèque </option> 
                                                                        
                                                                        <option value="OV"> Ordre de Virement </option> 
                                                                        
                                                                        <option value="Especes"> Espèces </option> 
                                                                        
                                                                        <option value="Mobile Money"> Mobile Money </option> 
                                                                        
                                                                        <option value="Virement"> Virement Bancaire </option> 
                                                                        
                                                                    </Form.Control>  */}

                                                                    
                                                                    <Form.Control
                                                                        as="select"
                                                                        name="mode_paiement"
                                                                        value={formData.mode_paiement}
                                                                        onChange={handleChange}
                                                                        required
                                                                    >
                                                                        <option value="">-- Choisir un mode de paiement --</option>

                                                                        {modesPaiement.map((option) => (
                                                                            <option key={option.id} value={option.valeur}>
                                                                                {option.valeur}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                

                                                                    
                                                                </Form.Group> 
                                                                
                                                            </div> 
                                                            
                                                            {/* ================================================= BANQUE Apparaît uniquement si Chèque est sélectionné. ================================================== */} 
                                                            
                                                            {formData.mode_paiement === "Cheque" && ( 
                                                                
                                                                <div className="col-md-6"> 
                                                                    
                                                                    <Form.Group> 
                                                                    
                                                                        <label> Banque </label> 
                                                                        
                                                                        <Form.Control as="select" name="banque" value={ formData.banque } onChange={ handleChange } required > 

                                                                            <option value=""> Sélectionner une banque... </option> 
                                                                            
                                                                            <option value="BCEAO"> BCEAO </option> <option value="BMS"> BMS </option> 
                                                                            
                                                                            <option value="BDM"> BDM </option> <option value="BOA"> BOA </option> 
                                                                            
                                                                            <option value="BNDA"> BNDA </option> 
                                                                            
                                                                            <option value="ECOBANK"> ECOBANK </option> 
                                                                            
                                                                            <option value="ORABANK"> ORABANK </option> 
                                                                            
                                                                            <option value="UBA"> UBA </option> 
                                                                            
                                                                            <option value="AUTRE"> Autre </option> 
                                                                            
                                                                        </Form.Control> 
                                                                        
                                                                    </Form.Group> 
                                                                    
                                                                </div> )} 
                                                                
                                                                {/* ================================================= NUMERO CHEQUE / OV ================================================== */} 
                                                                
                                                                <div className="col-md-6"> 
                                                                
                                                                    <Form.Group> <label> Numéro Chèque / OV </label> 
                                                                    
                                                                        <Form.Control type="text" name="numero_cheque_ov" value={ formData.numero_cheque_ov } onChange={ handleChange } placeholder="Saisir le numéro" /> 
                                                                        
                                                                    </Form.Group>
                                                                    
                                                                </div> 
                                                                
                                                                {/* ================================================= SERVICE FINANCIER ================================================== */} 
                                                                
                                                                <div className="col-md-6"> 
                                                                
                                                                    <Form.Group> <label> Service financier </label> 
                                                                    
                                                                        <Form.Control type="text" name="service_financier" value={ formData.service_financier } onChange={ handleChange } placeholder="Service financier" /> 
                                                                        
                                                                            </Form.Group> 
                                                                            
                                                                </div>
                                                                
                                                                 {/* ================================================= MONTANT ================================================== */} 
                                                                 
                                                                <div className="col-md-6"> 
                                                                                
                                                                    <Form.Group> 
                                                                        
                                                                        <label> Montant payé </label> 
                                                                        
                                                                        <Form.Control type="number" name="montant_regle" value={ formData.montant_regle } onChange={ handleChange } min="0" step="0.01" /> 
                                                                        
                                                                    </Form.Group> 
                                                                    
                                                                </div> 
                                                                
                                                                {/* ================================================= ACQUITtEMENT ================================================== */} 
                                                                
                                                                <div className="col-md-6"> 
                                                                    
                                                                    <Form.Group> 
                                                                        
                                                                        <label> Acquittement </label> 
                                                                        
                                                                        {/* <Form.Control as="select" name="acquitement" value={ formData.acquitement } onChange={ handleChange } > 
                                                                            
                                                                            <option value="Termine"> Terminé </option> 
                                                                            
                                                                            <option value="En cours"> En cours </option> 
                                                                            
                                                                            <option value="Partiel"> Partiel </option> 
                                                                            
                                                                            <option value="Annule"> Annulé </option> 
                                                                            
                                                                        </Form.Control>  */}

                                                                        
                                                                        <Form.Control
                                                                            as="select"
                                                                            name="acquitement"
                                                                            value={formData.acquitement}
                                                                            onChange={handleChange}
                                                                            required
                                                                        >
                                                                            <option value="">-- Choisir un acquittement --</option>

                                                                            {optionsAcquittement.map((option) => (
                                                                                <option key={option.id} value={option.valeur}>
                                                                                    {option.valeur}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Control>
                                                                        

                                                                        
                                                                    </Form.Group> 
                                                                    
                                                                </div> 
                                                                
                                                                {/* ================================================= OBSERVATION ================================================== */} 
                                                                
                                                                <div className="col-12"> 
                                                                    
                                                                    <Form.Group> 
                                                                        
                                                                        <label> Observation </label>
                                                                        
                                                                        <Form.Control as="textarea" rows={4} name="observation" value={ formData.observation } onChange={ handleChange } placeholder="Ajouter une observation..." /> 
                                                                        
                                                                    </Form.Group> 
                                                                    
                                                                </div> 
                                                                    
                                                                {/* ================================================= FICHIER ================================================== */} 
                                                                
                                                                <div className="col-12"> 
                                                                    
                                                                    <Form.Group> 
                                                                        
                                                                        <label> Fichier (PDF) </label> 
                                                                        
                                                                        <div className="custom-file"> 
                                                                            
                                                                            <input type="file" className="custom-file-input" accept=".pdf" onChange={ handleFile } /> 
                                                                            
                                                                            <label className="custom-file-label"> {formData.fichier ? formData.fichier.name : "Choisir un fichier" } </label> 
                                                                            
                                                                        </div> 
                                                                        
                                                                    </Form.Group> 
                                                                    
                                                                </div> 
                                                                
                                                            </div> 
                                                            
                                                            <hr /> 
                                                            
                                                            {/* ===================================================== BOUTONS ====================================================== */} 
                                                            
                                                            <div className="text-right"> 
                                                                
                                                                <button type="button" className="btn btn-light mr-2" onClick={() => history.goBack() } disabled={saving} > Annuler </button> 
                                                                
                                                                <button type="submit" className="btn btn-success" disabled={saving} > 
                                                                    
                                                                    {saving ? ( <> <span className="spinner-border spinner-border-sm mr-2" role="status" /> Enregistrement... </> ) : ( <> <i className="mdi mdi-cash-check mr-1"></i> Enregistrer le règlement </> )} </button> 
                                                                    
                                                            </div>

                                                        </form> 
                                                        
                                                    </div>

                                                 </div> 

                                                </div> 

                                            </div> 

                                            )} 
                                            
                                        </div> 
                                        
                    ); 
                                    
} export default FormulaireReglement;




                    