import React from "react";

function RecentMemos({ memos }) {

    return (

        <div className="card">

            <div className="card-body">

                <h4 className="card-title">

                    Derniers Mémos

                </h4>

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead>

                            <tr>

                                <th>Référence</th>

                                <th>Objet</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                memos.map((memo) => (

                                    <tr key={memo.id}>

                                        <td>{memo.reference_memo}</td>

                                        <td>{memo.objet}</td>

                                        <td>{memo.date}</td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default RecentMemos;