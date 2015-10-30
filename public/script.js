var table = '<table class="table table-striped table-hover">' +
        '<thead>' +
            '<tr>' +
                '<th>Felvétel ideje</th>' +
                '<th>Név</th>' +
                '<th>Telefonszám</th>' +
                '<th>Foglalkozás</th>' +
            '</tr>'    +
        '</thead>' +
        '<tbody>' +
            
        '</tbody>' +
    '</table>';

$('table').each(function () {
    console.log('alma');
    var successTable = $(table);
    var warningTable = $(table);
    
    $(this).find('tr.text-success').each(function () {
        successTable.find('tbody').append($(this));
    });
    $(this).find('tr.text-warning').each(function () {
        warningTable.find('tbody').append($(this));
    });
    warningTable.appendTo('div.container');
    successTable.appendTo('div.container');
    $(this).hide();
});