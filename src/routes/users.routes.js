import { Router } from "express";

const route = Router();

route.get("/", (req, res) => {
  // res.status(200).send(`Funciono OK`);
  res.render("realTimeProducts", {});
});

export default route;
