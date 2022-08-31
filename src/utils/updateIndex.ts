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

// delete files collection from db to make sure that the db doesn't have files that were deleted from the drive
import mongoose from "mongoose";
import recursiveTraverse from "./recursiveTraverse";
import recursionCallback from "./recursionCallback";
import FileModel from "../models/File";
import { File } from "../interfaces/index.interfaces";

// the array that will be used by the recursion callback to add the parsed objects
let indexedFiles: File[] = [];
const rootDriveFolderId: string = process.env.ROOT_DRIVE_FOLDER_ID || "";

if (!rootDriveFolderId)
    throw("No root folder id was provided, exiting with error");



const updateIndex = async () => {
    try {
        //running the recursive traverse function that will save the file objects in indexedFiles array
        await recursiveTraverse(rootDriveFolderId, [], recursionCallback, indexedFiles).then(async () => {

            //Dropping the current database to replace it with the new data
            try {
                await mongoose.connection.db.collection("files").drop();
            } catch (e) {
                console.log("Error while dropping \"files\" collection, perhaps it's already not there");
            }

            //saving indexedFiles in db
            await FileModel.insertMany(indexedFiles, {
                ordered: false
            });

            indexedFiles = []; //to save memory after we have saved it to the db
        });

    } catch (e) {
        console.log(e);
    }
}

export default updateIndex;