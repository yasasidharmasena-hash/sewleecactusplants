const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
         backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(229, 232, 107)',
      'rgb(67, 238, 64)',
      'rgb(190, 71, 217)',
      'rgb(240, 162, 78)',
    ],
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const printChart= () => {
    let newWindow = window.open();
    let printView = "<head><title>Report one</title><link rel='stylesheet' href='../resources/bootstrap-5.2.3/css/bootstrap.min.css'></head>"+"<body>"+"<h1>Report One</h1><br><img src='"+ ctx.toDataURL() +"'/>"+"</body>";
    newWindow.document.write(printView);

     setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
  }