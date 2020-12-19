const mainQuestions=[
{id:0,
    task:'Keresd meg a képet!',
    taskText:'Valahol a nagyvilágban, egy titkos helyen elrejtettem ezt a képet. Keresd meg, és ha megtaláltad, kattints rá! Ez egy olyan játék, ahol csalni szabad! Nyugodtan nézz utána bárhol, vagy akar keress rá a Google segítségével, ha nem megy fejből a megoldás!',
    imgSrc:'./img/pic/Moscow.jpg',
    imgBounds:[[55.753, 37.62],[55.756, 37.628]],
    tipp:'Ez a fotó egy olyan varosban készült, ami a világ legnagyobb területű országának a fővárosa. Ez az ország olyan nagy, hogy két kontinensen terül el: Európában és Ázsiaban. Az emberek itt cirill betűkkel írnak, és az ország nevet azzal az írásmóddal így kell leírni: Россия, kiejtése pedig : Rosszija. Persze, magyarul maskepp hivjuk az orszagot. Igy mar tudod, hogy melyik lehet, es hogy hivjak a fovarosat, ahol elrejtettem a kepet? A kepen lathato voros szinu varat KREML-nek hivjak, az elotte talalhato tér pedig a Vörös tér. Az eloterben lathato jellegzetes, hagymakupolas templom neve Vaszilij Blazsennij-szekesegyhaz. A tér kozepen lathato voros kockaszeru epulet pedig a Lenin-mauzoleum. Lenin az orszag egyik hires vezetoje volt. Amikor meghalt, testet bebalzsamoztak, és ebben az épületben állították ki, hogy aki meg akarja őt nézni, az akar most is láthassa! az epuletben allitottak ki, hogy aki meg akarja ot nezni, az akar most is lathassa!',
    solved:false
}];

const miniQuestions=[
{id:0,
    question:'Melyik kontinensen található az Amazonas-folyó?',
    questionType:'folyó',
    answ1:'Dél-Amerika',
    answ2:'Ázsia',   
    answ3:'Észak-Amerika',
    answCorr:'Dél-Amerika'
},
{id:1,
    question:'Melyik kontinensen található a Mississippi-folyó?',
    questionType:'folyó',
    answ1:'Dél-Amerika',
    answ2:'Észak-Amerika',   
    answ3:'Ázsia',
    answCorr:'Észak-Amerika'
},
{id:2,
    question:'Melyik kontinensen található a Mekong-folyó?',
    questionType:'folyó',
    answ1:'Afrika',
    answ2:'Észak-Amerika',   
    answ3:'Ázsia',
    answCorr:'Ázsia'
},
{id:3,
    question:'Melyik kontinensen található a Nílus-folyó?',
    questionType:'folyó',
    answ1:'Afrika',
    answ2:'Ausztrália',   
    answ3:'Ázsia',
    answCorr:'Afrika'
},
{id:4,
    question:'Melyik kontinensen található a Volga-folyó?',
    questionType:'folyó',
    answ1:'Afrika',
    answ2:'Európa',   
    answ3:'Ázsia',
    answCorr:'Európa'
},
{id:5,
    question:'Melyik országon folyik keresztül a Jangce-folyó?',
    questionType:'folyó',
    answ1:'Egyiptom',
    answ2:'India',   
    answ3:'Kína',
    answCorr:'Kína'
},
{id:6,
    question:'Melyik országon folyik keresztül a Jenyiszej-folyó?',
    questionType:'folyó',
    answ1:'Oroszország',
    answ2:'Brazília',   
    answ3:'Kína',
    answCorr:'Oroszország'
},
{id:7,
    question:'Melyik országon folyik keresztül a Sárga-folyó?',
    questionType:'folyó',
    answ1:'Kanada',
    answ2:'Kína',   
    answ3:'Németország',
    answCorr:'Kína'
},
{id:8,
    question:'Melyik ország fővárosa Madrid?',
    questionType:'város',
    answ1:'Olaszország',
    answ2:'Portugália',   
    answ3:'Spanyolország',
    answCorr:'Spanyolország'
},
{id:9,
    question:'Melyik ország fővárosa New York?',
    questionType:'város',
    answ1:'egyiké sem',
    answ2:'Amerikai Egyesült Államok',   
    answ3:'Kanada',
    answCorr:'egyiké sem'
},
{id:10,
    question:'Melyik ország fővárosa Dublin?',
    questionType:'város',
    answ1:'Skócia',
    answ2:'Írország',   
    answ3:'Izland',
    answCorr:'Írország'
},
{id:11,
    question:'Melyik ország fővárosa Stockholm?',
    questionType:'város',
    answ1:'Finnország',
    answ2:'Dánia',   
    answ3:'Svédország',
    answCorr:'Svédország'
},
{id:12,
    question:'Melyik ország fővárosa Helsinki?',
    questionType:'város',
    answ1:'Finnország',
    answ2:'Dánia',   
    answ3:'Svédország',
    answCorr:'Finnország'
},
{id:13,
    question:'Melyik ország fővárosa Párizs?',
    questionType:'város',
    answ1:'Németország',
    answ2:'Franciaország',   
    answ3:'Belgium',
    answCorr:'Franciaország'
},
{id:14,
    question:'Melyik ország fővárosa Varsó?',
    questionType:'város',
    answ1:'Litvánia',
    answ2:'Oroszország',   
    answ3:'Lengyelország',
    answCorr:'Lengyelország'
},
{id:15,
    question:'Melyik ország fővárosa Tokió?',
    questionType:'város',
    answ1:'Japán',
    answ2:'Kína',   
    answ3:'Vietnám',
    answCorr:'Japán'
},
{id:16,
    question:'Melyik ország fővárosa Hanoi?',
    questionType:'város',
    answ1:'Japán',
    answ2:'Vietnám',   
    answ3:'Laosz',
    answCorr:'Vietnám'
},
{id:17,
    question:'Melyik ország fővárosa Kairó?',
    questionType:'város',
    answ1:'Algéria',
    answ2:'Marokkó',   
    answ3:'Egyiptom',
    answCorr:'Egyiptom'
},
{id:18,
    question:'Melyik ország fővárosa Nairobi?',
    questionType:'város',
    answ1:'Kenya',
    answ2:'Tanzánia',   
    answ3:'Mozambik',
    answCorr:'Kenya'
},
{id:19,
    question:'Melyik ország fővárosa Buenos Aires?',
    questionType:'város',
    answ1:'Uruguay',
    answ2:'Argentína',   
    answ3:'Chile',
    answCorr:'Argentína'
},
{id:20,
    question:'Melyik ország fővárosa Washington?',
    questionType:'város',
    answ1:'Mexikó',
    answ2:'Kanada',   
    answ3:'Amerikai Egyesült Államok',
    answCorr:'Amerikai Egyesült Államok'
},
{id:21,
    question:'Mi Csehország fővárosa?',
    questionType:'város',
    answ1:'Prága',
    answ2:'Pozsony',   
    answ3:'Ljubljana',
    answCorr:'Prága'
},
{id:22,
    question:'Mi Törökország fővárosa?',
    questionType:'város',
    answ1:'Izmir',
    answ2:'Ankara',   
    answ3:'Isztanbul',
    answCorr:'Ankara'
},
{id:23,
    question:'Mi Görögország fővárosa?',
    questionType:'város',
    answ1:'Thesszaloniki',
    answ2:'Larnaka',   
    answ3:'Athén',
    answCorr:'Athén'
},
{id:24,
    question:'Mi Portugália fővárosa?',
    questionType:'város',
    answ1:'Lisszabon',
    answ2:'Porto',   
    answ3:'Madrid',
    answCorr:'Lisszabon'
},
{id:25,
    question:'Mi Belgium fővárosa?',
    questionType:'város',
    answ1:'nincs fővárosa',
    answ2:'Brüsszel',   
    answ3:'Amszterdam',
    answCorr:'Brüsszel'
},
{id:26,
    question:'Mi az Egyesült Királyság fővárosa?',
    questionType:'város',
    answ1:'Anglia',
    answ2:'Dublin',   
    answ3:'London',
    answCorr:'London'
},
{id:27,
    question:'Mi Ukrajna fővárosa?',
    questionType:'város',
    answ1:'Kiev',
    answ2:'Kursk',   
    answ3:'Lvov',
    answCorr:'Kiev'
},
{id:28,
    question:'Mi Fehéroroszország fővárosa?',
    questionType:'város',
    answ1:'nincs is ilyen ország',
    answ2:'Minsk',   
    answ3:'Moszkva',
    answCorr:'Minsk'
},
{id:29,
    question:'Mi Kolumbia fővárosa?',
    questionType:'város',
    answ1:'Medellin',
    answ2:'Cali',   
    answ3:'Bogota',
    answCorr:'Bogota'
},
{id:30,
    question:'Mi Irán fővárosa?',
    questionType:'város',
    answ1:'Teherán',
    answ2:'Isfahan',   
    answ3:'Kabul',
    answCorr:'Teherán'
},
{id:31,
    question:'Mi Mexikó fővárosa?',
    questionType:'város',
    answ1:'California',
    answ2:'Mexikóváros',   
    answ3:'San Jose',
    answCorr:'Mexikóváros'
},
];



export { mainQuestions, miniQuestions };