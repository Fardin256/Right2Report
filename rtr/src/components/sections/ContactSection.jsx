import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-section">
      <div className="container">
        <h1>Contact Us</h1>
        <p>We would love to hear from you. Please fill out the form below.</p>

        {submitted && <p className="success">Message sent successfully!</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;