
let allData;

const showData = ((data) => {
    // data 하나씩 뽑아서 <article> -> .product-container의 자식으로 넣자 <-HTML
    const productContainerSection = document.getElementsByClassName("product-container")[0];
    
    articleString = "";
    data.forEach(element => {
        articleString += `<article class="product-item">
                <img src="images/${element.image}" alt="${element.name}" class="product-image">
                <div class="product-name">${element.name}</div>
            </article>\n`
    });
    productContainerSection.innerHTML = articleString;

});

const setData = ((data) => {
    allData = data;
    showData(data);
});

const getData = (() => {
    const url = 'js/data.json';
    fetch(url)
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
});
getData();

const searchData = (query) => {
    // console.log(query);
    // data 하나씩 꺼내어, name이랑 query 비교해서 있으며, 모아놓자
    let searchData = allData.filter((oneData) => oneData["name"].includes(query));
    showData(searchData);
}