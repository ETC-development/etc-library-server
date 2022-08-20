/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */

import {google} from "googleapis";


//credentials definitions
const googleClientId: string =
    process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_ID_PROD || ""
        : process.env.GOOGLE_CLIENT_ID_DEV || "";

const googleClientSecret: string =
    process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_SECRET_PROD || ""
        : process.env.GOOGLE_CLIENT_SECRET_DEV || "";

const googleRefreshToken: string =
    process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_REFRESH_TOKEN_PROD || ""
        : process.env.GOOGLE_REFRESH_TOKEN_DEV || "";

//initializing the oAuth api client
// TODO: implement /auth route endpoint
const oAuthClient = new google.auth.OAuth2(googleClientId, googleClientSecret, "http://localhost/auth/");

//setting the credentials to the api
oAuthClient.setCredentials({
    refresh_token: googleRefreshToken,
});



const drive = google.drive({ version: "v3", auth: oAuthClient });