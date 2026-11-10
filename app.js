import express from "express";
import cors from "cors";
import routes from "./src/routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());

routes({ app });

export default app;
