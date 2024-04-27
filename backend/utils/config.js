import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT
const ORIGIN = process.env.ORIGIN
const JWT_SECRET = process.env.JWT_SECRET

export default { MONGO_URI, PORT, ORIGIN, JWT_SECRET }