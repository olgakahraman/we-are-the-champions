import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://champions-6b280-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const commentsInDB = ref(database, "comments");

const textareaInput = document.querySelector("#commentInput");
const fromInput = document.querySelector("#fromInput");
const toInput = document.querySelector("#toInput");

const commentList = document.querySelector("#comment");

const publishBtn = document.querySelector("#publishBtn");

publishBtn.addEventListener("click", function () {
  if(!isValidInput()){
    return;
  }
  let data = {
    text: textareaInput.value,
    from: fromInput.value,
    to: toInput.value
    
  };


  
    push(commentsInDB, data);
  clearInputForm();
});

function isValidInput() {
  if (!textareaInput.value) {
    textareaInput.focus();
    return;
  }
  if (!fromInput.value) {
    fromInput.focus();
    return false;
  }
  if (!toInput.value) {
    toInput.focus();
    return false;
  }
  return true;
}

onValue(commentsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val()).reverse();
    clearComment();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendComment(currentItem);
    }
  } else {
    commentList.innerHTML = "No comments here....yet";
  }
});

function clearComment() {
  commentList.innerHTML = "";
}
function clearInputForm() {
  textareaInput.value = "";
  fromInput.value = "";
  toInput.value = "";
}

function appendComment(entry) {

  let itemID = entry[0];
  let entryText = entry[1].text;
  let entryFrom = entry[1].from;
  let entryTo = entry[1].to;



  let newComment = document.createElement("li");
  newComment.innerHTML = `<div class="to"> <strong>To: ${entryTo}</strong></div> <div>${entryText}</div> <div class="from"><strong>From: ${entryFrom}</strong></div>`;
 

  newComment.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `comments/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  commentList.append(newComment);
 
}
