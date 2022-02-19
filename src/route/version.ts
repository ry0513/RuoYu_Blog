import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
    res.locals = {
        page: "version",
    };
    res.render("layout/web");
});

export default router;
