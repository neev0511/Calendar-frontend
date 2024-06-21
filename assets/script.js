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

// Call APIs
const getEvents = () => {
  axios.post(PATH).then((allofRes) => {
    const timeline = document.querySelector("#timeline");

    allofRes = allofRes.data;
    count = 0;

    for (let event of allofRes) {
      alignment = "right";
      if (count % 2 === 0) alignment = "left";

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
      else image = "other.jpg";

      // Formatting dates
      const startDate = new Date(event.start.dateTime);
      const startFormattedDate = formatter.format(startDate);

      const endDate = new Date(event.end.dateTime);
      const endFormattedDate = formatter.format(endDate);

      // Clearing undefined description and location
      if (event.description === undefined) event.description = "No description";
      if (event.location === undefined) event.location = "#";

      content = `
        <div class="container ${alignment}-container">
        <img src="assets/images/${image}" alt="" />
        <div class="text-box">
          <h2> ${event.summary}</h2>
          <small>${startFormattedDate} - ${endFormattedDate}</small>
          <br>
          <p>
            ${event.description}
          </p>
          <span class="${alignment}-container-arrow"></span>
          <div class="button-wrapper">
            <button><a href="${event.location}">Open</a></button>
          </div>
        </div>
      </div>
        `;

      // Inputting content
      timeline.innerHTML += content;
      count += 1;
    }
  });
};

getEvents();
