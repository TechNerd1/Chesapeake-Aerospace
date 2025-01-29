let scale = 1;
const zoomStep = 0.1;
const tree = document.getElementById('tree');
let selectedNode = null;

document.getElementById('zoom-in').addEventListener('click', () => {
    scale += zoomStep;
    tree.style.transform = `scale(${scale})`;
});

document.getElementById('zoom-out').addEventListener('click', () => {
    if (scale > zoomStep) {
        scale -= zoomStep;
        tree.style.transform = `scale(${scale})`;
    }
});

document.getElementById('reset-zoom').addEventListener('click', () => {
    scale = 1;
    tree.style.transform = `scale(${scale})`;
});

const nodes = document.querySelectorAll('.node');
nodes.forEach(node => {
    node.addEventListener('click', (e) => {
        selectedNode = node;
        const popupMenu = node.querySelector('.popup-menu');
        popupMenu.style.display = 'block';
        popupMenu.style.left = `${e.offsetX - 30}px`;
        popupMenu.style.top = `${e.offsetY - 60}px`;

        if (node.id === 'root-node') {
            popupMenu.querySelector('.delete-node').disabled = true;
        } else {
            popupMenu.querySelector('.delete-node').disabled = false;
        }
    });
});

document.addEventListener('click', (event) => {
    const popupMenus = document.querySelectorAll('.popup-menu');
    popupMenus.forEach(menu => {
        if (!menu.contains(event.target) && !menu.parentElement.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});

const hidePopupMenu = () => {
    const popupMenu = selectedNode.querySelector('.popup-menu');
    popupMenu.style.display = 'none';
};

// Function to add a child node
const addChildNode = (parentNode) => {
    // Create a new child node
    const childNode = document.createElement('div');
    childNode.classList.add('node');
    childNode.dataset.name = 'New Node';
    childNode.dataset.value = '';
    childNode.dataset.color = '#3b3b3b';
    childNode.dataset.font = 'Arial';
    childNode.dataset.fontsize = '14';
    childNode.innerHTML = `
        <span class="node-name">New Node</span>
        <span class="node-value"></span>
        <div class="popup-menu">
            <button class="add-child">Add Child</button>
            <button class="delete-node">Delete Node</button>
            <button class="edit-node">Edit Node</button>
        </div>
    `;

    // Append the new child node to the tree
    tree.appendChild(childNode);

    // Get all current children of the parent node
    const currentChildren = Array.from(tree.querySelectorAll(`.node[data-parent-id="${parentNode.id}"]`));

    // Assign parent ID to the new child node
    childNode.dataset.parentId = parentNode.id;

    // Add the new child to the list of current children
    currentChildren.push(childNode);

    // Get parent and tree bounding rectangles
    const parentRect = parentNode.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();

    // Spacing configuration
    const verticalSpacing = 50; // Distance from parent node to child node
    const horizontalSpacing = 180; // Distance between child nodes

    // Calculate the starting X position for the first child
    const totalChildrenWidth = (currentChildren.length - 1) * horizontalSpacing;
    const startX = parentRect.left - treeRect.left + parentRect.width / 2 - totalChildrenWidth / 2;

    // Position each child node
    currentChildren.forEach((child, index) => {
        const childX = startX + index * horizontalSpacing;
        const childY = parentRect.top - treeRect.top + parentRect.height + verticalSpacing;

        child.style.position = 'absolute';
        child.style.left = `${childX}px`;
        child.style.top = `${childY}px`;
    });

    // Add listeners for the new child node's popup menu
    addPopupListeners(childNode);
};

// Add popup menu listeners to the node (Add Child, Edit Node, Delete Node)
const addPopupListeners = (node) => {
    node.querySelector('.add-child').addEventListener('click', () => {
        addChildNode(node);
        hidePopupMenu();
    });

    node.querySelector('.delete-node').addEventListener('click', () => {
        hidePopupMenu();
        // Delete node logic goes here
    });

    // Ensure that the edit node button correctly opens the edit panel
    node.querySelector('.edit-node').addEventListener('click', () => {
        document.getElementById('edit-panel').style.display = 'block';  // Display the edit panel
        selectedNode = node;  // Set the selected node to the current one

        // Populate the edit panel inputs with the current node's data
        document.getElementById('node-name').value = node.dataset.name;
        document.getElementById('node-value').value = node.dataset.value || '';  // Handle empty value
        document.getElementById('node-color').value = node.dataset.color;
        document.getElementById('node-font').value = node.dataset.font;
        document.getElementById('node-font-size').value = node.dataset.fontsize;
        
        hidePopupMenu();  // Close the popup menu after opening the edit panel
    });
};

// Save changes button event listener
document.getElementById('save-changes').addEventListener('click', () => {
    if (selectedNode) {
        selectedNode.dataset.name = document.getElementById('node-name').value;
        selectedNode.dataset.value = document.getElementById('node-value').value;
        selectedNode.dataset.color = document.getElementById('node-color').value;
        selectedNode.dataset.font = document.getElementById('node-font').value;
        selectedNode.dataset.fontsize = document.getElementById('node-font-size').value;

        // Update the node's display to reflect the changes
        selectedNode.querySelector('.node-name').textContent = selectedNode.dataset.name;
        selectedNode.querySelector('.node-value').textContent = selectedNode.dataset.value || '';
        selectedNode.style.backgroundColor = selectedNode.dataset.color;
        selectedNode.style.fontFamily = selectedNode.dataset.font;
        selectedNode.style.fontSize = `${selectedNode.dataset.fontsize}px`;

        // Hide the edit panel after saving
        document.getElementById('edit-panel').style.display = 'none';
    }
});

// Initialize the root node's popup listeners
addPopupListeners(document.getElementById('root-node'));

// Reset Tree functionality
document.getElementById('reset-tree').addEventListener('click', () => {
    // Remove all nodes except the root node
    const allNodes = document.querySelectorAll('.node');
    allNodes.forEach(node => {
        if (node.id !== 'root-node') {
            node.remove();
        }
    });

    // Reset the root node properties if needed
    const rootNode = document.getElementById('root-node');
    rootNode.dataset.name = 'Root Node';
    rootNode.dataset.value = '0';
    rootNode.dataset.color = '#3b3b3b';
    rootNode.dataset.font = 'Arial';
    rootNode.dataset.fontsize = '14';

    rootNode.querySelector('.node-name').textContent = 'Root Node';
    rootNode.querySelector('.node-value').textContent = '';
    rootNode.style.backgroundColor = '#3b3b3b';
    rootNode.style.fontFamily = 'Arial';
    rootNode.style.fontSize = '14px';

    // Optionally reset the zoom
    scale = 1;
    tree.style.transform = `scale(${scale})`;
});
