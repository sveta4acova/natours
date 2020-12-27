const EventEmmiter = require('events');

class Sales extends EventEmmiter {
  constructor() {
    super();
  }
}

const mySales = new Sales();

mySales.on('sale', (quantity) => {
  console.log(`Has created new sale. Quantity - ${quantity}`);
})

mySales.emit('sale', 8);
