import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog.tsx";
import { Button } from "./components/ui/button.tsx";

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
