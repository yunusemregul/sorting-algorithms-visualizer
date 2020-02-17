// actions determine what will happen on chart visually

function compare(a, b, actions)
{
    actions.push({
        operation: 'compare', 
        arguments: [a, b]
    })

    return actions;
}

function swap(arr, a, b, actions)
{
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

    if(actions)
    {
        actions.push({
            operation: 'swap', 
            arguments: [a, b]
        });

        return actions; // return the updated array and action info
    }
}

export {compare, swap};