import React from "react";

import { useParams } from "react-router-dom";
import reports from "../../../mock-data/reports.json";

function Details() {
    const {id} = useParams();
    const report = reports.find((item) => String(item.id) === id);

    console.log("ID dari URL:", id);
    console.log("Contoh data JSON:", reports[0]);

    if (!report) return <p>report not found or been recently removed</p>

	return (
		<main className="details-page">
			<header className="details-page__header">
				<h1>Details</h1>
				<p>Explore the information on this page.</p>

			</header>

			<section className="details-page__content" aria-label="Details">
				{/* Add details page content here. */}


                <p> Tes nama = {report.itemName}
                    Tes Desc = {report.description} </p>
			</section>
		</main>
	);
}

export default Details;
