// actions determine what will happen on chart visually

// returns 0 if first argument is equal to second
// 1 if first argument is bigger than second
// -1 if second argument is bigger than first
function compare(a, b, actions)
{
    actions.push({
        action: 'compare', 
        arguments: [a, b]
    })

    return actions;
}

function swap(arr, a, b, actions)
{
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

    actions.push({
        action: 'swap', 
        arguments: [a, b]
    });

    return [arr, actions]; // return the updated array and action info
}

export {compare, swap};