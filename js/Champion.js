export default class Champion {
    constructor(champ) {
        console.log(champ);
        this.name = champ.name;
        this.title = champ.title;
        this.id = champ.id;
        this.full = "http://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/" + champ.image.full;
        
        this.img = champ.skins.map(skin => ({
            name: skin.name, 
            url: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + champ.id + "_" + skin.num + ".jpg" 
        }));
        
        
        this.description = champ.lore; 
        this.tags = champ.tags.join(', '); 
        this.abilities = champ.spells; 
    }
}
