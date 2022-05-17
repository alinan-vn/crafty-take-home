import { inventory } from "../data/inventory-data.js"
import { food } from "../data/food-data.js";

export function processOrder(order){
    let processedOrder = []

    order.forEach(itemInfo => {
        let itemId = itemInfo["item-id"]
        let inventoryAmountNeeded = itemInfo["units-needed"]
        
        // first will check to see if item wanted can fill all or part of the inventory
        let orderDetailsForItem = returnOrderDetails(itemId, inventoryAmountNeeded)
        let newInventoryAmount = updateInventoryAndReturnNewNeededAmountOrFalse(itemId, inventoryAmountNeeded) 

        // conditional will be false if available inventory is ZERO(returns false), 
        // conditional will pass new inventory amount is ZERO (falsy value)
        if(!(newInventoryAmount === false)){
            processedOrder.push(orderDetailsForItem)
            inventoryAmountNeeded = newInventoryAmount
        }

        let count = 0

        // finds alternatives if needed amount is not fulfilled
        while(inventoryAmountNeeded > 0){
            // find Alternative food item
            let altItemId = returnAlternativeItemId(itemId)
            if(altItemId){
                let altNewItemOrderDetails = returnOrderDetails(altItemId, inventoryAmountNeeded)
                let altNewInventoryAmount = updateInventoryAndReturnNewNeededAmountOrFalse(altItemId, inventoryAmountNeeded)

                if(!(altNewInventoryAmount === false)){
                    processedOrder.push(altNewItemOrderDetails)
                    inventoryAmountNeeded = altNewInventoryAmount
                }
            }

            count += 1
            // could set conditional to count to 3 and remove second conditional, but makes more sense to see it visually like this
            // stops infinite loop if no new inventory has been found
            if(count == 2 && inventoryAmountNeeded != 0){ 
                processedOrder.push(returnOrderUnfulfilledObj(inventoryAmountNeeded))

                inventoryAmountNeeded = 0
            }
        }
    });

    return {
        "order": processedOrder,
        "inventory": inventory
    }
}

// returns an object to indivate order was filled completely
function returnOrderUnfulfilledObj(amountStillNeeded){
    return {
        "item-id": null,
        "item-name": `COULD NOT FILL AMOUNT NEEDED, NUM OF UNITS LEFT: ${amountStillNeeded}`,
        "units-of-item": null
    }
}

function returnItemNameFromFoodList(id){
    let chosenItemName = ''

    food.forEach(item => {
        if(item.id == id){
            chosenItemName = item.name
        }
    })

    return chosenItemName
}

function returnInventoryAmountForItem(id){
    return inventory[id]
}

// returns alt item id of an item without an empty inventory
function returnAlternativeItemId(id){
    let foodItem = returnFoodItemDetails(id)
    let foodAlternativeIds = foodItem.alternative
    let chosenAltFoodItemId = false
    
    foodAlternativeIds.forEach(altId => {
        // first conditional will check to see that alt item's inventory is not empty, if so, it will move on to the next alt item
        // second conditional checks to see if an alternative has already been found, if so, no need to find another alterntive
        let invOfAltItem = returnInventoryAmountForItem(altId)
        if(invOfAltItem > 0 && !chosenAltFoodItemId){
            chosenAltFoodItemId = altId
        }
    })

    return chosenAltFoodItemId
}

// returns an object of the order of an item's details
function returnOrderDetails(itemId, neededInventoryAmount){
    let inventoryAmount = returnInventoryAmountForItem(itemId)

    if(neededInventoryAmount <= inventoryAmount){
        return {
            "item-id": itemId,
            "item-name": returnItemNameFromFoodList(itemId),
            "units-of-item": neededInventoryAmount
        }
    } 
    else if(neededInventoryAmount > inventoryAmount){
        return {
            "item-id": itemId,
            "item-name": returnItemNameFromFoodList(itemId),
            "units-of-item": inventoryAmount
        }
    }
}

// updates inventory if inventory is available, otherwise returns false to indicate inventory cannot be updated
function updateInventoryAndReturnNewNeededAmountOrFalse(itemId, neededInventoryAmount){

    let inventoryAmount = returnInventoryAmountForItem(itemId)

    if (inventoryAmount == 0){
        return false
    }
    else if(neededInventoryAmount <= inventoryAmount){
        let newInventoryAmount = inventoryAmount - neededInventoryAmount
        inventory[itemId] = newInventoryAmount 

        return 0
    } 
    else if(neededInventoryAmount > inventoryAmount){
        inventory[itemId] = 0

        return neededInventoryAmount - inventoryAmount
    }
}

function returnFoodItemDetails(id){
    let foodItem = {}
    food.forEach(f => {
        if(f.id == id){
            foodItem = f
        }
    })
    return foodItem
}