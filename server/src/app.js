import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import centrosRoutes from "./routes/centrosRoutes.js";
import necessidadesRoutes from "./routes/necessidadesRoutes.js";


const app = express();
const upload = multer();
const __dirname = path.resolve();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none());

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Rotas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/voluntarios", volunteerRoutes);
app.use("/api/doacoes", donationRoutes);
app.use("/api/centros", centrosRoutes);
app.use("/necessidades", necessidadesRoutes);

export default app;