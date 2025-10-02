import express from "express";
import morgan from "morgan";
import cors from "cors";

// routes
import authRouter from "./routes/auth.js";
import continentsRouter from "./routes/continents.js";
import countriesRouter from "./routes/countries.js";
import citiesRouter from "./routes/cities.js";
import spotsRouter from "./routes/spots.js";
import favoritesRouter from "./routes/favorites.js";

const app = express();

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// base route
app.get("/", (req, res) => {
  res.send("Welcome to WebSpot Guide API");
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/continents", continentsRouter);
app.use("/api/countries", countriesRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/spots", spotsRouter);
app.use("/api/favorites", favoritesRouter);

// fallback (404 handler)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
