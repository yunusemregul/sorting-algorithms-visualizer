import * as utils from "../utils.js";

let name = 'Selection Sort';

function sort(arr)
{
	let copy = arr.slice();
	const n = copy.length;
	let actions = [];

	for (let i = 0; i < n; i++)
	{
		let min = i;
		for (let j = i + 1; j < n; j++)
		{
			actions = utils.compare(min,j,actions);
			if (copy[min] > copy[j])
			{
				min = j;
			}
		}
		if (min !== i)
		{
			actions = utils.swap(copy, i, min, actions);
		}
	}

	return actions;
}

export {name, sort};