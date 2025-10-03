import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "Authorization header required" });
  }

  const token = authHeader.split(" ")[1]; // expects "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT error:", err.message);
    return res.status(401).send({ error: "Invalid or expired token" });
  }
}
