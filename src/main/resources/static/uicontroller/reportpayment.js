
const generateReport = () => {

  // generate table

  let dataList = getServiceRequest("/reportpayment/bysdedtype?startdate=" + dteStartDate.value + "&enddate=" + dteEndDate.value + "&type=" + selectType.value);

  let reportDataList = new Array();
  let data = new Array();
  let label = new Array();


  for (const index in dataList) {
    let object = new Object();
    object.month = dataList[index][0];
    object.amount = dataList[index][1];
    reportDataList.push(object);

    label.push(dataList[index][0]);
    data.push(dataList[index][1]);

  }


  //data types
  //string ---> string / date / number
  //function ---> object / array / boolean

  let propertyList = [
    { propertyName: "month", dataType: "string" },
    { propertyName: "amount", dataType: "decimal" },
  ];

  //call fillDataIntoReportTable function (tableBodyId, dataList, columnsList)
  fillDataIntoReportTable(tablePaymentReportBody, reportDataList, propertyList);

  $('#tablePaymentReport').DataTable();

  //generate chart
  const ctx = document.getElementById('myChart');
  if (Chart.getChart("myChart") != undefined)
    Chart.getChart("myChart").destroy();

  new Chart(ctx, {

    type: 'bar',
    data: {
      labels: label,
      datasets: [{
        label: 'Amount',
        data: data,
        borderWidth: 1,
        backgroundColor: generateColorCodes(data.length)
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

}

const printChart = () => {
  const ctx = document.getElementById('myChart');

  //let newWindow = window.open('', '_blank');
  /*const currentDateTime = new Date().toLocaleString(); // Get current date & time
  let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>"
  +"<body>"+"<h1> Payment Report</h1><br>"
  +"<div class ='row'>"
  +"<div class = 'col-6'>" + tablePaymentReport.outerHTML + "</div>"
  +"<div class = 'col-6'> <img src='"+ ctx.toDataURL() +"'/> </div>"
  +"</div></body>";
  newWindow.document.write(printView);*/

  const currentDateTime = new Date().toLocaleString(); // Get current date & time
  const chartImage = ctx.toDataURL("image/png", 1.0);

  const printView = `
    <html>
      <head>
        <title>SEWLEE CACTUS PLANTS</title>
        <link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'>
        <style>
          body {
            padding: 40px;
            font-family: Arial, sans-serif;
          }

          .header-container {
            position: relative;
            margin-bottom: 20px;
            min-height: 70px;
          }

          .header-title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
          }

          .date-time {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 14px;
          }

          .report-title {
            position: absolute;
            top: 25px;
            left: 0;
            font-size: 20px;
            font-weight: bold;
          }

          .content {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
          }

          table {
            width: 100%;
            text-align: center;
            border-collapse: collapse;
          }

          th, td {
            text-align: center;
            vertical-align: middle;
            border: 1px solid #000;
            padding: 8px;
          }

          thead {
            background-color: #dee2e6;
          }

          .chart {
            max-width: 100%;
            height: auto;
            display: block;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            img {
              max-width: 100%;
              height: auto;
            }

            .content {
              flex-direction: row;
            }

            .content > div {
              width: 48%;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="date-time"><strong>Date:</strong> ${currentDateTime}</div>
          <div class="report-title">Payment Report</div>
          <div class="header-title">SEWLEE CACTUS PLANTS</div>
        </div>
        <hr>
        <div class="content">
          <div>
            ${tablePaymentReport.outerHTML}
          </div>
          <div>
            <img class="chart" src="${chartImage}" alt="Chart" />
          </div>
        </div>
      </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.open();
  newWindow.document.write(printView);
  newWindow.document.close();

  setTimeout(() => {
    newWindow.print();
    newWindow.close();
  }, 500);
}

