import {menuArray} from './data.js'

const itemsMenu = document.getElementById('items')
const resumeCart = document.getElementById('resume')
const completeBtn = document.getElementById('finish-order-btn')
const paymentContainer = document.getElementById('payment-container')
const confirmPayment = document.getElementById('payment-btn')
const thanksMessage = document.getElementById('thanks-message')
const order = []

//get the click and invoke function to identify it in menuArray
document.addEventListener('click', function(e){
    if (e.target.dataset.item){
        handleItemMenuClick(e.target.dataset.item)
        thanksMessage.style.display = 'none'
    }
})

//call a function to initialize the menu
render()

//user's quantity input control
const quantityBtn = document.getElementsByClassName('quantity')
for (let i=0; i < quantityBtn.length; i++) {
    quantityBtn[i].oninput = function(){
        const max = parseInt(this.max);
        if (parseInt(this.value) > max) {
        this.value = max;
        }
    }
}

const inputField = document.getElementsByClassName('payment-input')
console.log(inputField)
for (let i=0; i < inputField.length; i++) {
    inputField[i].oninput = function(){
        const max = parseInt(this.max);
        if (parseInt(this.value) > max) {
        this.value = max;
        }
    }
}

//change resume div to flex
const itemBtn = document.getElementsByClassName('add-item')
for (let i=0; i<itemBtn.length; i++){
    itemBtn[i].onclick = function(){
        resumeCart.style.display = 'flex'
    }
}

//array read and html menu creation
function getMenu(){
    let feedMenu = ``    
    menuArray.forEach(function(food){
        feedMenu += `
        <div class="menu">
            <p id='food-emoji'>${food.emoji}</p>
            <div class="food-data">
                <p class="bold">${food.name}</p>
                <p>${food.ingredients}</p>
                <p class="bold">$${food.price}</p>
            </div>
            <input type="number" name="quantity" class="quantity" id="menu-${food.id}" data-quantity=${food.id} min="1" max="999" value="1" maxlength="3">
            <button type="button" name="add-item" data-item="${food.id}" class="add-item" id="add-${food.id}">+</button>
        </div>
        `
    })
    return feedMenu
}

//render the array in html
function render(){
    document.getElementById('items').innerHTML = getMenu()
}

//push the items in a new array, get the quantity and adds in the array
function addItemCart(newItem){
    order.push(newItem)
    order.forEach(function(addedNewItem){
        if (addedNewItem.id === newItem.id){
            const quantityOfItem = document.querySelector(`#menu-${newItem.id}`)                  
            const index = order.findIndex(findIndexItem)
            function findIndexItem(item){
                return item.id === newItem.id
            }
            order[index].quantity = parseInt(quantityOfItem.value)
        }
    })
    renderOrder()
}

//update the quantity of the element and recalls renderOrder
function updateItemCart(updateItem){
    order.forEach(function(addedNewItem){
        if (addedNewItem.id === updateItem.id){
            const quantityOfItem = document.querySelector(`#menu-${updateItem.id}`)                  
            const index = order.findIndex(findIndexItem)
            function findIndexItem(item){
                return item.id === updateItem.id
            }
            order[index].quantity += parseInt(quantityOfItem.value)
        }
    })
    renderOrder()    
}

//return the id on data
function handleItemMenuClick(itemId){
    const targetItemObj = menuArray.filter(function(chosenMenu){
        return chosenMenu.id === parseInt(itemId)
    })[0]
    const index = order.findIndex(findIndexItem)
    function findIndexItem(item){
        return item.id === targetItemObj.id
    }
    if (index === -1){
        addItemCart(targetItemObj)
    } else {
        updateItemCart(targetItemObj)
    }
}

//renders the order array in the html
function renderOrder(){
    document.getElementById('items-order').innerHTML = getOrder()
    calcTotalPrice()
}

//read and returns a html of the order
function getOrder(){
    let feedOrder = ``
    order.forEach(function(itemsOfOrder){
        feedOrder += `
        <div class="items-grid">
            <div class="item-grid-name">
            <span id="item-grid-name">${itemsOfOrder.name}</span>
            </div>
            <div>
            <button type="button" name="remove-item" data-remove="${itemsOfOrder.id}" class="remove-item" id="remove-${itemsOfOrder.id}">Remove</button>
            </div>
            <div class="item-grid-qty">
            <span id="item-grid-qty">${itemsOfOrder.quantity}</span>
            </div>
            <div class="item-grid-total">
            <span id="item-grid-total">${itemsOfOrder.quantity * itemsOfOrder.price}</span>
            </div>
        </div>
        `
    })
    return feedOrder
}

//get the click of the remove button
document.addEventListener('click', function(e){
    if (e.target.dataset.remove){
        handleItemRemoveClick(e.target.dataset.remove)
    }
})

//get the id of button and remove the item
function handleItemRemoveClick(itemId){
    const targetItemObj = order.filter(function(removeItem){
        return removeItem.id === parseInt(itemId)
    })[0]
    const index = order.findIndex(findIndexItem)
    function findIndexItem(item){
        return item.id === targetItemObj.id
    }
    order.splice(index,1)
    renderOrder()
}

//calculates order's total price
function calcTotalPrice(){
    const totalPriceEl = document.getElementById('order-price')
    let i = 0
    order.forEach(function(itemsOfOrder){
        i += parseInt(itemsOfOrder.quantity * itemsOfOrder.price)
    })
    totalPriceEl.innerText = "$ " + i
    if (i === 0) {
        resumeCart.style.display = 'none'
    }
}

completeBtn.addEventListener('click', function(){
    paymentContainer.style.display = 'block'
})

confirmPayment.addEventListener('click', function(){
    paymentContainer.style.display = 'none'
    resumeCart.style.display = 'none'
    thanksMessage.style.display = 'block'
    document.getElementById('message').innerHTML = getName()
    order.length = 0
})

function getName() {
    let purchaserName = ""
    let textMessage = ``
    purchaserName = document.getElementById('purchaser-name').value
    textMessage = `
        <p>Thanks, ${purchaserName}! Your Order is on its way!</p>
    `
    return textMessage
}