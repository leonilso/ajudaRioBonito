import express from "express";
// import bodyParser from "body-parser"; // NÃO PRECISA
// import multer from "multer"; // NÃO PRECISA AQUI (vai para as rotas)
import path from "path";
import { fileURLToPath } from 'url';

// Rotas
import usuariosRoutes from "./routes/usuariosRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import centrosRoutes from "./routes/centrosRoutes.js";
import necessidadesRoutes from "./routes/necessidadesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'build');

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(express.static(clientBuildPath));

// Rotas da API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/voluntarios", volunteerRoutes);
app.use("/api/doacoes", donationRoutes);
app.use("/api/centros", centrosRoutes);
app.use("/api/necessidades", necessidadesRoutes);

// Rota "Catch-all" (Agora deve funcionar)
app.use((req, res, next) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default app;