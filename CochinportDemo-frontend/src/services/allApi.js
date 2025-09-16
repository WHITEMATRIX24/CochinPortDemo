
import { commonApi } from "./commonApi"
import { serverUrl } from "./serverUrl"

//register
export const registerApi = async(reqBody)=>{
  return  await commonApi('POST',`${serverUrl}/register`,reqBody,"")
}

//login
export const loginApi= async(reqBody)=>{
  return await commonApi('POST',`${serverUrl}/api/auth/login`,reqBody,"")
}