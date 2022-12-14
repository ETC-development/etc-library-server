/*
 *
 *  *      This file is part of etc-library-server.
 *  *
 *  *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *  *
 *  *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *  *
 *  *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 *
 *
 */

import { Request, Response } from "express";
import updateIndex from "../../utils/updateIndex";

const updateIndexEndpoint = async (req: Request, res: Response) => {
    try{
        await updateIndex();
        res.send("updated");
    }catch(e){
        res.status(503).send(e)
        console.log(e)
    }
};

export default updateIndexEndpoint;