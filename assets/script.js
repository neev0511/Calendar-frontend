// const PATH = "https://calendar-backend-pc6v.onrender.com/";
const PATH = "http://localhost:8000/";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const runAOS = () => {
  setTimeout(() => {
    AOS.init({ duration: 800 });
  }, 3000);
};

const createWrapper = document.getElementById("createWrapper");
createWrapper.style.display = "none";
// Call APIs
const timeline = document.querySelector("#timeline");
const loader = document.querySelector("#wrapper-loader");
const getEvents = () => {
  axios
    .post(PATH + "getEvents/", { password: localStorage.getItem("password") })
    .then((allofRes) => {
      loader.style.display = "none";
      allofRes = allofRes.data;
      count = 0;
      for (let event of allofRes) {
        alignment = "right";
        animation = "left";
        if (count % 2 === 0) {
          alignment = "left";
          animation = "right";
        }

        // Cleaning data
        if (event.organizer.displayName === "Formula 1") {
          image = "f1.png";
          event.location = "https://www.fancode.com/";
          event.description = event.summary;
        } else if (event.organizer.displayName === "Boston University") {
          image = "bu.png";
          event.location = "https://www.google.com/maps?q=" + event.location;
        } else if (event.organizer.displayName === "Airtribe Calendar")
          image = "airtribe.svg";
        else if (event.organizer.displayName === "Task") image = "tasks.svg";
        else image = "other.jpg";

        // Formatting dates
        const startDate = new Date(event.start.dateTime);
        const startFormattedDate =
          "<b>" +
          startDate.toLocaleString("en-US", { weekday: "long" }) +
          ", " +
          formatter.format(startDate);

        const endDate = new Date(event.end.dateTime);
        const endFormattedDate = formatter.format(endDate) + "</b>";

        // Clearing undefined description
        if (event.description === undefined)
          event.description = "No description";

        // Making html code that needs to be added

        content = `
              <div class="container ${alignment}-container" >
        <img src="assets/images/${image}" alt="" />
        <div class="text-box">
          <h2> ${event.summary}</h2>
          <small>${startFormattedDate} - ${endFormattedDate}</small>
          <br>
          <p>
            ${event.description}
          </p>
          <span class="${alignment}-container-arrow"></span>
      `;

        // Checking for location button
        if (event.location !== undefined) {
          content += ` 
        <div class="button-wrapper">
            <a href="${event.location}"><button>Open</button></a>
            <div class="editAndDeleteButton">
                  <button type="button" id="${event.id}" onclick="editButton(this.id)">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button type="button" id="${event.id}" onclick="deleteButton(this.id)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
        </div>
          `;
        } else {
          content += `<div class="editAndDeleteButton">
              <button type="button" id="${event.id}" onclick="editButton(this.id)">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button type="button" id="${event.id}" onclick="deleteButton(this.id)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>`;
        }

        content += `</div></div>`;

        // Inputting content
        timeline.innerHTML += content;
        count += 1;
      }
      createWrapper.style.display = "block";
    });

  // runAOS();
};

getEvents();

// Edit
function editButton(id) {
  
}

// Delete
function deleteButton(id) {
  loader.style.display = "block";
  createWrapper.style.display = "none";
  timeline.style.display = "none";
  axios
    .post(PATH + "getEvents/", { password: localStorage.getItem("password") })
    .then((allofRes) => {
      allofRes = allofRes.data;
      let type = "Event";
      for (let event of allofRes) {
        if (event.id === id && event.organizer.displayName === "Task") {
          type = "Task";
        }
      }
      axios
        .post(PATH + `delete${type}`, { id: id })
        .then(window.location.reload());
    })
    .catch((err) => {
      window.alert("Server Error");
      loader.style.display = "none";
      createWrapper.style.display = "block";
      timeline.style.display = "block";
    });
}

// Create
function create() {}
