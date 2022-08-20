/*
 *      This file is part of etc-library-server.
 *
 *     etc-library-server is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *     etc-library-server is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License along with etc-library-server. If not, see <https://www.gnu.org/licenses/>.
 */

import { model, Schema } from "mongoose";
import { File } from "interfaces/index.interfaces";

const FileSchema = new Schema<File>({
    name: String,
    module: String,
    type: String,
    url: String,
    year: Number,
    semester: Number,
});

const FileModel = model<File>("files", FileSchema);

export default FileModel;
