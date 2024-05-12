// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

import { Data } from "@/types/data";

const shuffle = (array: Data[]) => {
    let cur = array.length;

    while (cur !== 0) {
        const rand = Math.floor(Math.random() * cur);
        cur--;

        [array[cur], array[rand]] = [array[rand], array[cur]];
    }


    console.log(array)
    return array;
};


export default shuffle;