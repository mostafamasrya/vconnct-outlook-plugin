
const fetchData = async (userID) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}?url=api/method/vconnct.v2.meeting.get_meeting_settings_for_plugin?user_id=` +
        userID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if required
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log(data);
    setSettingData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
