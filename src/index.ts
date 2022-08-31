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


const app = express();

// to make express-rate-limiter work on production when there is a proxy
app.set('trust proxy', 1);

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
    .then(async () => {
        console.log("connected to db");
        app.listen(PORT, () => console.log("running"));
    })
    .catch((e) => {
        console.log(e);
    });
