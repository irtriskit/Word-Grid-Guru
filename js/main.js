var cols = 0;
var rows = 0;
var count = 0;
var grid = [];
var wordList = [];

$(document).ready(function() {
    
    $('#rows').focus();
    $('#step2').hide();
    $('#step3').hide();
    $('#results').hide();
    $('#wordGrid').hide();
    $('#print').hide();
    
    $('#chkDictionary').click(function(){
    
       if($(this).is(':checked')){
           $('#txtWordList').attr('disabled','disabled');
           
       } else {
           $('#txtWordList').removeAttr('disabled');
           
       }
       
    });
    
});

async function viewSample() {
    //runs the program against a sample grid and dictionary of words
    
    cols = 10;
    rows = 10;
    count = 0;
    grid = [['o','s','u','s','p','e','n','s','e','s'],['a','r','t','p','k','n','i','v','e','s'],['l','t','n','a','c','p','g','o','r','e'],['o','b','e','w','u','c','i','d','i','u'],['n','t','o','n','m','u','r','d','e','r'],['e','e','r','l','v','t','l','x','l','m'],['z','i','v','y','s','y','i','v','p','y'],['d','x','k','i','l','q','s','m','g','l'],['m','i','o','i','l','y','p','w','e','n'],['z','i','l','d','r','e','a','m','b','o']];
    
	$('#step1').hide();
    $('#step2').hide();
    $('#step3').hide();
    $('#results').hide();
    $('#wordGrid').hide();
    $('#view-sample').hide();
    
    await getResults();
    
}

function saveRowsColumns() {
    
    if ($('#columns').val() == '' || $('#columns').val() == '') {
      
      alert('Please fill out all fields');
    
    }  else {
        
        cols = $('#columns').val();
        rows = $('#rows').val();
        
        $('#step1').hide();
        $('#step2').show();
        $('#letters').focus();
        $('#view-sample').hide();
        
    } 

}

function addLetters() {
    
    var word = $('#letters').val();
    var wordArray = [];
    
    if (word.length != cols){
        
        alert('Please provide the correct number of letters (' + cols + ')');
        
    } else {
        
        for (var i = 0; i < cols; i += 1) {
            
            wordArray[i] = word[i]
            
        }
        
        grid[count] = wordArray;
        
        $('#letters').val('');
        
        count += 1;
        
        if (count == rows) {
            
            $('#step2').hide();
            $('#step3').show();
            
        } else {
            
            $('#letters').focus();
            
        }   
        
    }
    
}

const getDefaultWordList = async function() {

    let response = await fetch('https://raw.githubusercontent.com/irtriskit/Word-Grid-Guru/master/js/words.txt');
    let data = await response.text();

    return data.split('\n');

}

const getResults = async function() {
    
    if ($('#chkDictionary').is(':checked') || $('#txtWordList').val().length == 0) {
        
        var words = await getDefaultWordList();     
        console.log(words);
        for (var i = 0, len = words.length; i < len; i++){
            
            if (words[i].length > 2) {
                
                wordList.push(words[i]);   
                        
            }
            
        }
            
        outputResults();
        
    } else {
        
        wordList = $('#txtWordList').val().split('\n');
        
        outputResults();
        
    }    
    
} 

function outputResults() {
    
	$('#step3').hide();

    //print the entire grid
    $('#wordGrid').append(printGrid());
    $('#wordGrid').show();

	var html = '';
	
    //rows
	html += '<div class="row">';
    html += '	<h3>Rows</h3>';
	html += '	<div class="twelve columns">';
	html += '		<h4>Left to Right</h4>';
    
    for (var i = 0; i < rows; i += 1) {
        html += printArray(getRow(i));
    }
    
	html += '	</div>';
	html += '	<div class="twelve columns">';
    html += '		<h4>Right to Left</h4>';
    
    for (var i = 0; i < rows; i += 1) {
        html += printArray(getRow(i).reverse());
    }
    
	html += '	</div>';
	html += '</div>';

    //columns
	html += '<div class="row">';
    html += '	<h3>Columns</h3>';
	html += '	<div class="twelve columns">';
	html += '		<h4>Top to Bottom</h4>';
    
    for (var i = 0; i < cols; i += 1) {
        html += printArray(getColumn(i));
    }
    
	html += '	</div>';
	html += '	<div class="twelve columns">';
    html += '		<h4>Bottom to Top</h4>';
    
    for (var i = 0; i < cols; i += 1) {
        html += printArray(getColumn(i).reverse());
    }
    
	html += '	</div>';
	html += '</div>';
	
    //diagonals
    //left to right
	html += '<div class="row">';
	html += '	<h3>Diagonals</h3>';
	html += '	<div class="twelve columns">';
	html += '		<h4>Left to Right - Top to Bottom</h4>';
    
    for (var i = rows - 1; i > -1; i -= 1) {
        html += printArray(getDiagonalLR(i,0));
    }
    
    for (var i = 1; i < cols; i += 1) {
        html += printArray(getDiagonalLR(0,i));
    }
    
	html += '	</div>';
	html += '	<div class="twelve columns">';
	html += '		<h4>Left to Right - Bottom to Top</h4>';
    
    for (var i = rows - 1; i > -1; i -= 1) {
    	html += printArray(getDiagonalLR(i,0).reverse());
    }
    
    for (var i = 1; i < cols; i += 1) {
        html += printArray(getDiagonalLR(0,i).reverse());
    }
    
	html += '	</div>';
	html += '</div>';
    
    //right to left
	html += '<div class="row">';
	html += '	<h3>Diagonals</h3>';
	html += '	<div class="twelve columns">';
	html += '		<h4>Right to Left - Top to Bottom</h4>';
    
    for (var i = rows - 1; i > -1; i -= 1) {
        html += printArray(getDiagonalRL(i,cols - 1));
    }
    
    for (var i = cols - 2; i > - 1; i -= 1) {
        html += printArray(getDiagonalRL(0,i));
    }
    
	html += '	</div>';
	html += '	<div class="twelve columns">';
	html += '		<h4>Right to Left - Bottom to Top</h4>';
    
    for (var i = rows - 1; i > -1; i -= 1) {
        html += printArray(getDiagonalRL(i, cols - 1).reverse());
    }
    
    for (var i = cols - 2; i > - 1; i -= 1) {
        html += printArray(getDiagonalRL(0,i).reverse());
    }
    
	html += '	</div>';
	html += '</div>';

	//show results
	$('#results').append(html);
    $('#results').show();
    $('#print').show();
    
}

function getRow(row) {
    //gets the letters for a particular row
    
    var result = [];
    
    for (var i = 0; i < cols; i += 1) {
        
        result[i] = [row,i,grid[row][i]];
        
    }
    
	return result;
    
}

function getColumn(col) {
    //gets the letters for a particular column
    
    var result = [];
    
    for (var i = 0; i < rows; i += 1) {
        
        result[i] = [i,col,grid[i][col]];
        
    }
    
	return result;
    
}

function getDiagonalLR(x,y) {
    //get the letter for a diagonal, based on starting coordinates (x,y), left to right
    
    var result = [];
    var count = 0;
    
    while (x < rows && y < cols) {
        
        result[count] = [x,y,grid[x][y]];
        count += 1;
        x += 1;
        y += 1;
        
    }
    
    return result;
    
}

function getDiagonalRL(x,y) {
    //get the letter for a diagonal, based on starting coordinates (x,y), right to left
    
    var result = [];
    var count = 0;
    
    while (x < rows && y > -1) {
        
        result[count] = [x,y,grid[x][y]];
        count += 1;
        x += 1;
        y -= 1;
        
    }
    
    return result;
    
}

function printGrid() {
    
    var html = '';
    
	html += '<div class="twelve columns">';
    html += '	<table class="results-table">';
    html += '    	<tr>';
    html += '        	<th></th>';
    
    for (var i = 0; i < cols; i += 1) {
        
        html += '        <th>' + i + '</th>';
        
    }   
    
    html += '    	</tr>';
    
    for (var i = 0; i < rows; i += 1) {
        
        html += '    <tr>';
        html += '        <th>' + i + '</th>';
        
        for (var j = 0; j < cols; j += 1) {
            
            html += '        <td class="' + i + '-' + j + '">' + grid[i][j] + '</td>';
            
        }
        
        html += '    </tr>';
    }
    
    html += '	</table>';
	html += '</div>';
    
    return html;
}

function printArray(array) {
    
	var html = '';
    var arrayString = '';
    
    html += '<table class="results-table">';
    html += '    <tr>';
    
    for (var i = 0; i < array.length; i += 1) {
        
        html += '        <td class="result-cell" loc="' + array[i][0] + '-' + array[i][1] + '">' + array[i][2] + '</td>';
        arrayString += array[i][2];
        
    }
    
    html += '    </tr>';
    html += '</table>';

    //get word matches
    var wordMatches = findWords(arrayString);
    
    if (wordMatches.length > 0) {
        
        html += '<p>' + wordMatches.join('<br />') + '</p>';
        
    } else {
        
        html += '<p class="no-matches">No matches</p>';
        
    }
       
    return html;
}

function findWords(searchString) { 
     
    var output = [];
    
    for (var i = 0, len = wordList.length; i < len; i++){
        
        if (searchString.match(wordList[i])) {
            
            output.push(wordList[i]);
            
        }               
        
    }

    return output; 
}

$(document).on('mouseover', '.result-cell', function(){

    $('.' + $(this).attr('loc')).each(function() {
        $(this).addClass('active-letter');
    });

});

$(document).on('mouseout', '.result-cell', function(){

    $('.' + $(this).attr('loc')).each(function() {
        $(this).removeClass('active-letter');
    });

});