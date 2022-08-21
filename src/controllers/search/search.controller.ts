/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */



import { Request, Response } from "express";

import FileModel from "../../models/File";
import { MFile } from "interfaces/index.interfaces";
import searchQueryValidation from "../../utils/searchQueryValidation";

const searchEndpoint = async (req: Request, res: Response) => {

    /**
     * @see searchQueryValidation
     * */
    const validation = searchQueryValidation(req.query);

    if(!validation.ok || !validation.query){
        return res.status(400).json({error: validation.error})
    }

    const query = validation.query

    console.log({ ...query });

    // we search the db and return the docs

    try{
        let files: MFile[] = []
        if(query.name)
        {
            //making a new query object but without name property
            let queryWithoutName = {... query };
            delete queryWithoutName.name;

            const regex = new RegExp(query.name, 'i')
            files = await FileModel.find({name: {$regex: regex}, ...queryWithoutName})
        }else {
            files = await FileModel.find(query)
        }

        if(files.length == 0){
            return res.status(400).json({error: "No files found, try a different query or filter"});
        }

        res.json(files)
    }catch (e) {
        console.log(e)
    }

}

export default searchEndpoint;


