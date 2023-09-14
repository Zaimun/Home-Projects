// movies.js

const { ipcRenderer } = require('electron');
const Store = require('electron-store');

const store = new Store({name: 'games-data'});

document.addEventListener('DOMContentLoaded', () => {
  const addItemButton = document.getElementById('addItemButton');
  const itemInput = document.getElementById('item');
  const itemList = document.getElementById('itemList');

  // Function to update the list with items
  function updateItemList(items) {
    // Clear the current list
    //itemList.innerHTML = '';

    // Rebuild the list with the updated items
    items.forEach((item, index) => { // Add an index to identify items
      const listItem = document.createElement('li');
      listItem.textContent = item;

      // Create a delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-button'); // Add a class for styling
      deleteButton.setAttribute('data-index', index); // Set a data attribute to identify the item
      listItem.appendChild(deleteButton);

      // Append the list item to the <ul>
      itemList.appendChild(listItem);
    });
  }

  // Load items from store when the page is loaded
  const items = store.get('items', []);

  // Update the list with items from the store
  updateItemList(items);

  // Handle delete button clicks
  itemList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
      // Find the index of the item to remove
      const index = parseInt(event.target.getAttribute('data-index'), 10);
      if (!isNaN(index) && index >= 0 && index < items.length) {
        // Remove the item from the array
        items.splice(index, 1);

        // Update the store with the modified list
        store.set('items', items);

        itemList.innerHTML = '';

        // Update the display
        updateItemList(items);
      }
    }
  });

  addItemButton.addEventListener('click', () => {
    const itemText = itemInput.value.trim();
    if (itemText) {
      // Create a new list item
      const listItem = document.createElement('li');
      listItem.textContent = itemText;

      // Create a delete button for the new item
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-button');
      deleteButton.setAttribute('data-index', items.length); // Assign a unique index
      listItem.appendChild(deleteButton);

      // Append the list item to the <ul>
      itemList.appendChild(listItem);

      // Save the updated list to the store
      items.push(itemText);
      store.set('items', items);

      // Clear the input field
      itemInput.value = '';
    }
  });

  // Handle updates from the main process
  ipcRenderer.on('update-items', (event, updatedItems) => {
    // Update the list with items received from the main process
    updateItemList(updatedItems);
  });
});
