import { connect } from "mongoose";
import type { ErrorRes, SuccessRes } from "../types/types.js"
export const connectDB = async ( uri : string ):Promise<ErrorRes | SuccessRes> =>{
    try{
        const res = await connect(uri);
        return {
            message : "DB successfully connected",
            res : "Success",
            status : 200
        }
    }
    catch(err: unknown){
        console.log(err);
        console.log("Error Connecting with Database")
        return {
            message : "Error Connecting Database",
            status : 500,
            error : err
        }
    }
}
