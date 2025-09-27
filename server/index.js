import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/client.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
  });
}

startServer();
