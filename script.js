let card = []; // Array of All Tasks Items
let high = []; // Array of High Tasks Items Only
let medium = []; // Array of Medium Tasks Items Only
let low = []; // Array of Low Tasks Items Only

let cnt_all = 0;
let cnt_low = 0;
let cnt_medium = 0;
let cnt_high = 0;

let cnt_completed = 0;
let cnt_completed_low = 0;

let cnt_completed_medium = 0;

let cnt_completed_high = 0;

let cnt_started = 0;

let all_span = document.getElementById("cnt_all");
let low_span = document.getElementById("cnt_low");
let medium_span = document.getElementById("cnt_medium");
let high_span = document.getElementById("cnt_high");

// Creating empty logo div

let empty_div = document.createElement("div");
empty_div.id = "empty_logo";

let img = document.createElement("img");
img.src = "assets/Clipboard.png";
img.alt = "empty_logo";

let p = document.createElement("p");
p.innerText = "You have no To-do Items As of now";

empty_div.append(img, p);

let container = document.getElementById("tasks_items");
container.append(empty_div);
console.log(empty_div);

// Getting Information From My Form Element

let form = document.getElementById("info");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let input1 = document.getElementById("form_input1");
  let input2 = document.getElementById("form_input2");

  let selection = document.getElementById("selection");
  let form_btn = document.getElementById("submission_btn");

  //console.log(selection.value);

  let obj = {
    txt1: input1.value,
    txt2: input2.value,
    select: selection.value,
  };

  form.reset();

  card.push(obj);

  cnt_all++;

  if (obj.select == "High") {
    high.push(obj);
    cnt_high++;
  } else if (obj.select == "Medium") {
    medium.push(obj);
    cnt_medium++;
  } else {
    low.push(obj);
    cnt_low++;
  }

  empty_div.remove();
  document.getElementById("filter").selectedIndex = 0;

  Add_items(obj);
});

// Add Items To My Task Container With id="tasks_items"

function Add_items(obj) {
  let card_div = document.getElementById("tasks_items");

  // Creating My Tak Div With class="taski"

  let task = document.createElement("div");
  task.className = "taski";

  let spn_div = document.createElement("div"); // Creating Div element With class="span_2"
  spn_div.className = "span_2";

  let spn1 = document.createElement("span");
  let spn2 = document.createElement("span");
  spn2.className = "span_priority";

  spn1.innerText = obj.txt2;
  spn2.innerText = obj.select;

  spn_div.append(spn1, spn2); // Append Span Items To My spn_div element

  //input and buttons
  let input_btn_div = document.createElement("div");
  input_btn_div.className = "inpbtn";

  let checkbox_input = document.createElement("input");
  checkbox_input.type = "checkbox";
  checkbox_input.className = "checking";

  let inp1 = document.createElement("input");
  inp1.className = "ip";
  inp1.type = "text";
  inp1.value = obj.txt1;
  inp1.setAttribute("readonly", "true");

  let btn1 = document.createElement("button");
  btn1.className = "btn1 material-icons";
  btn1.type = "button";
  let btn2 = document.createElement("button");
  btn2.className = "btn2 material-icons";

  btn2.type = "button";

  btn1.innerText = "edit";
  btn2.innerText = "delete";
  input_btn_div.append(checkbox_input, inp1, btn1, btn2);

  task.append(spn_div, input_btn_div);
  card_div.append(task);

  all_span.innerText = cnt_all + " of " + cnt_all;
  low_span.innerText = cnt_low + " of " + cnt_low;
  medium_span.innerText = cnt_medium + " of " + cnt_medium;
  high_span.innerText = cnt_high + " of " + cnt_high;

  // checkbox

  checkbox_input.addEventListener("click", (checking) => {
    inp1.focus();

    if (checking.target.checked) {
      inp1.removeAttribute("readonly");
      inp1.style.textDecoration = "line-through";
      inp1.setAttribute("readonly", "readonly");
      cnt_completed++;

      if (spn2.innerText == "Low") {
        cnt_completed_low++;
      } else if (spn2.innerText == "Medium") {
        cnt_completed_medium++;
      } else {
        cnt_completed_high++;
      }
    } else {
      inp1.removeAttribute("readonly");
      inp1.style.textDecoration = "none";
      inp1.setAttribute("readonly", "readonly");

      cnt_completed--;
      if (cnt_completed < 0) {
        cnt_completed = 0;
      }

      if (spn2.innerText == "Low") {
        cnt_completed_low--;
        if (cnt_completed_low < 0) {
          cnt_completed_low = 0;
        }
      } else if (spn2.innerText == "Medium") {
        cnt_completed_medium--;
        if (cnt_completed_medium < 0) {
          cnt_completed_medium = 0;
        }
      } else {
        cnt_completed_high--;
        if (cnt_completed_high < 0) {
          cnt_completed_high = 0;
        }
      }
    }

    //console.log(inp1.value);

    let completed = document.getElementById("complete_track");
    completed.innerText = cnt_completed;
  });

  //deletion

  let myDivs = document.querySelectorAll(".taski");
  let myButtons = document.querySelectorAll(".btn2");

  myButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let myDiv = button.closest(".taski");
      myDiv.focus();

      //console.log(myDiv);  myDiv.lastChild.firstChild.value

      let delete_obj = {
        txt1: inp1.value,
        txt2: myDiv.firstChild.firstChild.innerText,
        select: myDiv.firstChild.lastChild.innerText,
      };

      myDiv.remove();

      let temp_container = document.getElementById("tasks_items");

      if (temp_container.innerText == "") {
        p.innerText = "You have no To-do Items As of now";

        temp_container.append(empty_div);
      }

      for (let i = 0; i < card.length; i++) {
        if (
          card[i].txt1 == delete_obj.txt1 &&
          card[i].txt2 == delete_obj.txt2 &&
          card[i].select == delete_obj.select
        ) {
          cnt_started++;
          let started = document.getElementById("started_track");
          started.innerText = cnt_started;
          card.splice(i, 1);
          cnt_all--;
          if (cnt_all < 0) {
            cnt_all = 0;
          }
          all_span.innerText = cnt_all + " of " + cnt_all;
        }
      }

      console.log(delete_obj);

      for (let i = 0; i < low.length; i++) {
        if (
          low[i].txt1 == delete_obj.txt1 &&
          low[i].txt2 == delete_obj.txt2 &&
          low[i].select == delete_obj.select
        ) {
          console.log("yes");
          low.splice(i, 1);
          cnt_low--;
          if (cnt_low < 0) {
            cnt_low = 0;
          }
          low_span.innerText = cnt_low + " of " + cnt_low;
        }
      }

      for (let i = 0; i < medium.length; i++) {
        if (
          medium[i].txt1 == delete_obj.txt1 &&
          medium[i].txt2 == delete_obj.txt2 &&
          medium[i].select == delete_obj.select
        ) {
          medium.splice(i, 1);
          cnt_medium--;
          if (cnt_medium < 0) {
            cnt_medium = 0;
          }
          medium_span.innerText = cnt_medium + " of " + cnt_medium;
        }
      }

      for (let i = 0; i < high.length; i++) {
        if (
          high[i].txt1 == delete_obj.txt1 &&
          high[i].txt2 == delete_obj.txt2 &&
          high[i].select == delete_obj.select
        ) {
          high.splice(i, 1);
          cnt_high--;
          if (cnt_high < 0) {
            cnt_high = 0;
          }
          high_span.innerText = cnt_high + " of " + cnt_high;
        }
      }
    });
  });

  // edition

  let prev_text = inp1.value;
  let new_text;

  btn1.addEventListener("click", () => {
    if (btn1.innerText == "edit") {
      inp1.removeAttribute("readonly");
      inp1.focus();
      btn1.innerText = "save";
    } else {
      inp1.focus();

      new_text = inp1.value;
      inp1.setAttribute("readonly", "readonly");
      btn1.innerText = "edit";
    }

    let check_obj = {
      txt: new_text,
      txt1: prev_text,
      txt2: spn1.innerText,
      select: spn2.innerText,
    };

    for (let i = 0; i < card.length; i++) {
      //console.log(check_obj);

      if (check_obj.txt == undefined) {
        continue;
      }
      if (
        card[i].txt1 == check_obj.txt1 &&
        card[i].txt2 == check_obj.txt2 &&
        card[i].select == check_obj.select
      ) {
        // console.log("yes", check_obj.txt);

        card[i].txt1 = check_obj.txt;
      }
    }
  });
}

// filter
let filter_high = document.getElementById("filter");

filter_high.addEventListener("change", myfilter);

function myfilter() {
  let selectedOption = filter_high.options[filter_high.selectedIndex];

  if (selectedOption.value == "HIGH") {
    let taski_div = document.getElementById("tasks_items");
    taski_div.innerHTML = "";

    high.forEach((e) => {
      Add_items(e);
    });
    cnt_completed_high = 0;
    let completed = document.getElementById("complete_track");
    completed.innerText = cnt_completed_high;

    if (container.innerHTML == "") {
      p.innerText = "You have no High Priority To-do Items As of now";
      container.append(empty_div);
    }
  } else if (selectedOption.value == "MEDIUM") {
    let taski_div = document.getElementById("tasks_items");
    taski_div.innerHTML = "";

    cnt_completed = 0;
    let completed = document.getElementById("complete_track");
    completed.innerText = cnt_completed;

    medium.forEach((e) => {
      Add_items(e);
    });
    if (container.innerHTML == "") {
      p.innerText = "You have no Medium Priority To-do Items As of now";

      container.append(empty_div);
    }
  } else if (selectedOption.value == "LOW") {
    let taski_div = document.getElementById("tasks_items");
    taski_div.innerHTML = "";

    cnt_completed = 0;
    let completed = document.getElementById("complete_track");
    completed.innerText = cnt_completed;

    low.forEach((e) => {
      Add_items(e);
    });
    if (container.innerHTML == "") {
      p.innerText = "You have no Low Priority To-do Items As of now";

      container.append(empty_div);
    }
  } else {
    let taski_div = document.getElementById("tasks_items");
    taski_div.innerHTML = "";

    cnt_completed = 0;
    let completed = document.getElementById("complete_track");
    completed.innerText = cnt_completed;

    card.forEach((e) => {
      Add_items(e);
    });
    if (container.innerHTML == "") {
      p.innerText = "You have no To-do Items As of now";

      container.append(empty_div);
    }
  }
}
