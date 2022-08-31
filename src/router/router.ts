/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */

import { Router } from "express";
import searchEndpoint from "../controllers/search/search.controller";
import updateIndexEndpoint from "../controllers/update-index/update-index.controller";
import rateLimit from "express-rate-limit";

const router = Router();

const searchLimiter = rateLimit({
    windowMs: 1000 * 60,  // 1 minute
    max: 50, // maximum of 100 request per minute
    standardHeaders: true
})

const updateIndexLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,    // 5 minute
    max: 1, //only allow 1 request per minute
    standardHeaders: true,
    message: "You have reached maximum calls, please wait before making another request to this endpoint"
})

router.get("/search", searchLimiter, searchEndpoint);

router.get("/update-index", updateIndexLimiter, updateIndexEndpoint);

// for pinging services
router.head("/update-index", updateIndexLimiter, updateIndexEndpoint);

router.get("/", (req, res) => {
    res.send("working");
});

// for pinging service
router.head("/", (req, res)=>{
    res.status(200).send();
})

export default router;
