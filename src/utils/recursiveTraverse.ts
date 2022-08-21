/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */

import { google } from "googleapis";
import { File, RecursionTraverseCallback } from "interfaces/index.interfaces";
import googleOAuth2Client from "./googleApiAuth";

const params = {
    corpora: "drive",
    driveId: "0AFgLntsgR3PWUk9PVA",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
};

/**
 * @param {string} folderId    - The Google Drive ID of the folder that we want to traverse
 * @param {string[]} path        - The array of the path of the current folder that we are running the function on
 * @param {RecursionTraverseCallback} callback  - A callback function that will be called when the type of the current file is not folder, means when we find a file in the Drive folders tree, we use this callback to save it with its path
 * @param {File[]} outputArr           - ill only be passed to the callback function in order to save a parsed object that represents a file.
 * @see recursionCallback
 * @see File
 * */
const recursiveDriveTraversal = async (
    folderId: string | null | undefined,
    path: string[],
    callback: RecursionTraverseCallback,
    outputArr: File[]
) => {
    try {
        const drive = google.drive({ version: "v3", auth: googleOAuth2Client });
        const files = await drive.files.list({
            ...params,
            q: `'${folderId}' in parents and trashed = false`, // get files that have "folderId" as their parent and are not in the trash
        });
        await Promise.all(
            files.data.files!.map(async (file) => {
                if (file.name && file.id) {
                    let newPath: string[];
                    if (file.mimeType === "application/vnd.google-apps.folder") {
                        //making the folder's name lowercase
                        newPath = path.concat(file.name.toLowerCase());
                        //if the Google file is a folder, run the recursive function on it
                        await recursiveDriveTraversal(file.id, newPath, callback, outputArr);
                    } else {
                        // we don't need to make it lowercase bcs the file's name doesn't affect parsing its properties (semester, module,...)
                        newPath = path.concat(file.name);
                        callback(newPath, file.id, outputArr); //if the file isn't a folder, call the callback function for it
                    }
                } else {
                    throw Error("file doesn't have a name or id");
                }
            })
        );
    } catch (e) {
        console.log(e);
    }
};

export default recursiveDriveTraversal;
