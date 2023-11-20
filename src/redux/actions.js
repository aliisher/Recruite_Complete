import { BUG_ADDED } from "./actionTypes";

export function bugAdded(arr){
    return {
        type: BUG_ADDED,
        payload:{
            discription:arr
        }
    };
}
