import  store from "./store";


store.dispatch({
    type: "bugAdded",
    payload:{
        discription:"Bug1",
        age : "14",
        score: "30",
    }
});


console.log(store.getState());


