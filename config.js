const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const BACKEND_URL = isLocalhost
    ? "http://localhost:3000"
    : "https://wisdom-ai-be-lime.vercel.app/";