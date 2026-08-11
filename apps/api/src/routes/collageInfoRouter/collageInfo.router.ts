import { Router } from "express";
import * as collageController from "../../controller/collageInfo.controller";
const collageRule = Router();
collageRule.get("/", collageController.getCollageInfo);
collageRule.get("/stats", collageController.getCollageStats);

export default collageRule;
