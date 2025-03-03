// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var mesActual = new Date().getMonth();

var cantidadDatos = 6;
var minDataRandom = 10000;
var maxDataRandom = 50000;

var ctx = document.getElementById("myBarChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: Array(cantidadDatos).keys().reduce((arr, n) => [ meses[(mesActual - (n + 1) + 12) % 12], ...arr], []),
    datasets: [{
      label: "Sesiones",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: Array(cantidadDatos).keys().reduce((arr) => [ ...arr, Math.floor(Math.random() * (maxDataRandom - minDataRandom + 1)) + minDataRandom], []),
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: cantidadDatos
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: maxDataRandom,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
