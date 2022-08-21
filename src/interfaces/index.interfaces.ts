/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */



import mongoose from "mongoose";

export interface File {
    name: string;
    url: string;
    type: string;
    module: string;
    semester: string;
    year: string;
}

export interface MFile extends mongoose.Document{
    name: string;
    url: string;
    type: string;
    module: string;
    semester: string;
    year: string;
}

//TODO: add count and page
export interface SearchRequestQuery {
    name?: string;
    type?: string;
    module?: string;
    semester?: string;
    year?: string;
    
    //for pagination
    page: number;
    limit: number;
    
}

export interface RecursionTraverseCallback {
    (path: string[], id: string, outputArr: File[]): void;
}

export interface SearchQueryValidationReturn {
    ok?: boolean;
    error?: string;
    query?: SearchRequestQuery;
}

export interface SearchQueryValidation {
    (query: SearchRequestQuery): SearchQueryValidationReturn;
}

export interface SearchResponse {
    files: File[];
    totalFilesCount: number;
    totalPages: number;
    currentPage: number;
    error?: string;
}
