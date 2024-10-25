// selection-item 요소들 가져오자
const selectionItemDivs = document.getElementsByClassName('selection-item');

//  네 개의 페이지 요소 가져오자
const calendarDiv = document.getElementById("calendar");
const selectionWashingmachineTimeDiv = document.getElementById('selection-washingmachine-time');
const selectionRoomNameDiv = document.getElementById("selection-room-name");
const boardDiv = document.getElementById("board");

const pageDivs = [calendarDiv, selectionRoomNameDiv, selectionWashingmachineTimeDiv, boardDiv];

const setPage = (page) => {
    //clear selection
    for (const selectionItemDiv of selectionItemDivs) {
        selectionItemDiv.classList.remove('select-menu');
    }

    // selection 칠하자
    selectionItemDivs[page-1].classList.add('select-menu');


    // clear pageDiv
    pageDivs.forEach(pageDiv => {
        pageDiv.style.display = 'none';
    })

    // show pageDiv
    pageDivs[page-1].style.display = 'block';
}
