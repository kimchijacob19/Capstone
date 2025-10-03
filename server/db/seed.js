import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const client = new pg.Client(process.env.DATABASE_URL);

async function seed() {
  try {
    await client.connect();

    // clear existing data in FK order
    await client.query("DELETE FROM favorites");
    await client.query("DELETE FROM spots");
    await client.query("DELETE FROM cities");
    await client.query("DELETE FROM countries");
    await client.query("DELETE FROM continents");
    await client.query("DELETE FROM app_users");

    // continents
    const { rows: continents } = await client.query(`
      INSERT INTO continents (name)
      VALUES 
        ('Europe'), 
        ('Asia'), 
        ('North America'),
        ('South America')
      RETURNING *;
    `);

    // countires
    const { rows: countries } = await client.query(`
      INSERT INTO countries (continent_id, name)
      VALUES
        -- Europe
        (${continents[0].id}, 'Italy'),
        (${continents[0].id}, 'France'),
        (${continents[0].id}, 'Greece'),
        (${continents[0].id}, 'Spain'),
        (${continents[0].id}, 'Portugal'),
        (${continents[0].id}, 'Switzerland'),

        -- Asia
        (${continents[1].id}, 'South Korea'),
        (${continents[1].id}, 'Japan'),
        (${continents[1].id}, 'Taiwan'),
        (${continents[1].id}, 'Maldives'),
        (${continents[1].id}, 'Thailand'),

        -- North America
        (${continents[2].id}, 'USA'),
        (${continents[2].id}, 'Canada'),

        -- South America
        (${continents[3].id}, 'Bolivia'),
        (${continents[3].id}, 'Brazil'),
        (${continents[3].id}, 'Argentina'),
        (${continents[3].id}, 'Colombia'),
        (${continents[3].id}, 'Peru'),
        (${continents[3].id}, 'Chile')
      RETURNING *;
    `);

    // cities
    const { rows: cities } = await client.query(`
      INSERT INTO cities (country_id, name)
      VALUES
        -- Italy
        (${countries[0].id}, 'Pisa'),
        (${countries[0].id}, 'Varenna'),
        (${countries[0].id}, 'Milan'),
        (${countries[0].id}, 'Venice'),

        -- France
        (${countries[1].id}, 'Paris'),

        -- Greece
        (${countries[2].id}, 'Santorini'),

        -- Spain
        (${countries[3].id}, 'Barcelona'),
        (${countries[3].id}, 'Bilbao'),

        -- Portugal
        (${countries[4].id}, 'Lagoa'),
        (${countries[4].id}, 'Sintra'),

        -- Switzerland
        (${countries[5].id}, 'Zürich'),
        (${countries[5].id}, 'Luzern'),
        (${countries[5].id}, 'Interlaken'),

        -- South Korea
        (${countries[6].id}, 'Seoul'),
        (${countries[6].id}, 'Pohang'),

        -- Japan
        (${countries[7].id}, 'Kyoto'),
        (${countries[7].id}, 'Osaka'),
        (${countries[7].id}, 'Sapporo'),

        -- Taiwan
        (${countries[8].id}, 'Taipei'),

        -- Maldives
        (${countries[9].id}, 'Any Island'),

        -- Thailand
        (${countries[10].id}, 'Chiang Mai'),
        (${countries[10].id}, 'Bangkok'),

        -- USA
        (${countries[11].id}, 'Brooklyn, NY'),
        (${countries[11].id}, 'Washington D.C.'),
        (${countries[11].id}, 'San Francisco, CA'),
        (${countries[11].id}, 'Chicago, IL'),
        (${countries[11].id}, 'Savannah, GA'),
        (${countries[11].id}, 'Philadelphia, PA'),

        -- Canada
        (${countries[12].id}, 'Québec City, QC'),
        (${countries[12].id}, 'Niagara Falls, ON'),
        (${countries[12].id}, 'North Vancouver, BC'),
        (${countries[12].id}, 'Peggy''s Cove, NS'),

        -- Bolivia
        (${countries[13].id}, 'Uyuni'),

        -- Brazil
        (${countries[14].id}, 'Rio de Janeiro'),

        -- Argentina
        (${countries[15].id}, 'Buenos Aires'),

        -- Colombia
        (${countries[16].id}, 'Santiago de Cali'),

        -- Peru
        (${countries[17].id}, 'Cusco'),

        -- Chile
        (${countries[18].id}, 'San Pedro de Atacama')
      RETURNING *;
    `);

    // spots
    await client.query(`
      INSERT INTO spots (city_id, name, description, image_url, mode, latitude, longitude)
      VALUES
        -- Italy
        (${cities[0].id}, 'Torre di Pisa', 'A luminous marble tower leaning gently into centuries of Tuscan sky and story.', 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqT7fVADrsia1KPIsuAhQtoL7NSs9fTLC2AnPzuS7rbhYcwhn0rMw0tweK2VO7ECoDPN1xQfRPQt8qvf0wZsCnkRxPDbw7YpcLlb49lCz0cGY7oYOjP2qJtki5oszsTk-f6Mk10=s1360-w1360-h1020-rw', 'day', 43.72116085685959, 10.393673390350804), -- Pisa coords
        (${cities[1].id}, 'Villa Torretta', 'An elegant lakeside refuge where stone walls meet the stillness of Como’s waters.', 'https://www.locationscout.net/italy/69-varenna/46593', 'day', 46.01372493868696, 9.283640352915553), -- Villa Torretta coords
        (${cities[2].id}, 'Stadio San Siro', 'A monumental arena where steel and passion echo through generations of roaring nights.', 'https://media.timeout.com/images/106265614/750/422/image.jpg', 'night', 45.47818599111943, 9.12393162405179), -- San Siro coords
        (${cities[3].id}, 'San Polo', 'A maze of winding alleys where timeless whispers drift between shadowed canals.', 'https://www.locationscout.net/italy/1454-rialto-bridge-from-the-south-venice/108528', 'day', 45.436875137711965, 12.32906617127641), -- San Polo coords

        -- France
        (${cities[4].id}, 'Puente de Bir Hakeim', 'An iron span over the Seine where shadows and light race in quiet rhythm.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg/2560px-Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg', 'night', 48.8557462355394, 2.2881560107384162), -- Pari Bridge coords
        (${cities[4].id}, 'Tour Eiffel', 'A lattice of iron rising into the Parisian sky, shimmering with dreams at dusk.', 'https://plus.unsplash.com/premium_photo-1719430569503-338fc89eb21f?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 48.85867472728321, 2.2944662313736535), -- Tour Eiffel coords
        (${cities[4].id}, 'Moulin Rouge', 'A crimson windmill where nights ignite with glitter, music, and untamed allure.', 'https://images.unsplash.com/photo-1754442984562-9cc1d853e33c?q=80&w=1029&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 48.88421488769941, 2.3323162708189407), -- Moulin Rouge coords

        -- Greece
        (${cities[5].id}, 'Santorini Viewpoint', 'Cliffside horizons where whitewashed walls dissolve into endless blue and fading sun.', 'https://images.unsplash.com/photo-1596933144889-c15043a9ddde?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 36.41703506499614, 25.431881206876625), -- Santorini coords

        -- Spain
        (${cities[6].id}, 'Panoràmic', 'A hilltop gaze where the whole city unfolds beneath shifting Mediterranean light.', 'https://undiaenpareja.com/wp-content/uploads/2020/10/barcelona-panoramic-especial-parejas-undiaenpareja.jpg', 'night', 41.46695790300781, 2.271763470303984), -- Panoramic coords
        (${cities[7].id}, 'Bilboko Donejakue Katedrala', 'Gothic spires rising from narrow streets, where faith and stone endure through centuries.', 'https://image-worker.mindtrip.ai/image-resize/format=webp,w=720/https:/iorigin.mindtrip.ai/attractions/3886/21ae/642d/51c8/ec97/3671/0bed/3823', 'day', 43.25745801637057, -2.923186743418389), -- Bilbao Cathedral coords

        -- Portugal
        (${cities[8].id}, 'Praia da Marinha', 'Golden cliffs embrace a turquoise cove, sculpted by wind and whispered by waves.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/fe/e3/e5/praia-da-marinha.jpg?w=1200&h=1200&s=1', 'day', 37.089717608016905, -8.413121271933615), -- Marinha coords
        (${cities[9].id}, 'Palácio Nacional da Pena', 'A fairytale palace painted in bold hues, crowning the Sintra hills with dreamlike majesty.', 'https://images.unsplash.com/photo-1562195168-c82fea0f0953?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 38.78776905411707, -9.390662546681684), -- Pena Palace coords

        -- Switzerland
        (${cities[10].id}, 'Paradeplatz', 'Glittering facades and quiet trams crossing under the hush of Swiss midnight.', 'https://i0.wp.com/www.lornaelizabethblog.co.uk/wp-content/uploads/2018/12/IMG_2004.jpg?resize=1100%2C1467', 'night', 47.3698432487263, 8.53892995542647), -- Paradeplatz coords
        (${cities[11].id}, 'Rigi Kulm', 'A summit above the lakes where dawn paints the Alps in fleeting fire.', 'https://www.vacationsbyrail.com/media/44590359/mount-rigi-mountain-railway.jpg', 'day', 47.05693026245825, 8.486409094427989), -- Rigi Kulm coords
        (${cities[12].id}, 'Höhematte Park', 'An open meadow framed by peaks, where air, light, and sky stretch without end. Each August, the park transforms as Swiss National Day fireworks scatter brilliance across the alpine night.', 'https://dam.destination.one/195149/8c198d7fd5dcf377dc6d7a11cf172cf52271d2ab7f55e3634868123ae2eae0ba/photo-tours-interlaken-sommer-blumen-hoehematte.jpg', 'both', 46.68655636861185, 7.859951999580709), -- Höhematte coords

        -- South Korea
        (${cities[13].id}, 'Gyeongbokgung Palace', 'An imperial courtyard where tiled roofs meet mountain skies, as visitors in hanbok bring the past alive.', 'https://images.unsplash.com/photo-1682648353194-85d274114ef0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 37.57975301469548, 126.97708391280392), -- Gyeong Palace coords
        (${cities[14].id}, 'Yeongildae Beach', 'A sweeping shore crowned by a pavilion, where sunrise spills gold across the East Sea.', 'https://bestofkorea.com/wp-content/uploads/2025/05/yeongildae-observatory.jpg', 'both', 36.06184672191713, 129.38305196855327), -- Pavilion coords

        -- Japan
        (${cities[15].id}, 'Fushimi Inari Taisha', 'A thousand vermilion gates winding into the mountain, where footsteps echo with whispered prayers.', 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 34.96771382519161, 135.77918722906404), -- Fushimi Inari coords
        (${cities[16].id}, 'Dotonbori', 'Neon riverside streets ablaze with laughter, flavors, and signs that never sleep.', 'https://images.unsplash.com/photo-1565559204102-f59129a70ae2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 34.669090856524996, 135.50130394207702), -- Dotonbori coords
        (${cities[17].id}, 'Odori Park', 'A green ribbon through the city, blooming with festivals and lights across the seasons.', 'https://svcstrg.cld.navitime.jp/travelguide/p01010005/p01010005_07t.jpg', 'both', 43.060654442262724, 141.35294262946041), -- Odori Park coords

        -- Taiwan
        (${cities[18].id}, 'Takemura Izakaya Alley', 'A narrow lane aglow with lanterns, where smoky grills and laughter rise beneath the distant glow of Taipei 101.', 'https://github.com/kimchijacob19/Capstone/blob/main/server/public/images/taipei101.jpg?raw=true', 'both', 25.02558895262824, 121.56924174284042), -- Izakaya coords
        (${cities[18].id}, 'Rainbow Six Crosswalk', 'A kaleidoscope of painted stripes, where city lights and crowds converge in playful rhythm.', 'https://images.unsplash.com/photo-1580745168634-33c78f4c4177?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 25.042721582073685, 121.50760746135192), -- Rainbow Six coords

        -- Maldives
        (${cities[19].id}, 'Island Resort', 'Scattered isles adrift in turquoise seas, where horizons blur into endless serenity.', 'https://images.unsplash.com/photo-1609601546193-f558f1ebb385?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 4.199418293534506, 73.41255784006954), -- Maldives Resort coords

        -- Thailand
        (${cities[20].id}, 'Wat Chedi Luang', 'Ancient brick ruins rising toward the sky, where monks’ chants weave through the heart of the old city.', 'https://images.unsplash.com/photo-1568649479452-4fa420ed8256?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 18.7872130557959, 98.9866233127335), -- Wat Chedi Luang coords
        (${cities[20].id}, 'Wiang Kum Kam', 'A forgotten riverside city where moss-covered ruins whisper of kingdoms long past.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/b1/8d/3e/wat-e-kang.jpg?w=1200&h=-1&s=1', 'day', 18.744881737691394, 98.994352797387), -- Wiang Kum Kam coords
        (${cities[21].id}, 'Hong Sieng Kong Cafe', 'A riverside haven where vintage walls and slow waters frame coffee with a timeless view.', 'https://thesmartlocal.co.th/wp-content/uploads/2021/08/image5-5.jpg', 'both', 13.734825377496911, 100.51158589991881), -- Cafe coords 

        -- USA
        (${cities[22].id}, 'Dumbo', 'Cobblestone streets opening to the river, where the Manhattan Bridge towers like a steel frame for the skyline.', 'https://images.unsplash.com/photo-1540910113367-ad277abb060c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 40.703393843196515, -73.9891547443315), -- Dumbo coords
        (${cities[23].id}, 'National Mall', 'A grand promenade where monuments and memorials stand in solemn dialogue beneath open skies.', 'https://images.unsplash.com/photo-1606189079511-1ee69f8fc165?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 38.889270791726105, -77.04859401063936), -- National Mall coords
        (${cities[24].id}, 'Golden Gate Bridge', 'A crimson span vanishing into Pacific fog, where city and ocean meet in restless embrace.', 'https://images.unsplash.com/photo-1613048998814-4af1bd82fb01?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 37.807862946205105, -122.47519021392694), -- Golden Gate Bridge coords
        (${cities[25].id}, 'Cloud Gate', 'A mirrored sculpture bending sky and skyline into a dreamlike reflection.', 'https://images.unsplash.com/photo-1549533948-77ab8a0d9878?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 41.8827689999739, -87.62330390213121), -- Cloud Gate coords 
        (${cities[26].id}, 'Forsyth Park', 'Shaded by ancient oaks and draped in Spanish moss, where fountains sing at the heart of the South.', 'https://images.unsplash.com/photo-1667869373373-2237060cb446?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'both', 32.06765376819754, -81.09620621587604), -- Forsyth Park coords
        (${cities[27].id}, 'Elfreth''s Alley', 'A narrow street of brick and shutters, where the oldest whispers of America still linger.', 'https://www.visitphilly.com/wp-content/uploads/2017/12/Elfreths-Alley-father-son-c-ridgeway-2200VP.jpg', 'both', 39.95284727030114, -75.1430012445819), -- Elfreth's Alley coords

        -- Canada
        (${cities[28].id}, 'Parc du Bastion-de-la-Reine', 'A leafy stronghold on the old ramparts, where cannon-lined walls overlook the St. Lawrence.', 'https://raw.githubusercontent.com/kimchijacob19/Capstone/refs/heads/main/server/public/images/Reine.jpeg', 'both', 46.80910284568626, -71.20490716046093), -- Goblin Hill coords
        (${cities[29].id}, 'Niagara Falls', 'A thundering curtain of water, where mist crowns the cliffs in endless rainbow light.', 'https://cdn.discoverholidays.io/media/general/n/nfr-dreamstime-l-87290194.webp', 'day', 43.07935314815233, -79.07801565412265), -- Niagara Falls coords 
        (${cities[30].id}, 'Capilano Suspension Bridge Park', 'A swaying path through towering evergreens, where mist and canyon air awaken the senses.', 'https://images.unsplash.com/photo-1652499570221-32d2d91a2362?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 49.34300766487696, -123.11495658864236), -- Capilano Bridge coords
        (${cities[31].id}, 'Peggy''s Cove Lighthouse', 'A solitary beacon on rugged granite, where waves crash endlessly against the Atlantic edge.', 'https://images.unsplash.com/photo-1593664606979-69efba2128d8?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', 44.49177436194027, -63.918672462023885), -- Lighthouse coords

        -- South America
        (${cities[32].id}, 'Uyuni Salt Flat', 'An endless white mirror where sky and earth dissolve into one boundless horizon.', 'https://images.unsplash.com/photo-1670593061290-bce356c349ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', -20.137835529472035, -67.67847541792271), -- Salt Flat coords 
        (${cities[33].id}, 'Cristo Redentor', 'An open-armed giant above Rio, where clouds and city gather beneath a sacred gaze.', 'https://images.unsplash.com/photo-1715530002261-f003b9414fc8?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'day', -22.951809795762276, -43.21051670429733), -- Cristo Redentor coords
        (${cities[34].id}, 'Cid Campeador', 'A fierce horseman cast in bronze, anchoring the crossroads with echoes of medieval legend.', 'https://www.endlessmile.com/images/201105/200408D63b.jpg', 'day', -34.60744396807482, -58.44581351763229), -- Cid coords
        (${cities[35].id}, 'Mariposario Andoke', 'A tropical haven where butterflies rise like confetti, weaving color through the jungle air.', 'https://estaticos.elcolombiano.com/binrepository/780x611/0c46/780d565/none/11101/GLWD/andoke-mariposario-cali-turismo-regenrativo_45852515_20240819195705.jpg', 'day', 3.426293241757665, -76.5719732932531), -- Marioposario coords
        (${cities[36].id}, 'Sapantiana Aqueduct', 'Stone arches hidden in the hillside, where Inca trails still whisper beneath the Spanish flow.', 'https://www.machupicchuperutours.com/wp-content/uploads/sapantiana.jpg', 'day', -13.511667581133816, -71.9780626162773), -- Aqueduct coords
        (${cities[37].id}, 'Iglesia San Pedro', 'Whitewashed adobe walls under the desert sun, where quiet bells mark the passage of centuries.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/c4/ce/9c/nuevo-color-en-la-iglesia.jpg?w=1200&h=-1&s=1', 'day', -22.91069587749055, -68.20056174678166); -- San Pedro coords
    `);

    console.log("🌱 Seed data inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await client.end();
  }
}

seed();
