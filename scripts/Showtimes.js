$(document).ready(function () {
    let selectedDate = '2022/04/01';

    $("#datepicker").val('2022/04/01').datepicker({
        dateFormat: 'yy/mm/dd',
        changeMonth: true,
        changeYear: true,
        yearRange: "2021:2022",
        defaultDate: '2022/04/01',
        onSelect: function (dateText, inst) {
            selectedDate = dateText;
          
        }
    });

   
    
    let printed = false;
    $('#MovieForm').submit(function (event) {
        let selectedLocation = $('#location').val();
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: 'showtimes.json',
            success: function (data) {
                if (printed == true) {
                    location.reload();
                }
                //check selected location is in data
                $.each(data, function (key, value) {
                    
                    //return if both condition is met
                    if ((value.location.search(selectedLocation) != -1)
                        && (value.date.search(selectedDate) != -1)&&printed==false) {
                        buildShowtime(data);
                        //check if it is printed already
                        printed = true;
                    }
                })
                if (printed == false) {
                    location.reload();
                    alert('Location or Date not found!')
                }

                
            }
        })
        
    })

});

function buildShowtime(data) {
    let division = $('#showtimes');
    //total num of movies
    let rowSize = data.length;
    for (let i = 0; i < data.length; i++) {

        var tempTable = $('<table>');

        let movieName = data[i].title;
        let times = data[i].times;


        for (let row = 0; row < times.length; row++) {

            let tr = $('<tr>');

            for (let col = 0; col <= 1; col++) {
                let data = $('<td>');
                //check if movie title and first row
                if (col == 0 && row == 0) {
                    data.text(movieName);
                    data.click(titleOnClick);
                    data.css("cursor", "pointer");
                }
                //check if is time
                else if (col == 1) {
                    data.text(times[row]);
                    data.css("text-align", "right");
                }
                if (row == times.length - 1) {
                    data.css("border-bottom", "1pt solid hotpink");
                }

                //data.attr('id', '' + row + col);

                tr.append(data);

            }
            tempTable.append(tr);


        }
        division.append(tempTable);
    }
}

function titleOnClick() {
    var selected_value = $(this).text();
    getApi(selected_value);
}

function buildInfo(data) {
    let form = $('#formLeft');
    //empty previous data
    form.empty();
    let infoArr = ["Title", "Year", "Genre", "Runtime", "Director", "Writer", "Actors"];
    //append poster
    let poster = $('<img>');
    poster.attr('src', data.Poster)
    poster.attr('width', '250')
    poster.attr('height', '350')
    form.append(poster)
    form.append('<br>');
    for (const info of infoArr) {
        let label = $('<label>');
        label.attr("for", info);
        label.text(info+' ');
        form.append(label);
        for (var key in data) {
            
            let textfield = $('<input>');
            textfield.attr("id", info);
            textfield.attr("type", "text");
            

            if (data.hasOwnProperty(key)&&key==info) {
                //console.log(key + " -> " + data[key]);
                textfield.val(data[key])
                form.append(textfield);
                form.append('<br>');
                form.append('<br>');
            }
        }
        

    }
    
}

function getApi(title) {
    $.ajax({
        type: 'GET',
        url: 'http://www.omdbapi.com/?apikey=' + 'b32f0da4' + '&t='+title,
        success: function (data) {
            buildInfo(data);
        }
    })
}