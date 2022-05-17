import { processOrder } from "./functions/process-order.js";
// import { inventory } from "./data/inventory-data.js";

// Order(s)

const orderOne = [
    {
        "item-id": 51,
        "units-needed": 20 
    },
    {
        "item-id": 88,
        "units-needed": 10 
    }
]

const orderTwo = [
    {
        "item-id": 343,
        "units-needed": 500 
    }
]

const orderThree = [
    {
        "item-id": 201,
        "units-needed": 19 
    },
    {
        "item-id": 202,
        "units-needed": 32 
    },
    {
        "item-id": 203,
        "units-needed": 91 
    },
]

// Run Functions
console.log("============================================");
console.log("");

// checks to see if multiple alternative food items are added to the order list
const processedOrderOne = processOrder(orderOne);

console.log("ORDER ONE", processedOrderOne.order)

console.log("----INVENTORY CHECK!----", processedOrderOne.inventory, "----INVENTORY CHECK!----")

console.log("");
console.log("============================================");
console.log("");

// checks to see if an order that has no available alternatives can be filled to 
// the max amount allowed by the inventory while not looping forever
const processedOrderTwo = processOrder(orderTwo)

console.log("ORDER TWO", processedOrderTwo.order)

console.log("----INVENTORY CHECK!----", processedOrderTwo.inventory, "----INVENTORY CHECK!----")

console.log("");
console.log("============================================");

console.log("");

// checks to see if a regular order without needed alternatives, still
// works as intended
const processedOrderThree = processOrder(orderThree)

console.log("ORDER THREE", processedOrderThree.order)

console.log("----INVENTORY CHECK!----", processedOrderThree.inventory, "----INVENTORY CHECK!----")

console.log("");
console.log("============================================");
