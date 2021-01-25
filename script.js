// CLASSES
class Note {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }
    showNote() {    // DONE
        // VARIABLES
        const container = document.querySelector("main");

        // CREATING NOTE COMPONENTS
        const note = document.createElement("div");
        const noteContent = document.createElement("div");
        const doneButton = document.createElement("button");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        // CREATING EDIT COMPONENTS
        const editBox = document.createElement("input");
        const acceptButton = document.createElement("button");
        const exitButton = document.createElement("button");

        // SETTING ATTRIBUTES FOR NOTE COMPONENTS
        note.className = "Note";
        note.id = "note"+this.id;
        noteContent.className = "NoteContent";
        noteContent.id = "noteContent"+this.id;
        noteContent.textContent = this.content;
        doneButton.id = "dn"+this.id;
        doneButton.className = "NoteButton doneButton";
        doneButton.innerHTML = `<img id="dn${this.id}" src="done_icon.png" alt="Done" title="Done"/>`;
        editButton.id = "ed"+this.id;
        editButton.className = "NoteButton editButton";
        editButton.innerHTML = `<img id="ed${this.id}" src="edit_icon.png" alt="Edit" title="Edit"/>`;
        deleteButton.id = "dl"+this.id;
        deleteButton.className = "NoteButton deleteButton";
        deleteButton.innerHTML = `<img id="dl${this.id}" src="delete_icon.png" alt="Delete" title="Delete"/>`;

        // SETTING ATTRIBUTES FOR EDIT COMPONENTS
        editBox.className = "Edit";
        editBox.type = "text";
        editBox.id = "editInput"+this.id;
        editBox.name = "editBox";
        editBox.maxLength = 32;
        acceptButton.id = "acceptEdit"+this.id;
        acceptButton.className = "NoteButton doneButton Edit";
        acceptButton.innerHTML = `<img id="acceptEdit${this.id}" src="done_icon.png" alt="Accept" title="Accept"/>`;
        exitButton.id = "exitEdit"+this.id;
        exitButton.className = "NoteButton deleteButton Edit";
        exitButton.innerHTML = `<img id="exitEdit${this.id}"" src="delete_icon.png" alt="Exit" title="Exit"/>`;
        
        // APPENDING NOTE COMPONENTS TO BOX
        note.appendChild(noteContent);
        note.appendChild(doneButton);
        note.appendChild(editButton);
        note.appendChild(deleteButton);
        note.appendChild(editBox);
        note.appendChild(acceptButton);
        note.appendChild(exitButton);

        // APPENDING BOX TO CONTAINER
        container.appendChild(note);

        // ADDING FUNCTIONALITY TO BUTTONS
        document.querySelector("#dl"+this.id).addEventListener("click", this.deleteNote);
        document.querySelector("#dn"+this.id).addEventListener("click", this.disableNote);
        document.querySelector("#ed"+this.id).addEventListener("click", this.editNote);
    }
    deleteNote() {  // DONE
        // VARIABLES
        const div = document.querySelector("#"+this.id);
        const note = findId(noteArray, this.id[2]);

        // DELETING PARENT ELEMENT OF BUTTON (NOTE)
        div.parentElement.remove();

        // DELETING NOTE FROM LOCAL STORAGE
        localStorage.removeItem(noteArray[note].id);

        // DELETING NOTE FROM ARRAY
        noteArray.splice(note, 1);

        // ADDING AN ID OF DELETED ELEMENT TO ARRAY FOR REUSE
        oldIds.push(this.id[2]);
        //localStorage.setItem("oldIds", oldIds);

        // DISABLING ADD BUTTON WHEN ARRAY HAS TOO MUCH ELEMENTS
        if(noteArray.length < 10)
            document.querySelector("#addButton").disabled = false;
    }
    disableNote() { // DONE
        // VARIABLES
        const button = document.querySelector("#"+this.id);
        const buttons = button.parentElement.querySelectorAll("button");
        const redLine = document.createElement("div");
        let i;

        // ADDING "DISABLED" EFFECT TO NOTE'S TEXT
        button.parentElement.querySelector(".NoteContent").setAttribute("style", "opacity: 0.5");

        // DISABLING BUTTONS IN NOTE EXCEPT DELETE BUTTON
        for (i = 0; i < 2; i++) {
            buttons[i].disabled = true;
            buttons[i].style.backgroundColor = "white";
        }
        // MAKING A RED LINE
        button.parentElement.appendChild(redLine);
        redLine.className = "RedLine";

    }
    editNote() {    // DONE
        // FUNCTIONS
        const changeDisplay = (from, to) => {
            let i;
            // NOTE COMPONENTS
            for (i = 0; i < 4; i++)
                note.children[i].style.display = from;
            // EDIT COMPONENTS
            for (i = 4; i < note.children.length; i++)
                note.children[i].style.display = to;
        }
        // VARIABLES
        const button = document.querySelector("#"+this.id);
        const note = button.parentElement;
        const id = note.id[4];
        const index = findId(noteArray, id);

        // MAKING NOTE INVISIBLE AND EDIT BOX VISIBLE
        changeDisplay("none", "flex");

        // FOCUSING ON EDIT BOX
        note.querySelector("#editInput"+id).focus();

        // SETTING DEFAULT VALUE OF INPUT AS OLD CONTENT OF NOTE
        note.querySelector("#editInput"+id).value = note.querySelector("#noteContent"+id).textContent;

        // ACCEPT EDITING
        note.querySelector("#acceptEdit"+id).addEventListener("click", () => {
            // TAKING DATA FROM INPUT TO VARIABLE
            const newContent = note.querySelector("#editInput"+id).value;

            // CHANGING CONTENT OF NOTE
            note.querySelector("#noteContent"+id).textContent = newContent;
            noteArray[index].content = newContent;
            
            // CHANGING CONTENT OF NOTE IN LOCAL STORAGE
            console.log(id);
            localStorage.setItem(id, JSON.stringify(noteArray[index]));

            // MAKING EDIT BOX INVISIBLE AND NOTE VISIBLE
            changeDisplay("flex", "none");
        });

        // EXIT EDITING
        note.querySelector("#exitEdit"+id).addEventListener("click", () => {
            // MAKING EDIT BOX INVISIBLE AND NOTE VISIBLE
            changeDisplay("flex", "none");
        });
    }
}

// FUNCTIONS
const createNote = () => {  // DONE
    // CHECKING NUMBER OF NOTES
    if (noteArray.length < 10) {
        document.querySelector("#addButton").disabled = false;
        // VARIABLES
        const content = document.querySelector("#newNote");
        let newNote;

        // CHECKING IF VALUE OF INPUT IS EMPTY
        if(content.value === "")
            document.querySelector("#newNote").placeholder = "Input is empty!";
        else {
            document.querySelector("#newNote").placeholder = "Write your note: ";
            
            // USING NEW ID WHEN ARRAY IS EMPTY
            if(oldIds.length === 0) 
                newNote = new Note(noteArray.length, content.value); 

            // REUSING OLD IDS OF DELETED NOTES
            else {
                newNote = new Note(oldIds[oldIds.length-1], content.value);
                oldIds.pop();
            }

            // ADDING NOTE TO ARRAY
            noteArray.push(newNote);
            
            // ADDING NOTE TO LOCAL STORAGE
            localStorage.setItem(newNote.id, JSON.stringify(newNote));

            // DELETING VALUE OF INPUT
            content.value = "";

            // SHOWING CREATED NOTE
            newNote.showNote();
            
            // CHECKING NUMBER OF NOTES
            noteArray.length < 10 ? document.querySelector("#addButton").disabled = false : document.querySelector("#addButton").disabled = true;
        } 
    } 
    // DISABLING ADD BUTTON WHEN ARRAY HAS TOO MUCH ELEMENTS
    else
        document.querySelector("#addButton").disabled = true;
}
const searchNote = () => {  // DONE
    // FUNCTIONS
    const changeDisplay = (from, to) => {
        let i;
        // CREATE MENU COMPONENTS
        for (i = 2; i < topContainer.children.length; i++)
            topContainer.children[i].style.display = from;
        // SEARCH MENU COMPONENTS
        for (i = 0; i < 2; i++)
            topContainer.children[i].style.display = to;
    }
    // VARIABLES
    const topContainer = document.querySelector("#top");
    const container = document.querySelector("main");
    const inputBox = document.querySelector("#searchInput");
    let text, i;

    // MAKING CREATE MENU INVISIBLE AND SEARCH MENU VISIBLE
    changeDisplay("none", "flex");

    // SEARCH FUNCTION
    inputBox.addEventListener("input", () => {
        // GETTING VALUE OF INPUT
        text = inputBox.value;

        // FILTER FOR NOTES IN ARRAY
        for(i = 0; i < noteArray.length; i++) {
            if (noteArray[i].content.includes(text)) {
                if (container.querySelector(`#note${noteArray[i].id}`) != null)
                    container.querySelector(`#note${noteArray[i].id}`).style.display = "flex";
            }     
            else {
                if (container.querySelector(`#note${noteArray[i].id}`) != null)
                    container.querySelector(`#note${noteArray[i].id}`).style.display = "none";
            }         
        }
    });
    // DISABLING SEARCH FUNCTION
    document.querySelector("#exitSearchButton").addEventListener("click", () => {

        // MAKING SEARCH MENU INVISIBLE AND CREATE MENU VISIBLE
        changeDisplay("flex", "none");

        // CLEARING SEARCH INPUT VALUE
        inputBox.value = "";

        // CLEARING ADD INPUT VALUE
        topContainer.querySelector("#newNote").value = "";

        // MAKING ALL NOTES VISIBLE
        for(i = 0; i < noteArray.length; i++)
            container.querySelector(`#note${noteArray[i].id}`).style.display = "flex";
    });
}
const findId = (array, id) => {
    let i;
    for (i = 0; i < array.length; i++) {
        if (array[i].id == id)
            return i;
    }
}
const checkLocalStorage = () => {
  let item;
  if (localStorage.length > 0) {
    const keys = Object.keys(localStorage);
    keys.sort();
    keys.forEach((el) => {
      item = JSON.parse(localStorage.getItem(el));
      noteArray.push(new Note(item.id, item.content));
    });
    noteArray.forEach((el) => {
      el.showNote();
    })
  }
}

// VARIABLES
const noteArray = [];
let oldIds = [];

// CREATING NOTE EVENT
document.querySelector("#addButton").addEventListener("click", createNote);
document.querySelector("#newNote").addEventListener("keyup", (e) => {e.keyCode === 13 ? createNote() : false});

// SEARCHING FOR NOTE EVENT
document.querySelector("#searchButton").addEventListener("click", searchNote);
checkLocalStorage();