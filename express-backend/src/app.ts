import express, { Application } from "express";
import { port } from "./config";
import loginAndSignUpRoutes from "./routes/loginAndSignUp";
import morgan from "morgan";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/", loginAndSignUpRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
