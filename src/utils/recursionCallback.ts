/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */

import { File, RecursionTraverseCallback } from "interfaces/index.interfaces";


// this function will get called for each file given by the recursive traversal function (recursiveTraverse.ts)
// the purpose of this function is to parse the path of the file in order to extract info

/**
 * @param {string[]} path       - An array of string that represent the path of a file : ["first year", "semester 2", "algebra1", "exams", "exam1.pdf"]
 * @param {string} id           - A string that represents the Google Drive ID of a file, it's what we'll represent the URL of the file
 * @param {File[]} outputArr    - The array which we'll push the parsed File objects to, later its elements will be written in bulk to the Mongodb collection
* */
const recursionCallback: RecursionTraverseCallback = (path: string[], id: string, outputArr: File[]) => {
    let file: File = {
        //initializing the file object with default values
        name: "",
        year: "0",
        type: "",
        semester: "0",
        module: "",
        url: id
    };


    try {
        // assigning name
        file.name = path.slice(-1)[0]; //slice returns an array that only has the last element of "path", so we use [0] to access its only element

        //checking for year
        if (path.length !== 1) {
            //checkin if the file isn't located directly in the root directory
            const yearNum = path[0][0];
            if (Number.isInteger(+yearNum)) {
                if (+yearNum <= 5 && +yearNum >= 1) {
                    file.year = yearNum;
                }
            }
        } else {
            return; // path only having 1 element means we're in the root folder which we don't want to index
        }

        //checking for semester
        if (path[1] && path.length !== 2) {
            //checking if semester entry exist in path AND is not the last entry
            if (path[1].includes("semester")) {
                // example, is path[1] is "semester 1", we'll have 1 here
                let semNumber = path[1].slice(-1);

                //checking if semester number is a correct integer
                file.semester = Number.isInteger(+semNumber) ? semNumber : "0"; // 0 to indicate semester wasn't provided correctly or not at all
            } else {
                file.semester = "0";
            }
        } else {
            file.semester = "0";
        }

        //checking for module
        if (path[2] && path.length !== 3) {
            file.module = path[2];
        } else {
            file.module = ""; //to indicate that module wasn't provided
        }

        if (file.module === "intensive english") {
            // in this case, we'll have an extra folders which represent submodules (reading, writing...)
            //we check for submodule
            //in this case, path[3] is the submodule
            if (path[3] && path.length !== 4) {
                file.module += ` | ${path[3]}`; //we make the module name smth like: "intensive english | reading"

                //checking for type
                let type = path[4];
                if (type && path.length !== 5) {
                    let possibleTypes = ["exams", "tests", "worksheets", "courses", "resources"];
                    if (possibleTypes.includes(type)) {
                        file.type = type;
                    } else {
                        file.type = "";
                    }
                }
            }
        } else {
            // in this case, path[3] represents the type instead of submodule
            //checking for type
            let type = path[3];
            if (type && path.length !== 4) {
                let possibleTypes = ["exams", "tests", "worksheets", "courses", "resources"];
                if (possibleTypes.includes(type)) {
                    file.type = type;
                } else {
                    file.type = "";
                }
            }
        }

        //we push the file object to the output array
        // later we'll use Model.insertMany(outputArr) in order to write many docs in parallel (best for performance)
        outputArr.push(file);
    } catch (e) {
        console.log(e);
    }

};


export default recursionCallback;