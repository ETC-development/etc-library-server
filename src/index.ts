/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */


//initializing env variables before importing anything else to make sure it will cover them
import dotenv from "dotenv";
dotenv.config();


import express from "express";
import router from "./router/router";
import cors from "cors";
import mongoose from "mongoose";
import { File } from "interfaces/index.interfaces";
import recursiveTraverse from "./utils/recursiveTraverse";
import recursionCallback from "./utils/recursionCallback";
import FileModel from "./models/File";



const app = express();

const PORT = process.env.PORT || 3001;

const mongoURL: string =
    process.env.NODE_ENV === "production"
        ? process.env.MONGO_PROD || ""
        : process.env.MONGO_DEV || "";


const rootDriveFolderId: string = process.env.ROOT_DRIVE_FOLDER_ID || "";

if (!rootDriveFolderId)
    throw("No root folder id was provided, exiting with error");


app.use(cors());
app.use(express.json());

app.use("/", router);

// the array that will be used by the recursion callback to add the parsed objects
let indexedFiles: File[] = [];

mongoose
    .connect(mongoURL)
    .then(async () => {
        console.log("connected to db");


        // delete files collection from db to make sure that the db doesn't have files that were deleted from the drive
        try {
            await mongoose.connection.db.collection("files").drop();
        } catch (e) {
            console.log("Error while dropping \"files\" collection, perhaps it's already not there");
        }

        try {
            //running the revursive traverse function that will save the file objects in indexedFiles array
            await recursiveTraverse(rootDriveFolderId, [], recursionCallback, indexedFiles).then(async () => {
                console.log(indexedFiles);
                //save indexedFiles in db
                await FileModel.insertMany(indexedFiles, {
                    ordered: false
                });

                indexedFiles = []; //to save memory after we have saved it to the db
            });

        } catch (e) {
            console.log(e);
        }

        app.listen(PORT, () => console.log("running"));

    })
    .catch((e) => {
        console.log(e);
    });
