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

publishBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let textareaInputValue = textareaInput.value;
  let fromValue = fromInput.value;
  let toValue = toInput.value;
  let myComments = `From ${fromValue}
   ${textareaInputValue}
To ${toValue}`;
  myComments = JSON.stringify(myComments);

  push(commentsInDB, myComments);

  clearInputForm();

}

);



onValue(commentsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearComment();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendComment(currentItem);
    }
  } else {
    commentList.innerHTML = "No comments here....yet";
  }
});



function clearComment() {
  textareaInput.innerHTML = "";
  fromInput.innerHTML = "";
  toInput.innerHTML = "";
}
function clearInputForm() {
  textareaInput.value = "";
  fromInput.value = "";
  toInput.value = "";
}

function appendComment(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newComment = document.createElement("li");
  newComment.innerHTML = itemValue;
  console.log(itemValue);

  newComment.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `comments/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  commentList.append(newComment);
}
