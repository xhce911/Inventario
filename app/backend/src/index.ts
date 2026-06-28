import cors from "cors";
import express from "express";
import { requireFirebaseUser } from "./auth/requireFirebaseUser.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "robolab-inventory-api" });
});

app.get("/me", requireFirebaseUser, (_request, response) => {
  response.json({ user: response.locals.firebaseUser });
});

app.listen(port, () => {
  console.log(`RoboLab API listening on http://localhost:${port}`);
});
