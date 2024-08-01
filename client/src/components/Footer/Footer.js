import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="d-flex container justify-content-around">
        <ul>
          <li>Admin: John Doe</li>
          <li>Email: john@example.com</li>
          <li>Phone: 123-456-7890</li>
        </ul>
        <ul>
          <li>Admin: Jane Smith</li>
          <li>Email: jane@example.com</li>
          <li>Phone: 987-654-3210</li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
