import { useState } from "react";
import emailjs from "@emailjs/browser";

interface ModalProps {
  isVisible: boolean; // Controls the modal's visibility
  onClose: () => void; // Called when the modal should close
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const result = await emailjs.send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS Template ID
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        "YOUR_PUBLIC_KEY" // Replace with your EmailJS Public Key
      );
      console.log("Email sent successfully:", result.text);
      setIsSent(true);
      setFormData({ name: "", email: "", message: "" }); // Reset the form
    } catch (err) {
      console.error("Failed to send email:", err);
      setError("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-night bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-2 px-4 py-2 text-night"
      >
        X
      </button>
        <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
        {isSent && (
          <p className="text-green-600 mb-4">Email sent successfully!</p>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1 font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full p-2 text-white rounded ${
              isSending ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
