let tempChart;

function getWeather() {
  const city = document.getElementById("CityInput").value;
  const apiKey = "5244221738776a843d404f8c9e6b51c2"; // Replace with your actual OpenWeatherMap API key

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found or Unauthorized (check API key)");
      }
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const weather = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      // Update weather result
      const resultHTML = `
        <h3>🌍 City: ${city}</h3>
        <p><strong>Temperature:</strong> <span style="color:red;">${temp} °C</span></p>
        <p><strong>Condition:</strong> ${weather}</p>
        <img src="${iconUrl}" alt="Weather icon">
      `;
      document.getElementById("weatherResult").innerHTML = resultHTML;

      // Update map
      const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
      document.getElementById("map").innerHTML = `<iframe height="200" src="${mapUrl}" frameborder="0"></iframe>`;

      // Update chart
      const chartData = [temp - 2, temp - 1, temp, temp + 1];
      const ctx = document.getElementById("tempChart").getContext("2d");

      if (tempChart) tempChart.destroy();

      tempChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
          datasets: [{
            label: 'Temperature (°C)',
            data: chartData,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
      document.getElementById("map").innerHTML = "";
    });
}