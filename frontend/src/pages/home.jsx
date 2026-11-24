import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    return (
        <div className="home-page">

            <div className="doodle-bg" aria-hidden="true">
                <span className="doodle doodle-1">✳</span>
                <span className="doodle doodle-2">⌕</span>
                <span className="doodle doodle-3">✧</span>
                <span className="doodle doodle-4">〰</span>
                <span className="doodle doodle-5">✳</span>
                <span className="doodle doodle-6">⌕</span>
            </div>

            <header className="home-header">
                <h1>Lost & Found Website</h1>
            </header>

            <main>
                <section className="hero-section">
                    <h2>Lost something on campus? Let's help you find it!</h2>
                    <p>Connecting students who have lost their belongings with those who have found them.</p>
                </section>

                <section className="home-options">
                    <div className="option-card">
                        <div className="option-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="10.5" cy="10.5" r="6.5" />
                                <path d="m16 16 4 4" />
                            </svg>
                        </div>

                        <h2>Find an Item</h2>
                        <p>Browse lost and found reports</p>
                        <Link to="/views" className="option-button">View Reports</Link>
                    </div>

                    <div className="option-card">
                        <div className="option-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                                <path d="M12 18v-6" />
                                <path d="M9 15h6" />
                            </svg>
                        </div>

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