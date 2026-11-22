import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Lost & Found Website</h1>
            </header>

            <main>
                <section className="hero-section">
                    <h2>Lost something important or found something that belongs to someone else? You've come to the right place!</h2>
                    <p>Connecting students who have lost their belongings with those who have found them.</p>
                </section>

                <section className="home-options">
                    <div className="option-card">
                        <h2>Find an Item</h2>
                        <p>Browse lost and found reports</p>
                        <Link to="/views" className="option-button">View Reports</Link>
                    </div>

                    <div className="option-card">
                        <h2>Report an Item</h2>
                        <p>Submit a lost or found item report</p>
                        <Link to="/report-submission" className="option-button">Submit Report</Link>
                    </div>
                </section>
            </main>

        </div>
    );
}

export default Home;