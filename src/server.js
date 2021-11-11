import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";

import postsRouter from "./services/posts/index.js";

import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

// ******************************** MIDDLEWARES ********************************

server.use(cors());
server.use(express.json());

// ******************************** ROUTES ********************************

server.use("/posts", postsRouter);

// ******************************** ERROR HANDLERS ********************************

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGODB_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("📊 Mongo Connected❗️");

  server.listen(port, () => {
    console.table(listEndpoints(server));

    console.log(`Server running in port ${port} 📍`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(`Error on connection 💣`, error);
});
