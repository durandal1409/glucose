
const meals = ['breakfast', 'second_breakfast', 'lunch', 'afternoon_tea', 'dinner', 'second_dinner'];

function makeDate(date) {
    return date.getUTCDate() + '.' + (date.getUTCMonth() + 1 < 10 ? ("0" + (date.getUTCMonth() + 1)) : date.getUTCMonth() + 1) + '.' + date.getUTCFullYear();
}

function makeGraph(fetchedData) {
    const arraysForGraphs = fetchedData.map(dayRecord => {
        let graphLabelsArr = [];
        let glucoseBeforeArr = [];
        let glucoseAfterArr = [];
        let foodsArr = [];
        let date = new Date(dayRecord.date);
        date = makeDate(date);
        for (let key in dayRecord) {
            // choosing only meals (not dates) and those where there is some glucose data
            if (meals.includes(key) && (dayRecord[key].glucose_before|| dayRecord[key].glucose_1hr_after)) {
                graphLabelsArr.push(key + ' ' + date);
                glucoseBeforeArr.push(dayRecord[key].glucose_before);
                glucoseAfterArr.push(dayRecord[key].glucose_1hr_after);
                // foodsArr.push(dayRecord[key].food);
            }
        };
        return {graphLabelsArr, glucoseBeforeArr, glucoseAfterArr, foodsArr};
    });
    const labels = arraysForGraphs.map(el => el.graphLabelsArr).flat();
    const dataGlucoseBefore = arraysForGraphs.map(el => el.glucoseBeforeArr).flat();
    const dataGlucoseAfter = arraysForGraphs.map(el => el.glucoseAfterArr).flat();
    // const dataFoods = arraysForGraphs.map(el => el.foodsArr).flat();
    // console.log(labels, dataGlucoseBefore, dataGlucoseAfter);
    const glucoseBeforeColor = '#7ea60a';
    const glucoseAfterColor = '#431076';
    const graphData = {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Before Meal',
            data: dataGlucoseBefore,
            backgroundColor: glucoseBeforeColor
          },
          {
            type: 'bar',    
            label: '1hr after meal',
            data: dataGlucoseAfter,
            backgroundColor: glucoseAfterColor
          },
          {
            type: 'line',    
            label: '5.1',
            data: new Array(labels.length).fill(5.1),
            borderColor: glucoseBeforeColor,
            backgroundColor: glucoseBeforeColor
          },
          {
            type: 'line',    
            label: '7',
            data: new Array(labels.length).fill(7),
            borderColor: glucoseAfterColor,
            backgroundColor: glucoseAfterColor
          }
        ]
      };
      
      const config = {
          data: graphData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            pointRadius: 0,
            plugins: {
              color: 'black',
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Food and Glucose Data',
                font: {
                    size: 36,
                    family: '"Segoe UI", "Arial", "sans-serif"',
                    weight: 400
                }
              }
            },
            scales: {
                x: {
                  ticks: {
                    maxRotation: 90,
                    minRotation: 90,
                    autoSkip: false,
                    fontSize: 10
                  },
                  suggestedMin: 3
                },
                y: {
                    title: {
                        display: true,
                        text: "Glucose level"
                    }
                }
              }
          },
        };
      
        var myChart = new Chart(
          document.getElementById('myChart'),
          config
        );
}

function makeTable(fetchedData) {
    const tableBody = document.getElementById("table-body");
    fetchedData.forEach(dayRecord => {
        const row = document.createElement("tr");
        tableBody.appendChild(row);
        let date = new Date(dayRecord.date);
        date = makeDate(date);
        const dateCell = document.createElement("td");
        row.appendChild(dateCell);
        dateCell.innerText = date;
        meals.forEach(meal => {
            ['glucose_before', 'food', 'glucose_1hr_after'].forEach(element => {
                const newCell = document.createElement("td");
                newCell.classList.add("w3-center");
                if (dayRecord[meal] && dayRecord[meal][element] != undefined) {newCell.innerText = dayRecord[meal][element]};
                row.appendChild(newCell);
            });
            
        })
    });
}


async function fetchData() {
    const resp = await fetch("/graph_data");
    let data = await resp.json();
    data.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
    // taking last 30 days of records
    data = data.slice(-30);
    console.log("data: ", data);

    makeGraph(data);
    makeTable(data);
    
}

fetchData();

