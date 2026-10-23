import React from "react";

function StatCard({

    title,

    value,

    icon,

    color = "primary",

    subtitle = ""

}) {

    return (

        <div className="col-xl-3 col-lg-6 col-md-6 grid-margin stretch-card">

            <div className="card">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h6 className="text-muted mb-2">

                                {title}

                            </h6>

                            <h2 className="font-weight-bold mb-1">

                                {value}

                            </h2>

                            {

                                subtitle &&

                                <small className="text-muted">

                                    {subtitle}

                                </small>

                            }

                        </div>

                        <div
                            className={`icon icon-box-${color}`}
                            style={{
                                width: 55,
                                height: 55,
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >

                            <i
                                className={`mdi ${icon}`}
                                style={{
                                    fontSize: 28
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StatCard;