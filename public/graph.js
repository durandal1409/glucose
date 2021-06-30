async function fetchGraphData() {
    const resp = await fetch("/graph_data");
    const graphData = await resp.json();
    graphData.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
    console.log("graphData: ", graphData);
    const meals = ['breakfast', 'second_breakfast', 'lunch', 'afternoon_tea', 'dinner', 'second_dinner'];
    const arraysForGraphs = graphData.map(el => {
        let labelsArr = [];
        let glucoseBeforeArr = [];
        let glucoseAfterArr = [];
        let foodsArr = [];
        let date = new Date(el.date);
        date = date.getDate() + '.' + (date.getMonth() + 1);
        for (let key in el) {
            if (meals.includes(key) && (el[key].glucose_before|| el[key].glucose_1hr_after)) {
                // console.log("here: ", key, el[key].glucose_before, el[key].glucose_1hr_after, el[key].food);
                labelsArr.push(key + ' ' + date);
                glucoseBeforeArr.push(el[key].glucose_before);
                glucoseAfterArr.push(el[key].glucose_1hr_after);
                foodsArr.push(el[key].food);
            }
        };
        return {labelsArr, glucoseBeforeArr, glucoseAfterArr, foodsArr};
    });
    // console.log("arrs: ", arraysForGraphs);

    // making graph
    const labels = arraysForGraphs.map(el => el.labelsArr).flat();
    const dataGlucoseBefore = arraysForGraphs.map(el => el.glucoseBeforeArr).flat();
    const dataGlucoseAfter = arraysForGraphs.map(el => el.glucoseAfterArr).flat();
    const dataFoods = arraysForGraphs.map(el => el.foodsArr).flat();
    // console.log(labels, dataGlucoseBefore, dataGlucoseAfter);
    const glucoseBeforeColor = '#7ea60a';
    const glucoseAfterColor = '#431076';
    const data = {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'перед едой',
            data: dataGlucoseBefore,
            backgroundColor: glucoseBeforeColor
          },
          {
            type: 'bar',    
            label: 'через 1ч после еды',
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
          data: data,
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
    
        // making table
        const tableBody = document.getElementById("table-body");
        graphData.forEach(el => {
            const row = document.createElement("tr");
            tableBody.appendChild(row);
            let date = new Date(el.date);
            date = date.getDate() + '.' + (date.getMonth() + 1);
            const dateCell = document.createElement("td");
            row.appendChild(dateCell);
            dateCell.innerText = date;
            meals.forEach(meal => {
                ['glucose_before', 'food', 'glucose_1hr_after'].forEach(element => {
                    const newCell = document.createElement("td");
                    newCell.classList.add("w3-center");
                    if (el[meal] && el[meal][element] != undefined) {newCell.innerText = el[meal][element]};
                    row.appendChild(newCell);
                });
               
            })
        })

    // return graphData;
}

fetchGraphData();

