import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import AxiosInstance from '../Axios';
import { useParams, useHistory } from "react-router-dom";

function ModifierMemo() {

  const { id } = useParams();
  
  const history = useHistory();

  const { register, handleSubmit, control, setValue } = useForm();

  const [loading, setLoading] = useState(true);

  // Charger le memo
  useEffect(() => {

    if (!id) return;

    AxiosInstance.get(`http://127.0.0.1:8000/memo/${id}/`)
      .then(res => {
       
        const data = res.data;

        setValue("reference_memo", data.reference_memo);
        setValue("objet", data.objet);
        setValue("source_financement", data.source_financement);
        setValue("date", new Date(data.date));

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  }, [id, setValue]);

  // Submit
  const onSubmit = (data) => {

    AxiosInstance.put(`http://127.0.0.1:8000/memo/${id}/`, {
      reference_memo: data.reference_memo,
      objet: data.objet,
      source_financement: data.source_financement,
      date: data.date ? data.date.toISOString().split("T")[0] : null
    })
    .then(() => {
      alert("Memo modifié avec succès");
      history.push("/memo-pages/liste-memo");
    })
    .catch(err => {
      console.log(err.response?.data);
    });
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Modifier Memo </h3>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">

              <h4 className="card-title">Formulaire de modification</h4>

              <form className="form-sample" onSubmit={handleSubmit(onSubmit)}>

                <div className="row">

                  {/* Reference */}
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Reference</label>
                      <div className="col-sm-9">
                        <Form.Control {...register("reference_memo")} type="text" />
                      </div>
                    </Form.Group>
                  </div>

                  {/* Date */}
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Date</label>
                      <div className="col-sm-9">
                        <Controller
                          control={control}
                          name="date"
                          render={({ field }) => (
                            <DatePicker
                              className="form-control w-100"
                              selected={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </Form.Group>
                  </div>

                </div>

                <div className="row">

                  {/* Objet */}
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Objet</label>
                      <div className="col-sm-9">
                        <Form.Control {...register("objet")} type="text" />
                      </div>
                    </Form.Group>
                  </div>

                  {/* Source financement */}
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Source financement</label>
                      <div className="col-sm-9">
                        <select className="form-control" {...register("source_financement")}>
                          <option value="">-- Choisir --</option>
                          <option>COAHP</option>
                          <option>CILSS</option>
                          <option>P2_RS</option>
                          <option>UEMOA</option>
                          <option>CEDEAO</option>
                        </select>
                      </div>
                    </Form.Group>
                  </div>

                </div>

                <button type="submit" className="btn btn-primary mr-2">
                  Modifier
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => history.push("/memo-pages/liste-memo")}
                >
                  Annuler
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifierMemo;