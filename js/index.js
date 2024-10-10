import Champion from './Champion.js';

var champions = [];

const button = document.querySelector("button");

button.addEventListener("click", () => {
    document.querySelector('#button').style.visibility = 'hidden';
    document.querySelector('#lols').style.visibility = 'visible';
    startLol();
});
const startLol = async () => {
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/13.18.1/data/es_ES/champion.json");
    const data = await response.json();
    const array = data.data;
    
    const championPromises = Object.entries(array).map(async ([name, champion]) => {
        const champResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/13.18.1/data/es_ES/champion/${champion.id}.json`);
        const champData = await champResponse.json();
        const champ = new Champion(Object.entries(champData.data)[0][1]);
        pushChampion(champ);
    });

    await Promise.all(championPromises);

    await showLol();
};

function pushChampion(champion) {
    champions.push(champion);
}

const showLol = async () => {
    const lols = document.getElementById("lols");

    for (let i = 0; i < champions.length; i++) {
        lols.innerHTML += `
            <div class="card" id="champion-${i}" onclick="showChampionInfo(${i})">
                <img class="champion-image" src="${champions[i].full}" id="back-img-${i}">
                <div class="champion-name">${champions[i].name}</div>
                <div class="champion-title">${champions[i].title}</div>
            </div>`;
    }
}
window.showChampionInfo = (index) => {
    const champion = champions[index];

    const abilitiesHTML = champion.abilities.map((ability) => `
    <div class="ability" onmouseover="showAbilityInfo(event, '${ability.description}','${ability.name}')" onmouseout="hideAbilityInfo()">
        <img src="http://ddragon.leagueoflegends.com/cdn/13.18.1/img/spell/${ability.image.full}" alt="${ability.name}">
    </div>
    `).join('');

    const carouselImages = champion.img.map((skin, i) => `
    <div class="carousel-slide" style="display: ${i === 0 ? 'block' : 'none'};">
        <img src="${skin.url}" alt="Skin ${i + 1}" class="carousel-image">
        <h4 class="skin-name">${skin.name}</h4> <!-- Aquí se muestra el nombre de la skin -->
    </div>
`).join('');


    const modalContent = `
    <div class="modal" id="champion-modal" style="background-image: url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg)">
        <button class="minimize" onclick="closeModal()">&times;</button>
        <div class="modal-content" id="modal-content">
        
            <div class="carousel" id="carousel">
                ${carouselImages}
                <button class="carousel-button prev" onclick="changeSlide(-1)">&#10094;</button>
                <button class="carousel-button next" onclick="changeSlide(1)">&#10095;</button>
            </div>
            <h3 class="modal-champion-name">${champion.name}</h3>
            <h4 class="modal-champion-title">${champion.title}</h4>
            <p class="modal-champion-description">${champion.description}</p>
            <p class="modal-champion-tags">Roles: ${champion.tags}</p>
            <h4>Habilidades</h4>
            <div class="abilities">
                <div class="abilities-list">${abilitiesHTML}</div>
            </div>
            <div class="ability-info" id="ability-info"></div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);

    let currentSlide = 0;


    const changeSlide = (n) => {
        const slides = document.querySelectorAll('.carousel-slide');
        const modal = document.getElementById('champion-modal');
    
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide + n + slides.length) % slides.length;
        slides[currentSlide].style.display = 'block';
        modal.style.backgroundImage = `url(${champion.img[currentSlide].url})`;
    };
    
    const closeModal = () => {
        const modal = document.getElementById('champion-modal');
        if (modal) {
            modal.remove();
        }
    };

    window.changeSlide = changeSlide;
    window.closeModal = closeModal;
};


window.showAbilityInfo = (event, tooltip, name) => {
    const abilityInfo = document.getElementById('ability-info');
    abilityInfo.innerHTML = `
    <h3>${name}</h3>
    <p>${tooltip}</p>
    `;

    abilityInfo.style.display = 'block';

    const tooltipWidth = abilityInfo.offsetWidth;
    const tooltipHeight = abilityInfo.offsetHeight;

    abilityInfo.style.left = `${(window.innerWidth - tooltipWidth) / 2}px`;
    abilityInfo.style.top = `${(window.innerHeight - tooltipHeight) / 2}px`;
}



window.hideAbilityInfo = () => {
    const abilityInfo = document.getElementById('ability-info');
    abilityInfo.style.display = 'none';
}


window.goToSkinsPage = (championId) => {
    window.location.href = `skins.html?champion=${championId}`;
}
