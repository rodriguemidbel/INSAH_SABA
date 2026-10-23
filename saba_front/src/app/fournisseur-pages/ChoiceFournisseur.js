import React, { useEffect, useState } from 'react'; 
import { Form } from 'react-bootstrap'; 
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { useParams, useHistory } from 'react-router-dom'; 
import AxiosInstance from '../Axios'; 

function Facture() { 
  
  const { id } = useParams(); 
  
  const history = useHistory(); 
  
  // ========================= // STATES // ========================= 
   
  const [startDate, setStartDate] = useState(new Date()); 
  
  const [memo, setMemo] = useState({ 
    
    reference_memo: "", 
    
    objet: "", 
    
    source_financement: "" 
  
  }); 
  
  const [fournisseurs, setFournisseurs] = useState([]); 
  
  const [fournisseurSelectionne, setFournisseurSelectionne] = useState(null); 
  
  const [loading, setLoading] = useState(true); 
  
  const [saving, setSaving] = useState(false); 
  
  // ========================= // CHARGEMENT INITIAL // ========================= 
  
  useEffect(() => { if (id) { chargerMemo(); } }, [id]); 
  
  // ========================= // CHARGER MEMO + FOURNISSEURS // ========================= 
  
  const chargerMemo = () => { 
    
    setLoading(true); 
    
    AxiosInstance.get(`memo/${id}/`) .then((res) => { 
      
      const data = res.data; 
      
      // ------------------------- // Informations du mémo // ------------------------- 
      
      setMemo({ 
        
        reference_memo: data.reference_memo || "", 
        
        objet: data.objet || "", 
        
        source_financement: data.source_financement || "" 
      
      }); 
      
      // ------------------------- // Date du mémo // ------------------------- 
       
      if (data.date) { setStartDate(new Date(data.date)); } 
      
      // ------------------------- // Fournisseurs // ------------------------- 
      
      setFournisseurs(data.fournisseur || []); 
      
      // ------------------------- // Fournisseur déjà choisi // ------------------------- 
      
      if (data.fournisseur_choisi) { 
        
        /* * Selon ton serializer, fournisseur_choisi * peut être : * * 1. un ID : * 3 * * ou * * 2. un objet : * { id: 3, agence: "Skyjet", ... } */ 
        
        if (typeof data.fournisseur_choisi === "object") { 
          
          setFournisseurSelectionne( data.fournisseur_choisi.id ); 
        
        } else { 
          
          setFournisseurSelectionne( data.fournisseur_choisi ); 
        
        } 
      
      } else { 
        
        setFournisseurSelectionne(null); 
      
      } 
    
    }) .catch((err) => { 
      
      console.error( "Erreur lors du chargement du mémo :", err.response?.data || err ); 
      
      alert("Impossible de charger les informations du mémo."); 
    
    }) .finally(() => { setLoading(false); }); 
  
  }; 
  
  // ========================= // CHOIX FOURNISSEUR // ========================= 
 
  const handleRadioChange = (fournisseurId) => { setFournisseurSelectionne(fournisseurId); 

  }; 
  
  // ========================= // ENREGISTRER LE CHOIX // ========================= 
  
  const handleSaveChoice = () => { if (!fournisseurSelectionne) { 
    
    alert("Veuillez choisir un fournisseur."); 
    
    return; 
  
  } setSaving(true); AxiosInstance.patch( `memo/${id}/`, { 
    
    fournisseur_choisi: fournisseurSelectionne 
  
  } ) .then(() => { 
    
    alert("Fournisseur choisi avec succès."); 
    
    history.push( "/fournisseur-pages/liste-fournisseur" ); 
  
  }) .catch((err) => { 
    
    console.error( "Erreur lors de l'enregistrement :", err.response?.data || err ); 
    
    alert( "Une erreur est survenue lors de l'enregistrement du fournisseur." ); 
  
  }) .finally(() => { setSaving(false); }); }; 
  
  // ========================= // ANNULER // ========================= 
   
  const handleCancel = () => { history.goBack(); }; 
  
  // ========================= // AFFICHAGE CHARGEMENT // ========================= 
  
  if (loading) { 
    
    return ( 
      
      <div className="container-fluid"> 
        
        <div className="page-header"> 
        
          <h3 className="page-title"> Choix de fournisseur </h3> 
          
        </div> 
        
        <div className="row"> 
        
          <div className="col-12"> 
          
            <div className="card"> 
            
              <div className="card-body text-center"> 
              
                <div className="spinner-border text-primary" role="status" > 
                
                  <span className="sr-only"> Chargement... </span> 
                  
                </div> 
                
                <p className="mt-3 mb-0"> Chargement des fournisseurs... </p> 
                
              </div> 
              
            </div> 
            
          </div> 
          
        </div> 
        
      </div> 

    ); 
  
  } 
  
  // ========================= // RENDER // ========================= 
  
  return ( 
    
    <div> 
    
    {/* ========================= PAGE HEADER ========================= */} 
    
      <div className="page-header"> 
      
        <h3 className="page-title"> Choix de fournisseur </h3> 
        
      </div> 
      
      <div className="row"> 
      
        <div className="col-12 grid-margin"> 
        
          <div className="card"> 
          
            <div className="card-body"> 
            
              <h4 className="card-title"> Fournisseurs enregistrés </h4> 
              
              {/* ========================= INFORMATIONS MEMO ========================= */} 
            
              <div className="mb-4 border-bottom pb-4"> 
              
                <h5 className="mb-3"> Informations Memo </h5> 
                
                <div className="row"> 
                
                  {/* REFERENCE */} 
                  
                  <div className="col-md-6"> 
                  
                    <Form.Group className="mb-3"> 
                    
                      <label> Reference Memo </label> 
                      
                      <Form.Control type="text" value={memo.reference_memo} readOnly /> 
                      
                    </Form.Group> 
                      
                  </div> 
                  
                  {/* DATE */} 
                  
                  <div className="col-md-6"> 
                  
                    <Form.Group className="mb-3"> 
                    
                      <label> Date </label> 
                      
                      <DatePicker className="form-control" selected={startDate} disabled dateFormat="dd/MM/yyyy" /> 
                      
                    </Form.Group> 
                    
                  </div> 
                  
                </div> 
                
                <div className="row"> 
                
                  {/* SOURCE FINANCEMENT */} 
                
                  <div className="col-md-6"> 
                  
                    <Form.Group className="mb-3"> 
                    
                      <label> Source Financement </label> 
                      
                      <Form.Control type="text" value={memo.source_financement} readOnly /> 
                      
                    </Form.Group> 
                    
                  </div> 
                  
                  {/* OBJET */} 
                  
                  <div className="col-md-6"> 
                  
                    <Form.Group className="mb-3"> 
                    
                      <label> Objet </label> 
                      
                      <Form.Control type="text" value={memo.objet} readOnly /> 
                      
                    </Form.Group> 
                    
                  </div> 
                  
                </div> 
                  
              </div> 
              
              {/* ========================= FOURNISSEURS ========================= */} 
              
              <div> 
              
                <h5 className="mb-3"> Fournisseurs disponibles </h5> 
                
                <div className="row"> {fournisseurs.length > 0 ? ( fournisseurs.map((fournisseur, index) => ( 
                  
                  <div className="col-md-4 grid-margin stretch-card" key={fournisseur.id} > 
                  
                    <div className="card"> 
                      
                      <div className="card-body"> 
                        
                        <h4 className="card-title"> Fournisseur {index + 1} </h4> 
                        
                        {/* ========================= RADIO ========================= */} 
                        
                        <div className="form-check mb-3"> 
                          
                          <label className="form-check-label"> 
                            
                            <input type="radio" className="form-check-input" name="fournisseur" checked={ fournisseurSelectionne === fournisseur.id } onChange={() => handleRadioChange( fournisseur.id ) } /> Choisir ce fournisseur <i className="input-helper"></i> 
                            
                          </label> 
                          
                        </div> 
                        
                        {/* ========================= AGENCE ========================= */} 
                        
                        <Form.Group className="mb-3"> 
                          
                          <label> Agence </label> 
                          
                          <Form.Control type="text" value={fournisseur.agence || ""} readOnly /> 
                          
                        </Form.Group> 
                        
                        {/* ========================= MONTANT ========================= */} 
                        
                        <Form.Group className="mb-3"> 
                          
                          <label> Montant </label> 
                          
                          <Form.Control type="text" value={ fournisseur.montant !== null && fournisseur.montant !== undefined ? fournisseur.montant : "" } readOnly /> 
                          
                        </Form.Group> 
                        
                        {/* ========================= OBSERVATION ========================= */} 
                        
                        <Form.Group className="mb-3"> 
                          
                          <label> Observation </label> 
                          
                          <Form.Control as="textarea" rows={3} value={ fournisseur.observation || "" } readOnly placeholder="Aucune observation" /> 
                          
                        </Form.Group> 
                        
                        {/* ========================= FACTURE ========================= */} 
                        
                        <Form.Group className="mb-3"> 
                          
                          <label className="mb-2"> Facture </label> 
                          
                          <br /> 
                          
                          <button type="button" className="btn btn-dark btn-icon-text" > 
                            
                            <i className="mdi mdi-eye"></i> &nbsp; Voir 
                            
                          </button> 
                          
                        </Form.Group> 
                        
                      </div> 
                      
                    </div> 
                    
                  </div> 

                  )) ) 
                  
                  : 
                  
                  ( 
                  
                  <div className="col-12"> 
                  
                    <div className="alert alert-warning"> Aucun fournisseur enregistré pour ce memo. </div> 
                    
                  </div> 

                  )} 
                  
                </div> 
                
              </div> 
              
              {/* ========================= BOUTONS ========================= */} 
              
              <div className="mt-4"> 
                
                <button type="button" className="btn btn-primary me-2" onClick={handleSaveChoice} disabled={ saving || fournisseurs.length === 0 } > {saving ? ( <> <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" ></span> Enregistrement... </> ) : ( <> <i className="mdi mdi-check"></i> &nbsp; Valider </> )} </button> 
                
                <button type="button" className="btn btn-dark" onClick={handleCancel} disabled={saving} > <i className="mdi mdi-close"></i> &nbsp; Cancel </button> 
                
              </div> 
              
            </div> 
            
          </div> 
          
        </div> 
        
      </div> 
      
    </div> 
    
  ); 

} 

export default Facture;