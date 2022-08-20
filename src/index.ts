/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */

import express from "express";
import dotenv from "dotenv";
import router from "./router/router";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

const mongoURL: string =
    process.env.NODE_ENV === "production"
        ? process.env.MONGO_PROD || ""
        : process.env.MONGO_DEV || "";



app.use(cors());
app.use(express.json());

app.use("/", router);

mongoose
    .connect(mongoURL)
    .then(() => {
        console.log("connected to db");
        //traverse the drive and save files in db
        app.listen(PORT, () => console.log("running"));
    })
    .catch((e) => {
        console.log(e);
    });
