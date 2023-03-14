let ToDosHighestID = 15;

const addItemButton = document.getElementById('addItemButtom');
const clearMyList = document.getElementById('clearMyList');
const inputWindow = document.getElementById('inputWindow');
const notes = document.querySelector('.notes');


window.onload = () => {
    if ('myToDos' in localStorage) {
        readFromLocalStorage();
        
    }
    else {
        createDivs();
    }

    dragOpacity();
};

addItemButton.addEventListener('click', (element) => {
    addActivity(element);
});

const clearListClick = () => {
    if ('myToDos' in localStorage) {
        localStorage.clear();
        while (notes.firstChild) {
            notes.removeChild(notes.firstChild)
        }
        createDivs();
        inputWindow.value = '';
    }
};

clearMyList.addEventListener('click', () => {
    clearListClick();
});


const addActivity = (element) => {
    const toDoDivs = document.querySelectorAll('.toDoDiv');
    let alreadyInserted = false;
    toDoDivs.forEach((element, index) => {
        if(element.innerHTML == '' && alreadyInserted === false) {
            element.innerHTML = `<input type="checkbox" name="" id="checkbox${index}"><div class="inputValue">${inputWindow.value}</div><img id="img${index}" src="/img/recycle-bin-icon.svg" alt="">`;
            alreadyInserted = true;
            const checkbox = document.getElementById(`checkbox${index}`);

            checkbox.addEventListener('click', () => {
                checkboxStrikethrough(element, checkbox);
            })

            const binButton = document.getElementById(`img${index}`)
            binButton.addEventListener('click', () => {
                removeActivity(element);
            })
        }
    });  

    saveDataToLocalStorage();
};



const createDivs = () => {
    for (let n = 0; n < 15; n++) {
        let div = document.createElement('div');
        div.id = `toDo${n}`;
        div.draggable = true;
        div.classList.add('toDoDiv', 'draggable');
        notes.insertAdjacentElement('beforeend', div);
    }
};


const checkboxStrikethrough = (element, checkbox) => {
    console.log(element, checkbox);
    if (checkbox && checkbox.checked === true) {
        element.classList.add('strikeThrough');
    }
    else {
        element.classList.remove('strikeThrough');
    }
    saveDataToLocalStorage();
};


const removeActivity = (element) => {
    element.remove();
    const toDoDivNew = document.createElement("div");
    toDoDivNew.classList.add('toDoDiv');
    toDoDivNew.id = `toDo${ToDosHighestID++}`
    notes.insertAdjacentElement('beforeend', toDoDivNew)
    saveDataToLocalStorage();
};

const saveDataToLocalStorage = () => {
    let toDosArray = [];
    const toDoDivs = document.querySelectorAll('.toDoDiv');
    toDoDivs.forEach((element) => {
        let toDo = {
            id: element.id, 
            innerHTML: element.innerHTML
        }
        toDosArray.push(toDo);
    })
    window.localStorage.setItem('myToDos', JSON.stringify(toDosArray));
    window.localStorage.setItem('ToDosHighestID', JSON.stringify(ToDosHighestID));

};

const readFromLocalStorage = () => {
    let ToDosHighestIDCount = Number(localStorage.getItem('ToDosHighestID'));
    if(ToDosHighestIDCount) {
        ToDosHighestID = ToDosHighestIDCount;
    }
    let myData = localStorage.getItem('myToDos');

    if(myData) {
        myData = JSON.parse(myData);

        myData.forEach(data => {
            let div = document.createElement('div');
            div.classList.add('toDoDiv ', 'draggable');
            div.id = data.id;
            div.draggable = true;
            div.innerHTML = data.innerHTML;
            notes.insertAdjacentElement('beforeend', div);

            const checkbox = div.querySelector('input');
            if (checkbox) {
                checkbox.addEventListener('click', () => {
                checkboxStrikethrough(div, checkbox);
                })
            }
            const binButton = div.querySelector('img');
            if (binButton) {
                binButton.addEventListener('click', () => {
                removeActivity(div);
                })
            }
        })
    }
};




const dragOpacity = () => {
    const toDoDivs = document.querySelectorAll('.toDoDiv');
    toDoDivs.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        })
    })
}



notes.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(notes, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement === null) {
        notes.appendChild(draggable);
    } else {
        notes.insertBefore(draggable, afterElement)
    }     
})

function getDragAfterElement(notes, y) {
    const draggableElements = [...notes.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offse: offset, element: child }
        } else {
            return closest;
        }

    }, {offset: Number.NEGATIVE_INFINITY }).element;
}