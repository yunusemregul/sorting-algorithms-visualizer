import * as utils from "../utils.js";

function sort(arr)
{
	const n = arr.length;
	let actions = [];

	for (let i = 0; i < n; i++)
	{
		let min = i;
		for (let j = i + 1; j < n; j++)
		{
			actions=utils.compare(min,j,actions);
			if (arr[min] > arr[j])
			{
				min = j;
			}
		}
		if (min !== i)
		{
			[arr, actions] = utils.swap(arr, i, min, actions);
		}
	}

	return actions;
}

export { sort };