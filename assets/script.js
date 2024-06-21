const PATH = "https://calendar-backend-pc6v.onrender.com/getEvents/";
// const PATH = "http://localhost:8000/getEvents/";

const formatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "IST",
});

const runAOS = () => {
  setTimeout(() => {
    AOS.init({ duration: 800 });
  }, 3000);
};

// Call APIs
const timeline = document.querySelector("#timeline");
const loader = document.querySelector("#wrapper-loader");
const getEvents = () => {
  axios
    .post(PATH, { password: localStorage.getItem("password") })
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
        const startFormattedDate = formatter.format(startDate);

        const endDate = new Date(event.end.dateTime);
        const endFormattedDate = formatter.format(endDate);

        // Clearing undefined description
        if (event.description === undefined)
          event.description = "No description";

        // Making html code that needs to be added

        content = `
              <div class="container ${alignment}-container" >
        <img src="assets/images/${image}" alt="" data-aos="zoom-in"/>
        <div class="text-box" data-aos="fade-${animation}">
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
        </div>
          `;
        }

        content += `</div></div>`;

        // Inputting content
        timeline.innerHTML += content;
        count += 1;
      }
    });
  runAOS();
};

getEvents();
