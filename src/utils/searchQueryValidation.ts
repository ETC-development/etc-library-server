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

import {
    SearchQueryValidation,
    SearchQueryValidationReturn,
    SearchRequestQuery, ValidSearchQuery
} from "../interfaces/index.interfaces";

// a helper function to return error object from searchQueryValidation function below
const valError = (error: string): SearchQueryValidationReturn => {
    return { error, ok: false };
};

//we need to check if the given query is valid or not
//for example, we check the types validity and their order
//like: you can't provide "semester" without providing "year" and so on

/**
 * A function that validates the query object received from the request to /search
 * @param {SearchRequestQuery} query        - The query object
 * @return {SearchQueryValidationReturn}    - a valid query object along with error msg and if validation was ok or not
 * */
const searchQueryValidation: SearchQueryValidation = ({
    name,
    year,
    type,
    module,
    submodule,
    semester,
    limit,
    page,
}) => {
    //giving default values to page and limit when not provided
    let resultQuery: ValidSearchQuery = {
        limit: 20,
        page: 1,
    };

    try {
        //checking for name
        if (name) {
            const regex = new RegExp(name.trim(), "i");
            resultQuery.name = { $regex: regex };
        }

        //checking for year
        if (year) {
            //if year exists in the query
            const yearNum = +year;
            if (Number.isInteger(yearNum)) {
                //checking if year is a correct integer
                if (!(yearNum >= 1 && yearNum <= 5)) {
                    return valError("Year has to be between 1 and 5");
                }
            } else {
                return valError("Year has to be a valid integer between 1 and 5");
            }

            resultQuery.year = year;
        }

        //checking for semester
        if (semester) {
            if (year) {
                const semNum = +semester;
                if (semNum !== 1 && semNum !== 2) {
                    return valError("Semester can either be 1 or 2");
                }
            } else {
                return valError("Year has to be provided when specifying Semester");
            }

            resultQuery.semester = semester;
        }

        //checking for module
        // Maybe_TODO: Add list of all possible modules to validate
        if (module) {
            resultQuery.module = module.trim().toLowerCase();
        }

        if(submodule){
            resultQuery.submodule = submodule.trim().toLowerCase();
        }

        if (type) {
            resultQuery.type = type.trim().toLowerCase();
        }

        if (page) {
            if (Number.isInteger(+page)) {
                if (+page > 0) {
                    resultQuery.page = +page; //converting page to number
                }
            }
        }

        if (limit) {
            if (Number.isInteger(+limit)) {
                if (+limit > 0) {
                    resultQuery.limit = +limit; //converting limit to number
                }
            }
        }

        return { ok: true, query: resultQuery };
    } catch (e) {
        console.log(e);
        return valError("Unexpected error");
    }
};

export default searchQueryValidation;
