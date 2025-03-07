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
        import.meta.env.VITE_EMAILJS_SERVICE_ID, // Replace with your EmailJS Service ID
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Replace with your EmailJS Template ID
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Replace with your EmailJS Public Key
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
    <div className="fixed inset-0 flex items-center justify-center bg-night bg-opacity-50 z-50 text-tangerine">
      <div className="bg-teal p-10 rounded-sm shadow-lg w-full md:w-[40%] relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-6 px-6 py-2 font-sans font-bold text-tangerine hover:text-tangerine/80 transition-all ease"
      >
        X
      </button>
        <h2 className="text-2xl font-bold mb-4">Contact me</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium grayscale">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 bg-teal"
              placeholder="Your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium grayscale">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border bg-teal p-2"
              placeholder="Your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1 font-medium grayscale">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border bg-teal p-2"
              rows={4}
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full p-2 text-white rounded ${
              isSending ? "bg-persian/20" : "bg-tangerine/90 hover:bg-tangerine"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
        <div className="h-12">
        {isSent && (
          <p className="text-green-400 py-4">Email sent successfully!</p>
        )}
        {error && <p className="text-red-400 py-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
