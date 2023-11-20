import { BUG_ADDED, BUG_REMOVED,BUG_REPLACED } from "./actionTypes";
import { useWindowDimensions } from "react-native";

let lastId = 0;
export default function reducer(state = [], action){

     switch(action.type){
         case BUG_ADDED:
             return(
                 
                     
                       { description : action.payload.discription,}
                    
                
             );
         default:    
             return state;    

     }

     
}