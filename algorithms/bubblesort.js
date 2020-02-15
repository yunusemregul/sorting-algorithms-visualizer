import * as utils from "../utils.js";

let name = 'Bubble Sort';

function sort(arr)
{
	let copy = arr.slice();
    let n = copy.length-1;
    let swapped;

	let actions = [];

    do {
        swapped = false;
        for (let i=0; i < n; i++)
        {
            actions = utils.compare(i,i+1,actions);
            if (copy[i] > copy[i+1])
            {
                actions = utils.swap(copy, i, i+1, actions);
                swapped = true;
            }
        }
        n--;
    } while (swapped);

	return actions;
}

export {name, sort};