import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "VideoReel Editor";

createRoot(document.getElementById("root")!).render(<App />);
