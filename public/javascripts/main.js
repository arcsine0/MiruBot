$(document).ready(function() {
    $('form').submit(function(e) {
        console.log('uploading file...');
        e.preventDefault();

        $('#memberSection').empty();
        $('#uploadStatus').html('...working file');
        $('#uploadStatus').css({'background-color': 'rgb(252, 255, 58)', 'color': 'white'});

        // send file to server
        var fileData = new FormData(this);
        $.ajax({
            url: '/upload',
            type: 'post',
            processData: false,
            contentType: false,
            data: fileData,
            success: (data) => {
                if (data === 'NO DATA') { 
                    $('#uploadStatus').html('NO FILE ENTERED');
                    $('#uploadStatus').css({'background-color': 'rgb(204, 30, 30)', 'color': 'white'});
                }
                else {
                    let parsedData = JSON.parse(data);
                    parsedData.sort((a, b) => {
                        if (a.name < b.name) { return -1; }
                        if (a.name > b.name) { return 1; }
                        return 0;
                    });
                    processMemberData(parsedData);
                    $('#uploadStatus').html('Done!');     
                    $('#uploadStatus').css({'background-color': 'rgb(49, 255, 83)', 'color': 'black'});
                    $('#hint').fadeIn(1000);
                }
                
            },
            error: (err) => {
                console.log(err);
            }
    
        });
    });
    let addedTab;
    function processMemberData(jsonData) {
        let newName, oldName, memberData, memberIndex = 0, check = false;
        $.each(jsonData, function(i, e) {
            newName = e.name;
            if (newName !== oldName) {
                oldName = newName;
                if (check === true) {
                    $('#memberSection').append(formElement(memberData, memberIndex));
                    check = false;
                }
                memberData = [];
                memberIndex++;
                check = true; 
            }
            memberData.push([newName, e.message, e.label]);
        });
        $('#memberSection').append(formElement(memberData, memberIndex));
    }
    function formElement(arr, i) {
        let affirm = 0, negate = 0, laugh = 0, present = 0, relatedReplies = 0, other = 0, scoreChange;
        let tabElem_table = ``;
        arr.forEach(function (el, i) {
            
            switch(el[2]) {
                case 'affirmation': affirm++; scoreChange = '+5'; break;
                case 'negation': negate++; scoreChange = '+5'; break;
                case 'laughReaction': laugh++; scoreChange = '+2'; break;
                case 'greeting': present++; scoreChange = '+3'; break;
                case 'PossiblyRelatedFeedback': relatedReplies++; scoreChange = '+10'; break;
                default: other++; scoreChange = '+1'; break;
            }
            tabElem_table += `<tr><td>${el[1]}</td><td>${el[2]}</td><td style="text-align: center;">${scoreChange}</td></tr>`;
        })
        let totalMessages = affirm + negate + laugh + present + relatedReplies + other;
        let totalScore = (relatedReplies * 10) + ((affirm + negate) * 5) + (laugh * 2) + (present * 3) + other;
        console.log(totalScore);

        let memberID = 'member#' + i.toString();
        addedTab = '#' + memberID;
        let tabElem_1 =
            `<div class="container memberInfo elastic" id=${memberID}>
                <div class="memberTab row">
                    <div class="memberName col-10">${arr[0][0]}</div>   
                    <div class="scoreBox col-2"><div class="score">${totalScore}pts.</div></div>  
                </div>
                <div class="memberTable">
                    <table class="appTable">
                        <thead>
                            <tr>
                                <th scope="col">Message</th>
                                <th scope="col">Judgement</th>
                                <th scope="col" style="text-align: center;">Score</th>
                            </tr>
                        </thead>
                        <tbody>`;
        

        // score vars
        

        let tabElem_2 = `</tbody></table></div></div>`;
        return tabElem_1 + tabElem_table + tabElem_2;
    }
    $('#memberSection').click(function(e) {
        let targetTable = $($(e.target).parents('.memberInfo')[0]).children('.memberTable')[0];
        $(targetTable).fadeToggle();
    })
});

