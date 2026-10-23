import React, {
  useEffect,
  useState
} from "react";
import {
  Form
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bsCustomFileInput from "bs-custom-file-input";
import {
  useParams,
  useHistory
} from "react-router-dom";
import AxiosInstance from "../Axios";

function FormulaireFournisseur() { 
  
  // ========================================================= 
  // // PARAMETRES // 
  // ========================================================= 
  // 

  const { id } = useParams(); 
  
  const history = useHistory(); 
  
  // ========================================================= //
  //  STATES // 
  // ========================================================= 
  // 
  
  const [loading, setLoading] = useState(false); 
  
  const [saving, setSaving] = useState(false); 
  
  const [startDate, setStartDate] = useState( new Date() ); 
  
  // ========================================================= 
  // INFORMATIONS DU MEMO // 
  // ========================================================= 
  
  const [memo, setMemo] = useState({ reference_memo: "", objet: "", source_financement: "" }); 
  
  // ========================================================= 
  // // FOURNISSEURS // 
  // ========================================================= 
  
  const [fournisseurs, setFournisseurs] = useState([ {
    
    agence: "", montant: "", observation: "", fichier: null 
  
    } 
  ]); 
  
  // ========================================================= 
  // // INITIALISATION // 
  // ========================================================= 
  
  useEffect(() => { bsCustomFileInput.init(); }, []);
  
  // ========================================================= 
  // // CHARGEMENT DU MEMO EN MODIFICATION // 
  // ========================================================= 
  
  useEffect(() => { if (id) { chargerMemo(); } }, [id]); 
  
  const chargerMemo = async () => { try { setLoading(true); 
    
    const response = await AxiosInstance.get( `memo/${id}/` ); 
    
    const data = response.data; 
    
    // ------------------------------------------------- 
    // // INFORMATIONS MEMO //
    //  ------------------------------------------------- 
    
    setMemo({ 
      
      reference_memo: data.reference_memo || "", 
      
      objet: data.objet || "", 
      
      source_financement: data.source_financement || "" 
    
    }); 
    
    // ------------------------------------------------- 
    // // DATE // 
    // ------------------------------------------------- 
     
    if (data.date) { 
      
      setStartDate( new Date(data.date) ); 
    
    } 
    
    // ------------------------------------------------- 
    // // FOURNISSEURS // 
    // ------------------------------------------------- 
    
    if ( data.fournisseur && data.fournisseur.length > 0 ) { 
      
      setFournisseurs( data.fournisseur.map((f) => ({ 
          
          agence: f.agence || "", 

          montant: f.montant || "", 

          observation: f.observation || "", 
          
          fichier: null 
        })) 
      ); 
    } 
  } catch (error) { 
    
    console.error( "Erreur lors du chargement du mémo :", error ); 
    
    alert( "Impossible de charger les informations du mémo." ); 
  
  } finally { setLoading(false); } 

}; 

// ========================================================= 
// // MODIFICATION DES INFORMATIONS DU MEMO // 
// =========================================================
 
const handleMemoChange = (e) => { 
  
  const { name, value } = e.target; 
  
  setMemo((old) => ({ ...old, [name]: value })); 

}; 

// ========================================================= 
// // MODIFICATION D'UN FOURNISSEUR // 
// ========================================================= 

const handleFournisseurChange = ( index, e ) => { 
  
  const { name, value } = e.target; 
  
  setFournisseurs((old) => old.map((fournisseur, i) => i === index ? { ...fournisseur, [name]: value } : fournisseur ) ); 

}; 

// ========================================================= 
// // MODIFICATION DU FICHIER // 
// ========================================================= 

const handleFileChange = ( index, e ) => { 
  
  const file = e.target.files[0] || null; 
  
  setFournisseurs((old) => old.map((fournisseur, i) => i === index ? { ...fournisseur, fichier: file } : fournisseur ) ); 

}; 

// ========================================================= 
// // AJOUTER UN FOURNISSEUR // 
// ========================================================= 

const addFournisseur = () => { setFournisseurs((old) => [ ...old, { 
  
  agence: "",

  montant: "", 

  observation: "", 
  
  fichier: null } ]); 

}; 

// ========================================================= 
// // SUPPRIMER UN FOURNISSEUR // 
// ========================================================= 

const removeFournisseur = (index) => { setFournisseurs((old) => old.filter( (_, i) => i !== index ) ); }; 

// ========================================================= 
// // VALIDATION // 
// ========================================================= 

const validateForm = () => { 
  
  if (!memo.reference_memo) { 
  
    alert( "La référence du mémo est obligatoire." ); 
    
    return false; 
  
  } 
  
  if (fournisseurs.length === 0) { 
    
    alert( "Veuillez ajouter au moins un fournisseur." ); 
    
    return false; 
  
  } 
  
  for ( let i = 0; i < fournisseurs.length; i++ ) { 
    
    const fournisseur = fournisseurs[i]; 
    
    if (!fournisseur.agence.trim()) { 
      
      alert( `Veuillez renseigner l'agence du fournisseur ${i + 1}.` ); 
      
      return false;
    } 
      
    if ( fournisseur.montant === "" || Number(fournisseur.montant) <= 0 ) { 
      
      alert( `Veuillez renseigner un montant valide pour le fournisseur ${i + 1}.` ); 

      return false; 

    } 

  } 
  
  return true; 

}; 

// ========================================================= 
// // ENREGISTREMENT // 
// ========================================================= 

const handleSubmit = async (e) => { e.preventDefault(); 
  
  if (!validateForm()) { 
    return;
   } 
   
  try { 
    
    setSaving(true); 
    
    const formData = new FormData(); 
    
    // ------------------------------------------------- 
    // // INFORMATIONS MEMO // 
    // ------------------------------------------------- 
     
    formData.append( "reference_memo", memo.reference_memo ); 
    
    formData.append( "objet", memo.objet ); 
    
    formData.append( "source_financement", memo.source_financement ); 
    
    // ------------------------------------------------- 
    // // DATE // 
    // ------------------------------------------------- 
    
    if (startDate) { 
      
      const formattedDate = startDate .toISOString() .split("T")[0]; 
      
      formData.append( "date", formattedDate ); 
    
    } 
    
    // ------------------------------------------------- 
    // // FOURNISSEURS // 
    // ------------------------------------------------- 
    
    fournisseurs.forEach( (fournisseur, index) => { 
      
      formData.append( `fournisseurs[${index}][agence]`, fournisseur.agence ); 
      
      formData.append( `fournisseurs[${index}][montant]`, fournisseur.montant ); 
      
      // ----------------------------------------- 
      // // OBSERVATION //
      //  -----------------------------------------  
       
      formData.append( `fournisseurs[${index}][observation]`, fournisseur.observation || "" ); 
      
      // ----------------------------------------- 
      // // FICHIER // 
      // ----------------------------------------- 
      
      if (fournisseur.fichier) { 
        
        formData.append( `fournisseurs[${index}][fichier]`, fournisseur.fichier ); 
      
      } 
    
    } 
  
  ); 
  
  // ================================================= 
  // // MODIFICATION //
  // ================================================= 
  
  if (id) { 
    
    await AxiosInstance.patch( `memo/${id}/`, formData, {
      
      headers: { "Content-Type": "multipart/form-data" } 
    
    } ); 
  
    alert( "Mémo modifié avec succès." ); 

  } 

// ================================================= 
// // CREATION // 
// ================================================= 

  else { 
    
    await AxiosInstance.post( "memo/", formData, { 
      
      headers: { "Content-Type": "multipart/form-data" } 
    
    } ); 
    
    alert( "Mémo enregistré avec succès." ); 

  } 

  // ------------------------------------------------- 
  // // REDIRECTION //  
  // ------------------------------------------------- 

  history.push( "/fournisseur-pages/liste-fournisseur" ); 

} catch (error) {

   console.error( "Erreur lors de l'enregistrement :", error ); 
   
   console.error( "Réponse Django :", error?.response?.data ); 
   
   const message = error?.response?.data?.detail || error?.response?.data?.error || "Une erreur est survenue lors de l'enregistrement."; 
   
   alert(message); 
  
  } finally { setSaving(false); } 

}; 

// ========================================================= 
// // AFFICHAGE // 
// ========================================================= 

return ( 
  
  <div> 
  
  {/* ================================================= HEADER ================================================== */} 
  
    <div className="page-header"> 
    
      <h3 className="page-title">
      
        {id ? "Modification des fournisseurs" : "Enregistrement des fournisseurs" } 
        
      </h3> 
      
    </div> 
    
    {/* ================================================= LOADING ================================================== */} 
    
    {loading ? ( 
      
      <div className="text-center mt-5"> 
        
        <div className="spinner-border text-primary" role="status" /> 
        
        <p className="mt-3"> Chargement... </p> 
        
      </div> ) : ( 
        
        <div className="card"> 
        
          <div className="card-body"> 
          
            <form onSubmit={handleSubmit} > 
            
            {/* ================================================= INFORMATIONS MEMO ================================================== */} 
            
              <h5 className="mb-4"> Informations du mémo </h5> 
              
                <Form.Group> 
                
                  <label> Référence Mémo </label> 
                  
                  <Form.Control name="reference_memo" value={ memo.reference_memo } readOnly /> 
                  
                </Form.Group> 
                
                <Form.Group> 
                  
                  <label> Date </label> 
                  
                  <DatePicker className="form-control" selected={ startDate } onChange={ setStartDate } dateFormat="yyyy-MM-dd" disabled /> 
                  
                </Form.Group> 
                
                <Form.Group> 
                
                  <label> Source financement </label> 
                  
                  <Form.Control name="source_financement" value={ memo.source_financement } readOnly /> 
                  
                </Form.Group> 
                
                <Form.Group> 
                
                  <label> Objet </label> 
                  
                  <Form.Control name="objet" value={ memo.objet } readOnly /> 
                  
                </Form.Group> 
                
                <hr /> 
                
                {/* ================================================= FOURNISSEURS ================================================== */} 
                
                <div className="d-flex justify-content-between align-items-center mb-3"> 
                
                  <h5 className="mb-0"> Fournisseurs </h5> 
                  
                  <button type="button" className="btn btn-success" onClick={ addFournisseur } > 
                  
                    <i className="mdi mdi-plus"></i> Ajouter 
                    
                  </button> 
                  
                </div> 
                
                <div className="row"> 
                
                  {fournisseurs.map( (fournisseur, index) => ( 
                    
                    <div key={index} className="col-md-6 col-lg-4 mb-4" > 
                    
                      <div className="card border"> 
                        
                        <div className="card-body"> 
                          
                          {/* ========================== TITRE =========================== */} 
                          
                          <div className="d-flex justify-content-between align-items-center mb-3"> 
                            
                            <h6 className="mb-0"> Fournisseur {index + 1} </h6> 
                            
                            {fournisseurs.length > 1 && (
                              
                              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFournisseur(index) } title="Supprimer" > 
                              
                                <i className="mdi mdi-delete"></i> 
                                
                              </button> )} 
                              
                          </div> 
                          
                          {/* ========================== AGENCE =========================== */} 
                          
                          <Form.Group> 
                            
                            <label> Agence </label> 
                            
                            <Form.Control type="text" name="agence" value={ fournisseur.agence } onChange={(e) => handleFournisseurChange( index, e ) } placeholder="Nom de l'agence" required /> 
                              
                          </Form.Group> 
                          
                          {/* ========================== MONTANT =========================== */} 
                          
                          <Form.Group> 
                            
                            <label> Montant </label> 
                            
                            <Form.Control type="number" name="montant" value={ fournisseur.montant } onChange={(e) => handleFournisseurChange( index, e ) } placeholder="Montant" min="0" step="0.01" required /> 
                              
                          </Form.Group> 
                          
                          {/* ========================== OBSERVATION =========================== */} 
                          
                          <Form.Group> 
                            
                            <label> Observation </label> 
                            
                            <Form.Control as="textarea" rows={3} name="observation" value={ fournisseur.observation } onChange={(e) => handleFournisseurChange( index, e ) } placeholder="Ajouter une observation..." /> 
                              
                          </Form.Group> 
                              
                          {/* ========================== FICHIER =========================== */} 
                          
                          <Form.Group> 
                            
                            <label> Fichier </label> 
                            
                            <div className="custom-file"> 
                              
                              <input type="file" className="custom-file-input" onChange={(e) => handleFileChange( index, e ) } /> 
                              
                              <label className="custom-file-label"> {fournisseur.fichier ? fournisseur.fichier.name : "Choisir un fichier" } </label> 
                              
                            </div> 
                            
                          </Form.Group> 
                          
                        </div> 
                        
                      </div> 
                      
                    </div> 
                    ) 
                  )} 
                  
                </div> 
                
                {/* ================================================= BOUTONS ================================================== */} 
                
                <div className="mt-4"> 
                  
                  <button type="button" className="btn btn-light mr-2" onClick={() => history.goBack() } disabled={saving} > Annuler </button> 
                  
                  <button type="submit" className="btn btn-primary" disabled={saving} > 
                    
                    {saving ? ( <> <span className="spinner-border spinner-border-sm mr-2" role="status" /> Enregistrement... </> ) : ( <> <i className="mdi mdi-content-save mr-1"></i> Enregistrer </> )} 
                    
                  </button> 

                  </div> 
                  
            </form> 

          </div> 

        </div> 
        
      )} 
      
    </div> 
    
  ); 

} 

export default FormulaireFournisseur;