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

const router = Router()


router.get("/search", (req, res)=>{

})


router.get("/", (req, res) => {
    res.send("lllll")
})

export default router