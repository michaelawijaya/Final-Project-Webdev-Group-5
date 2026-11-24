import React from "react";

import { useParams } from "react-router-dom";
import reports from "../../../mock-data/reports.json";

import Pic from "../components/details-page/picture";
import Info from "../components/details-page/info";

import "./details.css";

function Details() {
    const {id} = useParams();
    const report = reports.find((item) => String(item.id) === id);

    console.log("ID dari URL:", id);
    console.log("Contoh data JSON:", reports[0]);

    if (!report) return <p>report not found or been recently removed</p>

	return (
		<>
        
        <main>
            <div class="main-container">

                <Pic
                    img={report.imagePath}
                    tapeText= {report.type}
                />

                <Info
                    report={report}
                />

            </div>
        </main>
        </>
	);
}

export default Details;
