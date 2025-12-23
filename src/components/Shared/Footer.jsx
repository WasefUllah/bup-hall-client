import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" className="footer bg-base-300 text-base-content p-10">
            <nav>
                <h6 className="footer-title">Location</h6>
                <p>Mirpur Cantonment, Dhaka-1216</p>
            </nav>
            <nav>
                <h6 className="footer-title">Contact</h6>
                <p>Provost Office: +880-XXX-XXXXXX</p>
                <p>Email: hall.info@bup.edu.bd</p>
            </nav>
            <nav>
                <h6 className="footer-title">Useful Links</h6>
                <a href="https://bup.edu.bd/" target="_blank" rel="noopener noreferrer" className="link link-hover">BUP Main Website</a>
                {/* Using standard anchor for now, or Link if you have a portal route */}
                <a href="/login" className="link link-hover">Student Portal</a>
            </nav>
        </footer>
    );
};

export default Footer;