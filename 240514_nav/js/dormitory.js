let allData;            // 초기 설정에 필요한 모든 데이터 : 세탁기, 시간, 호실
let weeklyReservations;  // 미리 정해진 요일별 예약
let newReservation;        // 사용자가 새롭게 지금 입력하는 예약 정보. 1페이지에서 초기화하자
let reservations = [];        // 사용자가 예약한 정보들의 덩어리



// selection-item 요소들 가져오자
const selectionItemDivs = document.getElementsByClassName('selection-item');

//  네 개의 페이지 요소 가져오자
const calendarDiv = document.getElementById("calendar");
const selectionWashingmachineTimeDiv = document.getElementById('selection-washingmachine-time');
const washingmachineSelect = document.getElementById("washingmachine");
const timeSelet = document.getElementById("time");
const selectionRoomNameDiv = document.getElementById("selection-room-name");
const boardDiv = document.getElementById("board");
const roomSelect = document.getElementById("room");
const nameInput = document.getElementById("name");
const boardContainerDiv = document.getElementsByClassName("board-container")[0];
let boardContainerDivInitString = boardContainerDiv.innerHTML;

const pageDivs = [calendarDiv, selectionWashingmachineTimeDiv, selectionRoomNameDiv, boardDiv];

// 초기 데이터 가져오자. allData.json, weekly-reservation.json 
const initData = () => {
    const getAllData = () => {
        const url = 'js/allData.json';
        fetch(url)
        .then(response => response.json())
        .then(data => allData = data)
        .catch(error => console.log(error.message));
    }
    const getWeeklyReservation = async () => {
        const url = 'js/weekly-reservation.json';
        try{
            const response = await fetch(url);
            const data = await response.json();
            weeklyReservations = data;
        } catch(error){
            console.log(error.message);
        }
    }
    getAllData();
    getWeeklyReservation();
}

const setPage = (page) => {
    //clear selection
    for (const selectionItemDiv of selectionItemDivs) {
        selectionItemDiv.classList.remove('select-menu');
    }

    // selection 칠하자
    if (page != 4){ // 세탁기 예약 현황표는 selection이 없음
        selectionItemDivs[page-1].classList.add('select-menu');
    }

    // clear pageDiv
    pageDivs.forEach(pageDiv => {
        pageDiv.style.display = 'none';
    })

    // show pageDiv
    pageDivs[page-1].style.display = 'block';

    if(page === 1){
        // localStorage에 저장한 예약들 가져오자
        const storedReservations = localStorage.getItem("reservations");
        if (storedReservations) {
            reservations = JSON.parse(storedReservations);  // string => JSON
            reservations.map((reservation) => reservation.date = new Date(reservation.date))  // .data에 저장된 string -> Date 객체로 바꾸자
        } else {            // 저장된 예약들이 없으면(아예 예약 완료 버튼 안 눌렀을 때)
            reservations = [];
        }
    } else if(page === 2){ // 시간 선택: 세탁기, 시간
        initWashingmachineTime();
    } else if(page === 3){ // 호실 이름
        // 세탁기 번호, 시간 보관하자
        newReservation.washingmachine = washingmachineSelect.value; // 세탁기 option에서 사용자가 선택한 세탁기의 value속성값을 가져오자
        newReservation.time = timeSelet.value; // 시간 option에서 사용자가 선택한 시간의 value속성값을 가져오자
        initRoomName();
    } else if(page === 4){ // 세탁기 예약 현황표
        // 호실, 이름 보관하자
        newReservation.room = roomSelect.value;
        newReservation.name = nameInput.value;
        
        reservations.push(newReservation);
        
        initTable();
    }
}

const clickDate = (event) => {
    // 예약 정보 초기화하자 
    newReservation = {
        "name" : undefined,
        "room" : undefined,
        "date" : undefined,
        "time" : undefined,
        "washingmachine" : undefined,
        "notification" : true
    }
    // 날짜 data 가져오자
    const dateString = event.target.dataset.date;
    console.log(dateString);
    const dateDate = new Date(dateString);
    // 날짜 data 보관하자 
    newReservation.date = dateDate;
    // 2페이지로 가자
    setPage(2);
}

initData();
setPage(1);

const initWashingmachineTime = () => {
    let allWashingmachineTime = {};
    let washingmachines; // 세탁기 번호 모음

    // 기숙사에 있는 모든 세탁기, 시간 정보 가져오자
    // console.log(allData);
    // console.log(allData.washingmachine); // [1, 2, 3]
    // console.log(allData.time);
    // console.log(Object.keys(allData.time)); //["1" "2", "3"]


    // 미리 예약된 정보 가져오자
    // console.log(weeklyReservations);

    // 초기 데이터 세팅하자 : {"1": ["1", "2", "3"],  ....}
    // allData.washingmachine에서 하나씩 꺼내자
    allData.washingmachine.forEach((washingmachine) => {
        allWashingmachineTime[washingmachine] = Object.keys(allData.time);
    });
    // console.log(allWashingmachineTime);

    // 선택한 날짜의 요일 구하자
    let weekday = newReservation.date.getDay();

    // 그 요일의 미리 예약된 세탁기와 시간 파악하자
    // 예약된게 있으면 select 목록에서 빼자
    weeklyReservations.forEach((weeklyReservation) => {
        if (weeklyReservation.weekday === weekday){
            const { washingmachine, time } = weeklyReservation;
            // const washingmachine = weeklyReservation.washingmachine;
            // const time = weeklyReservation.time;
            const index = allWashingmachineTime[washingmachine].indexOf(String(time));
            if(index > -1){
                allWashingmachineTime[washingmachine].splice(index, 1); // 시간 삭제
            }
        }
    })
    
    //사용자가 예약한 내용도 위의 것을 다 파악해서 빼자
    reservations.forEach((reservation) => {
        // 사용자가 예약한 날짜와 지금 입력하고 있는 새로운 예약의 날짜가 같으면, 그 세탁기 번호의 시간을 빼자
        if (reservation.date.getFullYear() == newReservation.date.getFullYear() && reservation.date.getMonth() == newReservation.date.getMonth() && reservation.date.getDate() == newReservation.date.getDate()){
            const { washingmachine, time} = reservation;
            const index = allWashingmachineTime[washingmachine].indexOf(String(time));
            if(index > -1){
                allWashingmachineTime[washingmachine].splice(index, 1); // 시간 삭제
            }
        }   
    })
    
    // select 들 만들자 : 세탁기 번호, 시간들 만들자
    washingmachineSelect.innerHTML = ""; // 세탁기 option없애자
    washingmachines = Object.keys(allWashingmachineTime);
    // 예약할 시간이 없으면, 세탁기 번호도 빼자
    washingmachines = washingmachines.filter((washingmachine) => allWashingmachineTime[washingmachine].length > 0);

    // <option value="1">1번 세탁기</option>
    washingmachines.forEach((washingmachine) => {
        const newOption = document.createElement("option");
        newOption.value = washingmachine;
        newOption.text = `${washingmachine}번 세탁기`;
        washingmachineSelect.appendChild(newOption);
    });

    const initTime = () => {
        const selectWashingmachine = washingmachineSelect.value; // 선택한 세탁기 option의 value
        timeSelet.innerHTML = ""; // 시간 option없애자
        allWashingmachineTime[selectWashingmachine].forEach((time) => {
            // <option value="1">...시간...</option>
            const newOption = document.createElement("option");
            newOption.value = time;
            newOption.textContent = allData.time[time];
            timeSelet.appendChild(newOption);
        });
    }
    initTime();

    // 세탁기 번호가 바뀌면, 다시 시간을 불러오자
    washingmachineSelect.onchange = initTime;

    // 3page에 세탁기, 시간 넘기자
}

const initRoomName = () => {
    // 모든 호실 표시하자
    // allData에서 방 정보 가져와서 <option value="401">401호</option> 만들고 roomSelect에 자식으로 붙이자
    let rooms = allData["room"];
    // console.log(rooms);
    let optionString = "";
    rooms.forEach((room) => {
        optionString += `<option value="${room}">${room}호</option>`;
    });
    // console.log(optionString);
    roomSelect.innerHTML = optionString;

    // 이름 초기화
    nameInput.value = "";
    // 4page에 호실, 이름 넘기자

}
const initTable = () => {
    // 사용자가 예약한 내용들(reservations) 보여주자
    // .board-container 내용 뒤에, <div class="item">내용들</div>
    let itemString = boardContainerDivInitString;
    
    reservations.forEach((reservation) => {
        const year = reservation.date.getFullYear();
        const month = reservation.date.getMonth() + 1;
        const date = reservation.date.getDate();
        itemString += `
                <div class="item">${reservation.name}</div>
                <div class="item">${reservation.room}호</div>
                <div class="item">${year}년 ${month}월 ${date}일</div>
                <div class="item">${allData["time"][reservation.time]}</div>
                <div class="item">${reservation.washingmachine}번 세탁기</div>
                <div class="item">${reservation.notification ? "🔔⭕" : "🔔❌"}</div>
        `
    });
    boardContainerDiv.innerHTML = itemString;
}

const saveReservations = () => {
    // 원래는 백엔드에 reservations 정보를 넘겨서 데이터베이스에 저장해야 함. 3학년 유병석, 박지우, 신혜정 선생님께 배우세요.
    // 그냥 로컬에 기록해둘 것이다. LocalStorage 라는 친구
    // alert("예약 완료");
    localStorage.setItem("reservations", JSON.stringify(reservations));
}