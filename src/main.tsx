import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      newestOnTop={true}
      theme="light"
    />
  </>
);
