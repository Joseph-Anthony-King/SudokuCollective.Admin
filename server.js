import express from "express";

const app = express();

app.use("/", express.static("app/dist", {index: "index.html"}));

app.set("port", (process.env.PORT || 8082));

app.listen(app.get("port"), () => {
  console.log(`Server is listening on port ${app.get("port")}...`);
});
